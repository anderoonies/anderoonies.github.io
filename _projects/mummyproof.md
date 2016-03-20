---
title: Mummy Proof
layout: page
photo_url: /projects/mummyproof/hero-left.gif
excerpt: A game in IA-32 assembly
---

# Mummy Proof

Mummy Proof is a game I wrote in IA-32 assembly for EECS 205 at Northwestern.

The object of the game is to survive waves of 20 mummies who are coming toward your treasure, with fireballs or any of the 3 powerups that fall from the sky.

<div class="image-feature">
  <img src="/projects/mummyproof/gameplay.gif">
  <div class="caption"> Gameplay </div>
</div>

## Sprites

The sprites were made in Photoshop then converted to bitmaps.

The hero was one I had created a while ago for an RPG in Swift, so it was just a matter of converting the image to bitmap.

Here's a small example, with the original image converted to a 16 byte spritemap.

<div class="image-feature">
  <img src="/projects/mummyproof/herosmall.png">
  <div class="caption"> Small sprite </div>
</div>

<div class="center" style="text-align:center">
<pre>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,088h,088h,088h,088h,088h,088h,088h,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,088h,088h,088h,088h,088h,088h,088h,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,088h,0fah,088h,088h,088h,088h,088h,088h,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,088h,0fah,0fah,0fah,0fah,0fah,0fah,088h,088h,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,088h,055h,0fah,0d1h,0fah,055h,0fah,088h,088h,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,088h,0fah,0fah,0fah,0fah,0fah,0fah,088h,088h,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,088h,0fah,0fah,0fah,0fah,0fah,0d6h,088h,088h,<span style="color:red">0ffh</span>,088h,088h
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,088h,088h,088h,088h,033h,033h,033h,033h,02eh,088h,088h,088h,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,02eh,033h,033h,033h,033h,033h,02eh,02eh,02eh,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,02eh,033h,033h,033h,033h,033h,02eh,<span style="color:red">0ffh</span>,0fah,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,0fah,0fah,02eh,<span style="color:red">0ffh</span>,033h,033h,033h,033h,033h,02eh,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,068h,0f9h,068h,068h,064h,064h,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,033h,033h,033h,033h,02eh,024h,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,033h,033h,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
BYTE <span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,024h,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>,<span style="color:red">0ffh</span>
</pre>
</div>

<div class="caption"> Highlighted to show the sprite </div>

As you can imagine, the bitmaps are _huge_. Most characters/objects are 64x64 and the background is 768x440. Sprites take up 45,000 lines of code in the implementation.

<div class="image-feature">
  <img src="/projects/mummyproof/mummywalk.gif">
  <img src="/projects/mummyproof/explosion.gif">
  <div class="caption"> Some animations </div>
</div>


## Implementation
