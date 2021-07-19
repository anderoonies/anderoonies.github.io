---
layout: post
title:  r/roguelikedev Does The Complete Roguelike Tutorial - Week 3
excerpt: Generating monsters
meta: /projects/brogue/youseeaneel.gif

---

Week 3 of the tutorial requires placing monsters in the dungeon.
In `libtcod` this is pretty straightforward, but I needed to turn to Brogue for inspiration on how to place monsters.

## Brogue Monster Spawning
Brogue spawns monsters in *hordes*, which are 1 or more monsters. Some monsters, like eels, are loners. Others, like jackals, hunt in packs. 

Monster generation is done by creating a leader, then optionally creating its minions.

Here's the definition for a horde type in Brogue:
{% highlight c %}
typedef struct hordeType {
    enum monsterTypes leaderType;

    // membership information
    short numberOfMemberTypes;
    enum monsterTypes memberType[5];
    randomRange memberCount[5];

    // spawning information
    short minLevel;
    short maxLevel;
    short frequency;
    enum tileType spawnsIn;
    short machine;

    enum hordeFlags flags;
} hordeType;
{% endhighlight %}

Brogue's algorithm for monster placement works roughly like this:
1. Choose a random horde type, based on the types of horde that can spawn on the current dungeon level. In Brogue, that's done with `pickHordeType`, which essentially generates buckets of probabilities for each horde type: `[(eel, 10), (kobold, 20), (jackal, 30)]`, then chooses a random number <= the total frequency and returns the horde type for the corresponding bucket.
2. Choose random locations until one is found that satisfies the monster's required terrain type, liquid type, and dungeon type, and is not in a hallway, T-intersection, or 4-way intersection. Random locations are selected by randomly choosing x and y locations until either:
    - 500 iterations have passed
    - A cell is found the satisfies the required dungeon type (a floor, almost always), liquid type, and terrain type. If no terrain is specified, confirm the cell is traversible.

There are two parts in this that require some further investigation: recording and **maintaining data about terrain types** and being able to **detect if a location is a hallway, T-intersection, or 4-way intersection**.

### Maintaining Terrain Data

Previous versions of my dungeon baked terrain into the final dungeon, overwriting the existing cell with the terrain. There wasn't a floor with grass on top, there was just grass. When the generator sought a FLOOR location for a monster, it excluded any location with grass, since that was no longer a FLOOR. To solve this, I needed to separate my dungeon into layers: dungeon (primitive cell types: rock, wall, floor), terrain (grass, torches, rubble, bones), and flags (additional metadata about the cell).

The need to bubble existing information throughout generation has come up a few times over the course of this tutorial, and is a lesson I'll be taking away from this. Any time a generation step overwrites or mutates data, artifacts from the generation are lost, and steps like this become more difficult. Baking color into the cell removes the knowledge of the original color, baking the terrain into the cell removes the knowledge of the original tile. I'm specifically interested in the possibility of a roguelike that can give context to the player about the shape and size of the room, like a text-based adventure might. For example, the following might read:

"You're at the west end of an oblong, irregular room, 2 steps from the edge of a lake. On the eastern shore of the lake, you see a kobold illuminated by torchlight," and so on.

<div class="image-feature">
  <img style="width: 400px" alt="An image of the ASCII art dungeon, described above." src="/projects/brogue/itexample.png">
</div>

This information about the shape and relative size of rooms is present in initial map generation, but is currently lost. My advice is to **never leave data behind**. Any time there's an operation that merges or flatten layers, try to keep them separate as long as possible. This gives a lot more flexibility in the future.

Anyway, terrain is now kept separate until just before rendering to keep this simpler.

### Analyzing Passability

In the Brogue algorithm, monsters cannot be placed in hallways, T-intersections, or four-way intersections. A monster can only be placed in the center of a room or touching a wall. This is analyzed in Brogue with `passableArcCount`, a really useful function. 

`passableArcCount` **counts the number of discrete arcs in the circle surrounding a cell**. Here's what that looks like:

<div class="image-feature">
  <img style="width: 300px" alt="A numbered grid of 9 cells, starting at 1 in the top left and continuing clockwise to 8 on the left. In the center is the player, marked by an @ sign. To the top right (cell 3) is a wall, but in all other cells there's empty floor." src="/projects/brogue/basearc.png">
</div>

Think of these 8 cells as a circle, proceeding in a clockwise rotation.

<div class="image-feature">
  <img style="width: 300px" alt="Those 9 cells, with arrows pointing in a closwise direction around the 'circle'." src="/projects/brogue/basearcnumbered.png">
</div>

In order to count the "passable arcs," proceed from cell 1 to cell 8, counting every time the terrain goes from passable to impassable:

<div class="image-feature">
  <img style="width: 300px" alt="Those 9 cells, with arrows pointing in a closwise direction around the 'circle'. In the top right, where there's a wall, the arrows turn red, then back to green in cell 4 where the floor is empty." src="/projects/brogue/basearcnumberedlineddiscrete.png">
</div>

Then, finally divide this number by 2, as the algorithm counts transitions from passable to impassable as well as impassable to passable. In this example, the passable arc count is 1.

This number counts the discrete arcs in the circle surrounding the player's cell. If a player is standing against a wall, or a single corner like above, the arc count is 1. If a player is in a hallway, that number is two:

<div class="image-feature">
  <img style="width: 100px" alt="Another example of 8 cells surrounding the player, but the player is in a horizontal hallway" src="/projects/brogue/passablehallway.png">
</div>

There are 4 occurences of passing from passable/impassable or impassable/passable, which is then divided by 2. There are two passable arcs—to the left and to the right.

It sometimes makes more sense to think of this number as the **im**passable arc count, depending on the context.

Here's the code for this algorithm:
{% highlight typescript %}
const impassableArcCount = (dungeon: Dungeon, x: number, y: number): number => {
    let arcCount, dir, oldX, oldY, newX, newY;
    arcCount = 0;
    for (dir = 0; dir < 8; dir++) {
        oldX = x + DIR_TO_TRANSFORM[(dir + 7) % 8].x;
        oldY = y + DIR_TO_TRANSFORM[(dir + 7) % 8].y;
        newX = x + DIR_TO_TRANSFORM[dir].x;
        newY = y + DIR_TO_TRANSFORM[dir].y;
        // Counts every transition from passable to impassable or vice-versa on the way around the cell:
        if (
            passable(dungeon, newX, newY) !=
            passable(dungeon, oldX, oldY))
        ) {
            arcCount++;
        }
    }
    return arcCount / 2; // Since we added one when we entered a wall and another when we left.
};
{% endhighlight %}

And finally, an interactive widget to show this algorithm in action. Hover over a cell with your mouse to show the passable arc count.

<style>
    canvas {
        padding-left: 0px;
        padding-right: 0px;
        margin-left: auto;
        margin-right: auto;
        display: block;
        border: 1px solid lightslategray;
    }
</style>

<div id="debug-arc-count"></div>
<script src="/projects/brogue/debugArcCount.js"></script>

## Week 3, Final Dungeon

Here's a dungeon as it stands at the end of this week. Monsters are always visible, so this is like a "go say hi to every monster" game. Next week, I'll add monster/player interactions, UI, and might add some more features like chasms and lava.

<div id="final"></div>
<script src="/projects/brogue/week3.final.js"></script>