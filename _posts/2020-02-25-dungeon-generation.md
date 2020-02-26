---
layout: post
title:  Dungeon Generation
excerpt: Procedural dungeon creation for a roguelike
---

This post is about my implementation of a technique for generating random dungeons, first described by [TinyKeepDev](https://www.reddit.com/r/gamedev/comments/1dlwc4/procedural_dungeon_generation_algorithm_explained/), then again by [Gamasutra](https://www.gamasutra.com/blogs/AAdonaac/20150903/252889/Procedural_Dungeon_Generation_Algorithm.php).

The goal of this technique is to make an organic feeling dungeon, in my case for a roguelike dungeon crawling game.

## The Result
After the algorithm runs, I produce a topology of a dungeon of rooms connected by hallways:

<div class="image-feature">
  <img src="/projects/dungeon/final.png">
</div>

## Room Creation
Room size is random, but constrained by a minimum and maximum width and a ratio of width to height.

For room size generation, the distribution is skewed so there are slightly more smaller rooms than larger rooms, which produces more nooks and crannies and less long, boring hallways. Rooms are placed randomly within a circle centered at the center of the map (`WIDTH/2, HEIGHT/2`)

```js
const MAX_WIDTH = 10;
const MAX_HEIGHT = 10;
const MAX_WIDTH_TO_HEIGHT = 2;
const MIN_WIDTH_TO_HEIGHT = 1 / 2;

// helpers
const boundX = value => {
    return Math.max(0, Math.min(WIDTH - 1, value));
};

const boundY = value => {
    return Math.max(0, Math.min(HEIGHT - 1, value));
};

// skewed randomization
const randn = (min, max, skew) => {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 5.0 + 0.5;
    num = Math.pow(num, skew);
    num *= max - min;
    num += min;
    return num;
};

const cartesianToGrid = ({ x, y }) => {
    return {
        x: boundX(snap(x + Math.floor(WIDTH / 2))),
        y: boundY(snap(Math.floor(HEIGHT / 2) - y))
    };
};

const randomPointInCircle = radius => {
    const angle = Math.random() * 2 * Math.PI;
    const pointRSquared = Math.random() * radius * radius;
    const pointX = Math.sqrt(pointRSquared) * Math.cos(angle);
    const pointY = Math.sqrt(pointRSquared) * Math.sin(angle);
    const center = {
        x: pointX,
        y: pointY
    };
    return cartesianToGrid(center);
};

const width = Math.floor(randn(MIN_WIDTH, 10, 2));
const height = Math.floor(
    randn(MIN_WIDTH, width * MAX_WIDTH_TO_HEIGHT, 2)
);
```

After this step, a cluster of randomly generated rooms looks like this:

<div class="image-feature">
  <img src="/projects/dungeon/initial.png">
</div>

Without borders it's difficult to see, but many of the rooms are overlapping with one another. The southern edge, for example, has rooms 28, 66, 52, and 16 intersecting with one another.

To fix, that the rooms are treated as physics bodies and relaxed.

## Dungeon Relaxation

Dungeon relaxation is performed with separation steering. Rooms are treated as individual agents who act according to their neighbors. Their instinct is to move away from any room near them.

```js
const intersect = (roomA, roomB) => {
    return !(
        roomA.right < roomB.left ||
        roomA.left > roomB.right ||
        roomA.top > roomB.bottom ||
        roomA.bottom < roomB.top
    );
};

const relaxRooms = rooms => {
    // deep copy
    rooms = [...rooms];
    // initialize physics bodies
    const roomBodies = [...rooms].map(room => {
        return {
            ...room,
            force: new Vector({ x: 0, y: 0 }),
            neighbors: 0
        };
    });

    let updated = false;

    // n-squared view of each agent and each potential neighbor
    for (let i = 0; i < roomBodies.length; i++) {
        const agent = roomBodies[i];
        for (let j = 0; j < roomBodies.length; j++) {
            if (i === j) {
                continue;
            }
            const neighbor = roomBodies[j];
            if (intersect(agent, neighbor)) {
                const separation = new Vector(agent.center).subtract(
                    neighbor.center
                );
                // force stacked rooms to move away from eachother in a random direction
                if (separation.x === 0)
                    separation.x = (1 - 2 * Math.random()) * 0.5;
                if (separation.y === 0)
                    separation.y = (1 - 2 * Math.random()) * 0.5;
                const agentWidth = agent.right - agent.left + 2;
                const agentHeight = agent.bottom - agent.top + 2;
                const xHeading = separation.x < 0 ? -1 : 1;
                const yHeading = separation.y < 0 ? -1 : 1;
                const pushForce = new Vector({
                    x:
                        xHeading < 0
                            ? separation.x - agentWidth
                            : separation.x + agentWidth,
                    y:
                        yHeading < 0
                            ? separation.y - agentHeight
                            : separation.y + agentHeight
                });
                const mass = agentWidth * agentHeight;
                // massive rooms move less than small rooms, to encourage small rooms to fill gaps
                const totalForce = agent.force.add(pushForce.div(mass));
                agent.force = totalForce;
                updated = true;
                agent.neighbors++;
            }
        }
        if (
            agent.neighbors > 0 &&
            (agent.force.x === 0 || agent.force.y === 0)
        ) {
            agent.force = new Vector({
                x: 1 - FORCE_SCALE * Math.random(),
                y: 1 - FORCE_SCALE * Math.random()
            });
        }
        // normalize by the number of neighbors who pushed it
        agent.force = agent.force.div(Math.max(1, agent.neighbors));
    }
    // move neighbors by their velocity
    for (let i = 0; i < roomBodies.length; i++) {
        let room = rooms[i];
        let body = roomBodies[i];
        let force = { x: snap(body.force.x), y: snap(body.force.y) };

        rooms[i] = {
            ...room,
            center: {
                x: room.center.x + force.x,
                y: room.center.y + force.y
            },
            left: room.left + force.x,
            right: room.right + force.x,
            top: room.top + force.y,
            bottom: room.bottom + force.y
        };
    }
    return [rooms, updated];
};
```

Each pair of rooms is compared, and intersecting rooms gain a velocity equal to the difference between their separation and width. If a room is directly on top of another, it will be propelled away with a force relative to how much of their area overlaps.

Because everything is constrained to a cell's width, there's very little space for rooms to settle in next to one another. This means that relaxing takes a long time while chain reactions send rooms bouncing through the system.

<div class="image-feature">
  <img src="/projects/dungeon/jiggle.gif">
  <div class="caption">Rooms jiggling to steer away from eachother</div>
</div>

This repeats until the rooms have stopped jiggling around. Then hallways are made.

## Hallways

Hallways are produced by
1. Selecting important rooms
2. Performing Delaunay Triangulation to create edges between the important rooms
3. Running a breadth-first search to create a minimum spanning tree between important rooms, then reintroducing some edges for fun
5. Drawing hallways based on connected rooms' relative geometry.

### 1. Important Rooms
```js
const importantRooms = rooms.filter(room => {
    const width = room.right - room.left;
    const height = room.bottom - room.top;
    return (
        width >= IMPORTANT_WIDTH &&
        height >= IMPORTANT_HEIGHT &&
        width / height > 0.5
    );
});
```
Important rooms are at least 4 wide, 4 tall, and aren't more than twice as tall as they are wide.

### 2. Delaunay Triangulation
I'm using [delaunator](https://github.com/mapbox/delaunator) for triangulation:

```js
const delaunay = Delaunator.from(centers);
const triangles = delaunay.triangles;
let coordinates = [];
let edges = [];
for (let i = 0; i < triangles.length; i += 3) {
    coordinates.push([
        centers[triangles[i]],
        centers[triangles[i + 1]],
        centers[triangles[i + 2]]
    ]);
    let center1 = centers[triangles[i]];
    let center2 = centers[triangles[i + 1]];
    let center3 = centers[triangles[i + 2]];
    let room1Index = centerToRoomIndex[`${center1[0]},${center1[1]}`];
    let room2Index = centerToRoomIndex[`${center2[0]},${center2[1]}`];
    let room3Index = centerToRoomIndex[`${center3[0]},${center3[1]}`];
    edges.push(
        [room1Index, room2Index],
        [room2Index, room3Index],
        [room3Index, room1Index]
    );
}
```

### 3. Breadth-First Search
First, I create nodes an annotate their neighbors from the edges produced by triangulation.

```js
let nodes = rooms.reduce((acc, room, index) => {
    acc[room.index] = {
        parents: [],
        visited: false,
        neighbors: [],
        index: room.index
    };
    return acc;
}, {});

nodes = edges.reduce((acc, [left, right]) => {
    acc[left].neighbors.push(nodes[right]);
    return acc;
}, nodes);
```

I perform a breadth-first search using those nodes:

```js
let queue = [];
let start = nodes[Object.keys(nodes)[0]];
start.visited = true;
queue.push(start);
while (queue.length) {
    let v = queue.shift();
    let neighbors = v.neighbors;
    neighbors.forEach(neighbor => {
        if (!neighbor.visited) {
            neighbor.visited = true;
            neighbor.parents.push(v.index);
            queue.push(neighbor);
        }
    });
}

// a little extra...just for you :)
edges.forEach(([left, right]) => {
    if (Math.random() < 0.3) {
        nodes[left].parents.push(right);
    }
});
```

I annotate those parents on the rooms:

```js
const annotatedRooms = rooms.map(room => {
    let parents = nodes[room.index].parents.map(idx => {
        return roomLookup[idx];
    });
    return { ...room, parents };
});
```

### 5. Drawing Hallways
This is the worst code in here. Hallways can either be vertical, horizontal, or elbows, depending on how the connected rooms are configured.

Vertical hallways:
```
|______|
    ______
   |      |
  or
   |______|
 ______
|      |
```

Horizontal hallways:
```
_
 |  _
 | |
_| |
   |_
 or
    _
   |
_  |
 | |_
 |
_|
```

The two kinds of elbows:

```
 RIGHT MAJOR
 -----------
 LT --
      |
      RB
  or
      RT
      |
 LB --

 UP MAJOR
 --------
  -- RT
 |
 LB
  or
 LT
  |
   -- RB
```
Where `LB` is "left bottom," etc.

Hallways are always drawn bottom to top, left to right.
I define these by 4 coordinates, `lx`, `ly`, `rx`, and `ry`, meaning the `x` and `y` coordinates of the left and right rooms. I'm sure there's better ways to do this.

```js
{
    lx:
        major === "right"
            ? boundX(leftRoom.right - 1)
            : boundX(leftRoom.center.x),
    rx:
        major === "right"
            ? boundX(rightRoom.center.x)
            : boundX(rightRoom.left - 1),
    ry:
        major === "right"
            ? ascending
                ? boundY(rightRoom.bottom - 1)
                : boundY(rightRoom.top)
            : boundY(rightRoom.center.y),
    ly:
        major === "right"
            ? boundY(leftRoom.center.y)
            : ascending
            ? boundY(leftRoom.top - 1)
            : boundY(leftRoom.bottom)
};
```

Here's the map with hallways annotated.

<div class="image-feature">
  <img src="/projects/dungeon/halls.png">
  <div class="caption">Hallways drawn onto the map</div>
</div>

`v` is a vertical hallway
`h` is a horizontal hallway
`r` is the horizontal portion of any right major hallway
`ra` is the ascending portion of an ascending right major hallway
`rd` is the descending portion of a descending right major hallway
`u` is the horizontal portion of any up major hallway
`ua` is the ascending portion of an ascending up major hallway
`ud` is the descending portion of a descending up major hallway


## Summary
I don't love this method. I end up with a lot of long hallways that are connected to small little alcoves that just happened to be in the way of a hallway. The rooms are all pretty boringly square.

I'm going to be implementing dungeon generation with accretion based on [Brogue's strategy](https://www.rockpapershotgun.com/2015/07/28/how-do-roguelikes-generate-levels/) and I'll post about that later.
