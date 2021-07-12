---
layout: post
title:  r/roguelikedev Does The Complete Roguelike Tutorial - Weeks 1, 2
excerpt: Creating a roguelike in TypScript
meta: /projects/brogue/fov.gif

---

This is the first of a few posts about creating a roguelike for the 2021 "RoguelikeDev Does The Complete Roguelike Tutorial" event hosted on reddit.com/r/roguelikedev and in the RoguelikeDev Discord.

I'll be following the tutorial in TypeScript.

Since 2020, the tutorial has been using ECS architecture. There are a number of ECS libraries available, and I [messed with creating my own](https://codehs.com/sandbox/andy/ezjs) before deciding on [@fritzy/ape-ecs](https://github.com/fritzy/ape-ecs). The API was welcoming and documentation is good.

[rot.js](https://ondras.github.io/rot.js/hp/) is a great roguelike development toolkit for JavaScript programming, and is how I'm rendering to the screen and performing FOV calculations.

There's quite a bit here, it should be better paced in the future. There's a working dungeon at the bottom you can play with.

## Rebuilding the Dungeon in TypeScript

About a year ago I recreated parts of the Brogue dungeon generation algorithm in JavaScript, which I've written about here: [here]({% post_url 2020-03-17-brogue-generation %}). The first task was to migrate that code to TypeScript.

#### Types

First, a quick look at most of the types:

{% highlight typescript %}
export type CellConstant = typeof CELL_TYPES[keyof typeof CELL_TYPES];
type CellFlags = {
    OBSTRUCTS_PASSIBILITY?: boolean;
    OBSTRUCTS_VISION?: boolean;
    YIELD_LETTER?: boolean;
};
type CellType = {
    type: string;
    color: {fg: string; bg: string; dances?: boolean};
    letter: string;
    priority: number;
    flags: CellFlags;
    glowLight?: LightSource;
};
type RoomType = typeof ROOM_TYPES[keyof typeof ROOM_TYPES];
type FeatureType = typeof DUNGEON_FEATURE_CATALOG[keyof typeof DUNGEON_FEATURE_CATALOG];
type CellularAutomataRules = typeof CA.rules[keyof typeof CA.rules];
type Directions = typeof DIRECTIONS[keyof typeof DIRECTIONS];
type CardinalDirections = typeof CARDINAL_DIRECTIONS[keyof typeof CARDINAL_DIRECTIONS];
type DoorSite = {x: number; y: number; direction: CardinalDirections};
type DoorSites = Array<DoorSite>;
{% endhighlight %}

These are types used in the generation of the dungeon. `CELL_TYPES`, `ROOM_TYPES`, etc. are objects stored as constants.

Here are the types for performing dungeon lighting, and finally baking the final dungeon:

{% highlight typescript %}
type ColorString = `#${number}${number}${number}`;
type ColoredCell = {bg: ColorString; fg: ColorString};
type DungeonCell = CellConstant | ColoredCell;
type AnnotatedCell = CellType & {constant: CellConstant};
type Grid<T = DungeonCell> = Array<Array<T>>;
type RGBColor = {r: number; g: number; b: number; alpha?: number};

type CellColorLayer = RGBColor & {
    dancing?: {
        deviations: {r: number; g: number; b: number};
        period: number;
    };
};
type CellColor = {fg: CellColorLayer; bg: CellColorLayer};
type LightSource = {
    minRadius: number;
    maxRadius: number;
    fade: number;
    color: {
        baseColor: RGBColor;
        variance: RGBColor & {
            overall: number;
        };
    };
};

type RandomColorDefiniton = {
    bg: {
        baseColor: RGBColor;
        noise: RGBColor & {overall: number};
        variance: RGBColor & {overall: number};
    };
    fg: {
        baseColor: RGBColor;
        noise: RGBColor & {overall: number};
        variance: RGBColor & {overall: number};
    };
};

type PerlinColorDefinition = {
    bg: {
        baseColor: RGBColor;
        variance: RGBColor & {overall: number};
    };
    fg: {
        baseColor: RGBColor;
        variance: RGBColor & {overall: number};
    };
};
{% endhighlight %}

`PerlinColorDefinition` and `RandomColorDefinition` are the types for how color configurations are stored in constants.

## ECS

ECS architectures require all logic to be split into **systems**, which query and operate on **entities**, which have specific **components**, which are the collections of information about the entitiy. To explain, here's an example of a system, component, and entity:

The `PlayerRender` system, which operates on entities that have the components:
1. Character, a "tag" indicating it's the player character
2. Position, a component which holds x and y coordinates
3. Renderable, a component which holds data for drawing any thing
{% highlight typescript %}
export default class PlayerRender extends System {
    // ...
    init() {
        this.query = this.world.createQuery().fromAll(Character, Position, Renderable);
    }

    update(dt: number) {
        for (const entity of this.query.refresh().execute()) {
            const positionComponent = entity.getOne(Position);
            const renderableComponent = entity.getOne(Renderable);
            this.display.draw(
                positionComponent.x,
                positionComponent.y,
                renderableComponent.char,
                renderableComponent.fgColor,
                renderableComponent.bgColor
            );
        }
    }
}
{% endhighlight %}

The `Character`, `Position`, and `Renderable` components:
{% highlight typescript %}
// Character is only a "tag," a component that stores no data
export class Character extends Component({}) {}
export class Position extends Component<{x: number; y: number}>({x: 0, y: 0}) {}
export class Renderable extends Component({
    char: '@',
    baseFG: {r: 0, g: 0, b: 0, alpha: 0},
    fg: {r: 0, g: 0, b: 0, alpha: 0},
    baseBG: {r: 0, g: 0, b: 0, alpha: 0},
    bg: {r: 0, g: 0, b: 0, alpha: 0},
}) {}
{% endhighlight %}


The player entity, which is the only entity that has all three of these Components, and therefore is the only entity this system will find when querying:
{% highlight typescript %}
const player = this.world.createEntity({
    c: [
        {type: Character},
        {type: PlayerControlled},
        {type: Position, x: 8, y: 12},
        {
            type: Renderable,
            char: '@',
            baseBG: {r: 0, g: 0, b: 0, alpha: 0},
            bg: {r: 0, g: 0, b: 0, alpha: 0},
            baseFG: {r: 150, g: 150, b: 150, alpha: 1},
            fg: {r: 150, g: 150, b: 150, alpha: 1},
        },
        {type: Visible},
    ],
});
{% endhighlight %}

The main game logic is something like this:
{% highlight typescript %}
window.addEventListener('keydown', e => {
    const entities = this.world.createQuery().fromAll(PlayerControlled).refresh().execute();
    for (const player of entities) {
        switch (e.code) {
            case 'ArrowUp':
                player.addComponent({
                    type: ActionMove,
                    y: -1,
                    x: 0,
                });
                break;
            // etc...
        }
    }
    // process actions with the ActionSystem, which moves the Position of any entity
    // with an ActionMove component, then removes the ActionMove component.
    // only process Actions when the user provides input.
    this.world.runSystem(ActionSystem);
});

while (true) {
    this.world.runSystem(RenderSystem);
}
{% endhighlight %}

Rendering happens independently of input, but player movement (and eventually NPC movement) will only happen when the user provides input, like other turn-based roguelikes.

Rendering independently of input allows for "dancing" colors, something that exists in Brogue that I really enjoy. A tile with "dancing" colors will slightly vary color even when the player is idle, which gives the dungeon a lot of life. Here's a lake, which has dancing colors:

<div class="image-feature">
  <img style="width: 300px" alt="An animation of a text-based dungeon showing a lake made of cells of different shades of blue. The shades of blue flicker lighter and darker over time, like there's light playing off rippling surface of the water." src="/projects/brogue/dancing.gif">
</div>

The dungeon generation algorithm can spit out tiles that have the following defined for their foreground (letter) or background color:
{% highlight typescript %}
dancing?: {
    deviations: {r: number; g: number; b: number};
    period: number;
};
{% endhighlight %}

A tile with a dancing color is given the `DancingColor` component which is handled in the `Render` system like this:

{% highlight typescript %}
// ...
// assuming a `bg` and `fg` from the Renderable component
let dancingColor = entity.getOne(DancingColor);
if (dancingColor.timer <= 0) {
    const dancingDeviations = {
        ...dancingColor.deviations,
    };
    // reset the dancing component's timer to be equal to its period
    dancingColor.update({timer: dancingColor.period});
    // mix the current background with the dancing color's deviations
    const mixed = ROTColor.randomize(
        [baseBG.r, baseBG.g, baseBG.b],
        [dancingDeviations.r, dancingDeviations.g, dancingDeviations.b]
    );
    // store the new color on the renderable component
    renderable.update({
        bg: {
            r: mixed[0],
            g: mixed[1],
            b: mixed[2],
        },
    });
}
// tick down the dancing color's timer
dancingColor.update({timer: dancingColor.timer - dt});
{% endhighlight %}

This requires the `Renderable` component to store a `baseBG` and `baseFG` in addition to its current `bg` and `fg`. If `Renderable` just stores a single color, dancing colors will perform a random walk and things get psychedelic:

<div class="image-feature">
  <img style="width: 300px" alt="An animation of a text-based dungeon showing a lake made of cells of different shades of blue. The cells randomly shift to shades of blue, red, and brown that don't resemble water." src="/projects/brogue/psych.gif">
</div>

The following are the current components defined for the game, including their types:
{% highlight typescript %}
export class ActionMove extends Component<{x: number; y: number}>({x: 0, y: 0}) {}

export class DancingColor extends Component<{
    deviations: {r: number; g: number; b: number};
    period: number;
    timer: number;
}>({
    deviations: {r: 0, g: 0, b: 0},
    period: 0,
    timer: 0,
}) {}

export class Light extends Component<{
    base: {r: number; g: number; b: number; alpha: number};
    current: {r: number; g: number; b: number; alpha: number};
}>({
    base: {r: 0, g: 0, b: 0, alpha: 0},
    current: {r: 0, g: 0, b: 0, alpha: 0},
}) {}

export class Position extends Component<{x: number; y: number}>({x: 0, y: 0}) {}
export class Renderable extends Component({
    char: '@',
    baseFG: {r: 0, g: 0, b: 0, alpha: 0},
    fg: {r: 0, g: 0, b: 0, alpha: 0},
    baseBG: {r: 0, g: 0, b: 0, alpha: 0},
    bg: {r: 0, g: 0, b: 0, alpha: 0},
}) {}
export class Visible extends Component({}) {}
export class Memory extends Component({}) {}

export class Tile extends Component<{
    flags: {OBSTRUCTS_PASSIBILITY?: boolean; OBSTRUCTS_VISION?: boolean};
}>({
    flags: {
        OBSTRUCTS_PASSIBILITY: false,
        OBSTRUCTS_VISION: false,
    },
}) {}

export class Map extends Component({
    width: 0,
    height: 0,
    tiles: [[]],
}) {}

export class Character extends Component({}) {}
export class PlayerControlled extends Component({}) {}
{% endhighlight %}

Typed components don't currently exist in `ape-ecs`—there's a pattern that appears to have been first introduced by Mozilla's ECSY where components are defined as classes with default data stored on the class's prototype. This isn't super type-friendly, since generics types can't access static attributes of classes.

To fix that, I wrote my own types and a helper for `ape-ecs` called `TypedComponent`, with a signature like this:

{% highlight typescript %}
function TypedComponent<TProperties extends DefaultProperties>(
  properties: TProperties
): ClassType<Component<TProperties>> & Constructor<Component & TProperties>;
{% endhighlight %}

This makes sure that instances of a subclass of `TypedComponent` will have fields of those types. An example:

{% highlight typescript %}
class Position extends TypedComponent<{x: number, y: number, z?: number}>(
    {x: 0, y: 0}
) {};

const p : Position = new Position();
console.log(p.x);
    // (property) x : number
console.log(p.y);
    // (property) y? : number
{% endhighlight %}

This also lets entity creation be typesafe, using the method `World.createEntityTypesafe`:
{% highlight typescript %}
const thing = world.createEntityTypesafe({
    tags: ['Thingy'],
    c: [{
        type: Position,
        // error for missing .x
        y: 1,
        ex: 1 // error for ex, which doesnt exist on Position
    }]
})
{% endhighlight %}

`TypedComponents` can infer type definitions from default props:
{% highlight typescript %}
class Position extends TypedComponent(
    {x: 0, y: 0}
) {};
const p : Position = new Position();
console.log(p.x);
    // (property) x : number
{% endhighlight %}

but explicit typing allows for finer control and defaults that don't sacrifice type safety:

{% highlight typescript %}
type FLAGS = 0 | 1;
class Thing extends Component<{flags: FLAGS}>(
    {flags: 0}
) {};
const t = new Thing();
t.flags = 2;
    // Type '2' is not assignable to type 'FLAGS'
{% endhighlight %}

Throughout the rest of this project, I'll be using `TypedComponent`s.

## Decoupling Light

Originally, my algorithm for dungeon generation was spitting out a "baked" dungeon, where light was merged into the cells. In this code from the original pass ([link](https://github.com/anderoonies/rogue-monster/blob/master/src/levels/levelCreator.js#L1329-L1340)), all layers of the dungeon are merged into a single layer:

{% highlight typescript %}
const layers = [
    annotateCells(dungeon),
    annotateCells(features),
    addAtmosphericLayer(dungeon)
];

const { flattenedDungeon, flattenedColors } = flattenLayers(layers);

const lightedColors = lightDungeon({
    dungeon: flattenedDungeon,
    // MUTATES
    colors: flattenedColors
});
{% endhighlight %}

Notably this didn't allow for dynamic lighting or for dancing colors. In order to add those, I needed to separate light and color to be passed to the game engine as components.

## Rendering with `rot.js`

Previously, I've been rendering using React. Every cell was a `<div>` with CSS describing color. Switching to `rot.js` made rendering much simpler, and has allowed for FOV calculation and color mixing.

To make reasoning about rendering simpler, the dungeon generation algorithm will only include colors as `{r, g, b}` Objects, rather than `Color`s (defined by the great [color library by Qix](https://github.com/Qix-/color#readme)). `rot.js` uses any valid CSS property as a color, including `rgba` for transparency. The generator still mixes colors as `Color` instances, but unpacks it into `{r, g, b}` before passing it to the game engine.

First, a look at the final product:

<div class="image-feature">
  <img style="width: 300px" alt="A text-based dungeon showing some walls in various shades of granite, a glowing torch, and a glimpse of a blue lake. Parts of the dungeon are shown in dimmed colors, representing the player's memory. Tiles the player can actively see are illuminated in bright color. Tiles the player has never seen are black." src="/projects/brogue/render.png">
</div>

The room the player (`@`) is currently in is entirely visible, meaning those tiles are tagged with the `Visible` component. The torch (orange `#`) on the left wall is casting a very faint (unnoticable, really, I'll fix that later 🙃) light. Everything not visible is "memory," meaning those tiles have the `Memory` component.

Rendering is split into a few separate systems: `Render`, `PlayerRender`, `MemoryRender`, and `Light`.

`Render` is the first pass. The `Render` system queries for entities that match the following: `fromAll(Renderable, Position, Visible).not(Light, Memory, Character)`, meaning any entity that has the `Renderable`, `Positoin`, and `Visible` components, but not the `Light`, `Memory`, or `Character` components.

These entities are drawn directly onto a `rot.js` `Display` like so:

{% highlight typescript %}
display.draw(
    positionComponent.x,
    positionComponent.y,
    // the letter (@, #, etc.)
    renderableComponent.char,
    toRGBA([
        renderableComponent.fg.r, 
        renderableComponent.fg.g, 
        renderableComponent.fg.b, 
        renderableComponent.fg.alpha
    ]),
    toRGBA([
        renderableComponent.bg.r, 
        renderableComponent.bg.g, 
        renderableComponent.bg.b, 
        renderableComponent.bg.alpha
    ]),
);
{% endhighlight %}

Next, `MemoryRender` draws any entity that matches `fromAll(Renderable, Memory, Position).not(Light, Visible)` using

{% highlight typescript %}
const fg = renderableComponent.fg;
const bg = renderableComponent.bg;
this.display.draw(
    positionComponent.x,
    positionComponent.y,
    renderableComponent.char,
    toRGBA(Color.multiply_([fg.r, fg.g, fg.b], [100, 100, 100])),
    toRGBA(Color.multiply_([bg.r, bg.g, bg.b], [100, 100, 100]))
);
{% endhighlight %}

This multiplies (darkens) the color of the cell, which is meant to evoke remembering it hazily. Also, note that the `Position` and `DancingColor` of components will _not_ be updated when they are not `Visible`, which means that memory will accurately portray the state of the tile as it was last seen.

The `Light` system adds the value of `Light` components to the existing color values at its `Position`. 

## FOV

FOV calculation is done with `rot.js`, which was really great and simple.
A FOV is defined using the algorithm and a function for determining whether something is visible, which is a flag defined on an `AnnotatedCell`:
{% highlight typescript %}
this.fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
    const playerPosition = player.getOne(Position);
    if (x === playerPosition.x && y === playerPosition.y) {
        return true;
    }
    return !tiles?.[y]?.[x]?.tile.getOne(Tile).flags.OBSTRUCTS_VISION;
}, {});
{% endhighlight %}

When the FOV changes (when the player position updates), I recalculate FOV and store the updated values in a map:
{% highlight typescript %}
fov.compute(player.x, player.y, WIDTH, (x, y, r, visiblity) => {
    if (y >= HEIGHT || x >= WIDTH) {
        return;
    }
    newVisible[`${y},${x}`].visible += 1;
});
newVisible[`${player.y},${player.x}`].visible += 1;
}
{% endhighlight %}

Then, by comparing the new visibility to previous visibility, I determine which tiles have gone from unseen to seen and need the `Visible` component added and `Memory` component removed, and which cells have gone from seen to unseen and need the opposite. 

FOV in action:

<div class="image-feature">
  <img style="width: 300px" alt="An animation of the player moving around the text-based dungeon, their torch light illuminating the dungeon in 360% around them. When they pass through tall plants, their vision is obstructed." src="/projects/brogue/fov.gif">
</div>

You can see that tall plants block FOV.

## Working Example

This dungeon doesn't have a minimum height, so there's a good chance for bugs I haven't encountered in testing.

I've tacked the seed on at the bottom, if you run into an erroring dungeon and want to help out, feel tree to make a GitHub issue with the seed.

Not very mobile friendly at this 

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

<div id="rot-container"></div>
<script src="/projects/brogue/rl2021.1.js"></script>
<p style="text-align: center;" id="seed"></p>