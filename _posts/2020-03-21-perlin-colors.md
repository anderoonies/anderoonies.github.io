---
layout: post
title: Perlin Noise for Color Generation
---

## Perlin Noise

Perlin Noise is a noise algorithm that produces organic-looking noise. In traditional noise, each pixel is "unaware" of its surroundings and position, and the result looks chaotic, like TV static.

<div class="image-feature">
  <img style="width: 200px" src="/projects/perlin/purenoise.png">
  <div class="caption">Pure noise looks chaotic.</div>
</div>

Perlin noise creates randomness at a broader level, and each pixel is influenced by this randomness in a way that appears organic.

<div class="image-feature">
  <img style="width: 400px" src="/projects/perlin/perlinnoise.png">
  <div class="caption">Perlin noise looks nice to touch.</div>
</div>

## Generating Perlin Noise

Rather than introducing randomness for each pixel, randomness is used to determine the direction of gradient vectors at the vertices of a "supergrid".

<div class="image-feature">
  <img style="width: 400px" src="/projects/perlin/gradientvectors.png">
</div>

Points in the grid are influenced by these vectors, like a leaf moving through a creek might be pulled and pushed by currents. This is done mathematically with dot products between points in the grid and each gradient vector in the corresponding square of the supergrid.

<div id="noninterp-root">
</div>
<script src="/projects/perlin/noninterpbundle.js"></script>

Each 4x4 group of cells maps to a square in the supergrid. It's clear where the grid boundaries are in this example, so each cell is linearly interpolated, weighted by its distance from the corner of the supergrid cell. Cells at the corners will remain the same, but cells further from the corners will be interpolated.

<div id="interp-root">
</div>
<script src="/projects/perlin/interpbundle.js"></script>

## Noise to Color
The reason I'm working on this in the first place is to generate nice, organic variation in colors. The noise values can be mapped to the 0-255 range for the RGB components of a color, and produce something like this in monocolor:

<div id="monochrome-root">
</div>
<script src="/projects/perlin/monochromebundle.js"></script>

Cooler, though, is controlling each of the RGB channels separately. I generate a separate noise map for each channel and a range of values (0-255) to normalize the noise to, which corresponds to how much "influence" the noise has on that channel. A noise map with max influence can change the value of the corresponding channel a lot, while a noise map with no influence means the base color will remain unchanged.

<div id="final-root">
</div>
<script src="/projects/perlin/finalbundle.js"></script>

With this approach, different materials can be defined by their base color and a range for each channel to change. You can make interesting grasses, rocks, water, whatever.
