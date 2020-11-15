---
layout: post
title:  Broguelike Dungeon Creation, Part 3
excerpt: Color, Lighting, and Features
---

This is part 3 of implementing Brogue's dungeon generation algorithm in JavaScript. Part two is [here]({% post_url 2020-04-7-brogue-generation-2 %}).

This post covers the techniques for colorizing the dungeon, lighting, and "features," which is what the Brogue architect calls small environment details. It's been a bit since I've touched this code, so let's brush off the cobwebs.

## Colors

My particular implementation diverges from Brian Walker's quite a bit here, but I think to a similar end. 

Brogue's architect describes color ranges that a particular material type can take. Here's the color definition for Brogue's walls:

```js
const graniteBackColor = {
    // base color components
    red: 40,
    green: 40,
    blue: 40,

    // random RGB components to add to base components:
    redRand: 15,
    greenRand: 0,
    blueRand: 5,

    // random scalar to add to all components:
    rand: 20,

    // whether the color "dances" with every refresh:
    colorDances: false,
};
```

When painting a color, the color's components are mixed with random components something like this:

```c
const shift = randomRange(0, color.rand);
const resultingColor = {
    r: color.red + randomRange(0, color.redRand) + shift,
    g: color.green + randomRange(0, color.greenRand) + shift,
    b: color.blue + randomRange(0, color.blueRand) + shift,
};
```

Each cell is colored independently of its neighbors, which you can see here:

<div class="image-feature">
  <img style="width: 300px" src="/projects/brogue/randcolors.png">
</div>

The first divergence I make is by achieving this randomness using Perlin noise. Rather than treating each cell individually, I generate a noise map for each component. This achieves some continuity across cells, which is what I'd imagine would happen with veins in stone or growth in plants.

To read more about this technique, I have a post about it [here]({% post_url 2020-03-21-perlin-colors %}).

Here's the final widget from that post with some wall-like colors plugged in.

<div class="root" id="perlin-root"></div>
<script src="/projects/brogue/perlinwalls.js"></script
>

You can see that we have some areas that are more red, some that are more blue, and some that are more green. The effect is pretty subtle, so you can crank the components a bit to see what it looks like with more intense noise.

I perform the same process for foreground colors (the letters within the cells). Here's a small, impossible dungeon to demonstrate how this looks in practice.

<div class="root" id="wall-color-root"></div>
<script src="/projects/brogue/wall-color.js"></script
>

You can see there are 'veins' of color that work their way through the stone.

Some cells types use purely random color variance, like Brogue does, and some use noise. Water is a particularly pleasing when colored with noise maps. Its color profile is:

```js
const lakeColor = {
    bg: {
        baseColor: {
            r: 40,
            g: 40,
            b: 150
        },
        variance: {
            r: 5,
            g: 5,
            b: 5,
            overall: 15
        }
    },
    fg: {
        baseColor: {
            r: 80,
            g: 80,
            b: 180
        },
        variance: {
            r: 0,
            g: 0,
            b: 10,
            overall: 15
        }
    }
};
```

You can see that the lake has variance for both the base color and foreground color, which creates a kind of shimmery effect.

<div class="root" id="lake-color-root"></div>
<script src="/projects/brogue/lake-noise.js"></script
>

## Lights

Some elements in Brogue produce light, which, in technical terms, affects the color of adjacent cells. The most common source of light in the game is the player's miner's light, which my recreation notably doesn't have. Torches, glowing fungus, rays of sunlight leaking in from the surface, fire, etc. all create light. Again, I'm diverging from Brian Walker here for my own (and your!) edification.

Like Brogue, I define light by these parameters:

```js
const glowLight = {
    // the minimum and maximum radius of the light source
    minRadius: 1000,
    maxRadius: 1000,
    // the % of light lost for each ring of radius
    fade: 20,
    // colors, like we saw before
    color: {
        baseColor: {
            r: 75,
            g: 38,
            b: 15
        },
        variance: {
            r: 0,
            g: 15,
            b: 7,
            overall: 0,
        }
    }
};
```

When a source creates light, a halo is calculated around it, masked against a FOV restricted by objects which block the line of sight, like walls or tall plants. For every cell in that halo, a light value is calculated based on the color of the light and its variance, the fade %, and the distance from the light source. This data is stored in a `lightMap`, which is then merged with the existing color data to result in a value which appears to have been lightened.

Let's look at the code for lighting the dungeon, which is pretty complex. The parameters are the `dungeon`, which is a grid of cell definitions, and `colors`, which are the colors we've generated above. This code is c-like, because it's inspired by Brian's original c.

<script src="https://gist.github.com/anderoonies/141a6991f2c0831f4a3f978cea788e07.js"></script>

The code is complicated, but the result is really satisfyingly gorgeous. My lights are a little exaggerated for effect, but you can see how really lovely a torch-lit dungeon is:

<div class="root" id="torchlight-root"></div>
<script src="/projects/brogue/torchlight.js"></script
>

You can see how multiple torchlights in the same room overlap, creating brighter patches, and how the light affects walls, floors, and water.

Here's a fun bonus, glowing water:

<div class="root" id="glowingwater-root"></div>
<script src="/projects/brogue/glowingwater.js"></script
>

The two light sources blend nicely, and tweaking the light parameters can convince you the water is either blessed, poisonous, or electric. Brogue has none of these, just a fun thing to play with.

## Features

Features are environmental things in the dungeon. They can be plants, debris, blood, statues, etc. They're great for providing some flavor for the dungeon, and can be interacted with.

Features are generated via "autogenerators," which Brogue stores in a catalog. An entry in this catalog is something like this:

```js
const AUTO_GENERATOR_CATALOG = [
    // ...
    {
        // some internals for lighting
        terrain: 0,
        layer: 0,
        // pointer to the feature
        DF: DUNGEON_FEATURE_CATALOG[FEATURES.DF_GRASS],
        // whether this is a machine (more on that later!)
        machine: 0,
        // the possible non-liquid types on which this can exist
        reqDungeon: [CELL_TYPES.FLOOR],
        // the possible liquid types on which this can exist
        reqLiquid: [],
        // the minimum/maximum depth where this feature can occur
        minDepth: 0,
        maxDepth: 10,
        // how frequently this feature should occur
        frequency: 0,
        // a linear equation for frequency based on the dungeon depth
        minIntercept: 1000,
        minSlope: -80,
        // the max # of this feature per level
        maxNumber: 10
    },
];
```

The autogenerator catalog entry contains some metadata about the feature's occurence, and is used to allow the algorithm to place the feature.

The definition of the feature itself is something like this: 

```js
const DF_GRASS = {
    // the tile that the feature creates
    tile: CELL_TYPES.GRASS,
    // how likely it is for the feature to spread.
    start: 75,
    // the decreasing probability of a feature spreading over each generation
    decr: 10,
    // the tiles that this cell can propagate to
    propagationTerrains: [CELL_TYPES.FLOOR, CELL_TYPES.DEAD_GRASS],
    // a subsequent feature that should exist given this one's existence
    subsequentFeature: FEATURES.DF_FOLIAGE,
    // whether the feature should propagate
    propagate: true
};
```

To generate features, each autogenerator is run one-by-one. Here's the process for adding a single feature.

- First, a number of attempts to place the feature is generated using the proabilities in the autogenerator catalog. This number is `Math.min((autogenerator.minIntercept + depth * autogenerator.minSlope) / 100, autogenerator.maxNumber);`.
  - For each attempt, choose a random location that could contain this feature. This location must match the `reqDungeon` or `reqLiquid` parameters of the autogenerator.
  - If a suitable location is found, "spawn" the feature at that location.
    - To spawn a feature, an iterative process is run that attempts to spread the feature from its initial location outward. This process can be thought of as generations of growth, with each generation being less likely to propagate.
  - After propagation has ended, if this feature has a subsequent feature, spawn that feature at the same starting point.

It's a bit complicated, but creates intricate and life-like occurences throughout the dungeon.

Here's a dungeon with just grass and foliage, defined as above:

<div class="root" id="grass-root"></div>
<script src="/projects/brogue/grassroot.js"></script
>

In this dungeon grass is very common, which isn't so in Brogue.

You may have figured out already that torches, discussed as light sources, are also features. 

Torches can only exist on walls, so their autogenerator entry looks like this:

```js
const AUTO_GENERATOR_CATALOG = [
    // ...
    {
        terrain: 0,
        layer: 0,
        DF: DUNGEON_FEATURE_CATALOG[FEATURES.DF_TORCH_WALL],
        machine: 0,
        reqDungeon: [CELL_TYPES.WALL],
        reqLiquid: [],
        minDepth: 0,
        maxDepth: 9,
        frequency: 100,
        minIntercept: 100,
        minSlope: 70,
        maxNumber: 10
    }
];
```

Again, these numbers aren't accurate to Brogue, but my dungeons are boring without things like this.

## Closing

I likely won't be working further on this project, since what comes next becomes pretty daunting. Machines, one of the most exciting aspects of Brogue, would require some reengineering to make sure that flags and layers are supported properly. I hope you've enjoyed reading these posts, and maybe learned something you can take with you in life. If you have any questions about the project feel free to contact me on GitHub. The project is [here](https://github.com/anderoonies/rogue-monster).

If you'd like to play with the dungeon creator as it exists now, check it out [here](https://anderoonies.github.io/projects/brogue/).