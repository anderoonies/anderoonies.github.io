---
layout: post
title:  Broguelike Dungeon Creation, Part 2
excerpt: Loops and lakes
---

This is part 2 of implementing Brogue's dungeon generation algorithm in JavaScript. Part one is [here]({% post_url 2020-03-17-brogue-generation %}).

## Loops
Last post left off with something like this:

<div class="image-feature">
  <img style="width: 600px" src="/projects/brogue/prev.png">
</div>

This is fully-connected dungeon made of a few kinds of rooms. The one problem with it is that it's a tree—each room except the starting room links to exactly one "parent," shown here:

<div class="image-feature">
  <img style="width: 600px" src="/projects/brogue/tree_annotated.png">
</div>

This can create a lot of frustration during gameplay if you need to backtrack through the same rooms to explore somewhere new, or if you get trapped in a corner when a swarm of kobolds appear.

To solve this, **the algorithm adds "loopiness" to the dungeons**. A loop is created by putting a doorway between two rooms. Every possible cell in the dungeon is checked to see if it's a candidate for a loop-creating door, following these rules:

1. the door site must be stone (empty)
2. the cells on either side of the door must be floor
3. the cells on either side of the door must be more than 20 spaces apart.

If all three of these conditions are met, a door is placed, and rooms that were once distant are now connected!

All of this is straightforward to check except rule 3, which requires an algorithm for determining pathing distance.

Pathing distance is calculated using A*, a variation of Dijkstra's algorithm that uses a heuristic function. In this case, the heuristic is Manhattan distance. Adding a heuristic function means that the search function will try searching in the general direction of the destination before trying other routes.

Here's an example you can play with. **Left click a cell** (sorry mobile users), **then right click another cell**, and the path between them will be shown using a path of `o`s, and total distance in the top**. The numbers that appear are the distance from the starting cell (left click).

<div class="root" id="dijkstra-root"></div>
<script src="/projects/brogue/dijkstrabundle.js"></script
>

You can try to identify cells that would meet the condition for loopiness. **The dungeon below adds the loops it finds**, but with shallow water as the doors 🙃 Some dungeons (especially at this tiny size) don't require loops to be added, so **step through if you don't see one at first**.

<div class="root" id="loopy-root"></div>
<script src="/projects/brogue/loopybundle.js"></script>


## Lakes

Generally, lakes are cellular automata placed on top of the dungeon. The caveat is **lakes cannot disrupt passibility**. Any placement of a lake cannot make any two tiles in the dungeon disconnect.

The clever solution for figuring this out is a flood fill. To determine if the lake disrupts connectivity, "paint" is poured into any floor cell in the dungeon and allowed to flood as far as it can (assume for this metaphor that paint can't travel through water). This is just the bucket tool in MS Paint. At the end of the flooding, if there's any dry tiles, those tiles were made unreachable by the lake.

Try it here—**clicking a cell will start a flood fill** from that location. If there's any untouched floor tile, the lakes disrupt passibility and should not be placed.

<div class="root" id="flood-root"></div>
<script src="/projects/brogue/floodbundle.js"></script>


Here's the total code, including code which adds "wreaths," the shallow areas that surround the lake like a halo.

<script src="https://gist.github.com/anderoonies/725abb65de4b33378adf4210abb055dc.js"></script>

And here are the final lakes, not disrupting passibility, with those wreaths added.

<div class="root" id="lake-root"></div>
<script src="/projects/brogue/lakebundle.js"></script>


## Later
I'll write more later about adding features, like grass and bones, lighting, and memory.
