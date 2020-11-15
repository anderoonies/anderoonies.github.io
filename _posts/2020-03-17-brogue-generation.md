---
layout: post
title:  Broguelike Dungeon Creation, Part 1
excerpt: More procedural dungeon creation
---

[Brogue](https://sites.google.com/site/broguegame/) is a procedurally generated roguelike with a great dungeon creation system. The dungeons feel organic and real, with enough complexity to create unique playthroughs.

<div class="image-feature">
  <img src="https://lh4.googleusercontent.com/QbiLnBbYFlLcilCvPNiZoIDpVVfTmE8UuSbvnFJbQbRnNJpFnI3w7garwSf2zqpsJkU7nL4M3I5RsZ4_EN7aeVeMMjZiVcvm32-bi7ag4E56EwyM_HWr=w1280">
</div>

I've started re-creating the dungeon creation algorithm in JavaScript, based on a [talk Brian Walker gave at Roguelike Celebration](https://www.youtube.com/watch?v=Uo9-IcHhq_w) and the source code, which is bundled with the game release.

This post will deal with room generation and accretion. In another post I'll talk about introducing loops, and adding caverns and lakes.

## Room Accretion
The algorithm's central conceit is to start with a structure (a single room), then continuously generate rooms and slap it onto the structure at a randomly selected location where it fits. The structure produced by accretion is inherently traversable (it's actually a tree rooted at the starting room), so there's no need to prune inaccessible rooms or add hallways to create connectivity.

## Room Generation
Brogue's rooms follow one of four templates:
- Overlapping rectangles
- A cellular automata blob
- A single circle
- Multiple, smaller circles


For now, I've implemented all of these except the multiple, smaller circles.
Here are generated rooms, with doorways included:

<div class="image-feature">
  <img src="/projects/brogue/rooms.gif">
  <div class="caption">Rooms with their doors</div>
</div>

Each room has 4 doors (in brogue some rooms may only have one), selected randomly from each of the four directional faces of the room. There's a 15% chance of a room having a hallway. When a room has a hallway, its doorways are snapped to the end of the hallway, which means the room can _only_ connect to the central structure via this hallway. Otherwise you can have dead ends hanging off your rooms.

Here's what the generation of a cellular automata blob looks like:


<div class="root" id="ca-root"></div>
<script src="/projects/brogue/cabundle.js"></script>



The rules for the automata are:
- a dead cell will turn into a living cell if neighbored by 5 or more living cells
- a living cell will die with fewer than 2 neighboring living cells

These rules are applied for 5 generations.

This can produce discontinuous blobs, which you should see if you watch enough rooms being created. This can create unreachable portions in the dungeon, which violates a core rule of the algorithm. To solve it, the largest blob is selected by performing a flood fill on each cell of the automata. The largest fill is selected.


## Room Accretion
Room accretion is a cool way to introduce a core technique in the algorithm which is "hyperspace". The existing dungeon is kept on a lower layer, then layers of hyperspace "slide" around above the base layer while operations are performed. A layer of hyperspace is then transferred onto the base layer, like an iron-on patch, or a transparency on an overhead projector. For room accretion, a room is placed on a layer of hyperspace and moved around in a random sequence until a suitable spot is found to add it to the dungeon.

<div class="root" id="accretion-root"></div>
<script src="/projects/brogue/accretionbundle.js"></script>

A room "fits" if none of its tiles overlap with the dungeon and one of its doorways faces the dungeon. Once a room is placed, its doorways are ignored, and rooms may connect to it at any tile.

## A "final" dungeon
Here's a dungeon with loops and lakes added, which I'll discuss later. Generation takes a second. I'm working on it. (Author's note: this performance issue is fixed in future versions. Read on in part 2, linked below!)

<div class="root" id="debug-root"></div>
<script src="/projects/brogue/debugbundle.js"></script>


## Source
My source code is [here](https://github.com/anderoonies/rogue-monster)
Brogue's source is available with download [here](https://sites.google.com/site/broguegame/) or extracted on GitHub [here](https://github.com/tsadok/brogue).

## Part 2
Part two is now [here]({% post_url 2020-04-7-brogue-generation-2 %}).
