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

<div class="image-feature">
  <img src="/projects/mummyproof/treasure.png">
  <img src="/projects/mummyproof/cloud.png">
  <img src="/projects/mummyproof/bg.jpg" width="300px">
</div>

<div class="image-feature">
</div>

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
  <img src="/projects/mummyproof/hero-left.gif">
  <img src="/projects/mummyproof/mummywalk.gif">
  <img src="/projects/mummyproof/explosion.gif">
  <div class="caption"> Some animations </div>
</div>


## Implementation

The main class in this game is the `Sprite`, which is how pretty much everything on the screen is represented. The treasure, hero, mummies, packages, etc. are all sprites.

{% highlight nasm %}
Sprite STRUCT
    bitmapPtr DWORD ?  ;; pointer to the bitmap
    dwHeight DWORD ?   ;; height of the sprite
    dwWidth DWORD ?    ;; width of the sprite
    visible BYTE 1     ;; whether the sprite is visible
    x DWORD ?          ;; x coordinate of sprite
    y DWORD ?          ;; y coordinate of sprite
    direction DWORD 0  ;; direction the sprite is moving (0=left, 1=right, 2=up, 3=down)
    cycle DWORD 0      ;; cylce of animation
    angle FXPT 1       ;; angle in case the sprite rotates
    speed DWORD 20     ;; speed of the sprite in pixels/second
Sprite ENDS
{% endhighlight %}

The game is split into a few distinct pieces, each handled with methods. The first is the initialization, which picks random speeds and starting places for the mummies and powerups.

### The Main Update Cycle

This is where all of the logic occurs for each cycle of the game. This means handling input, redrawing sprites, and checking collisions/level-ups/game-overs.

{% highlight nasm %}
GamePlay PROC USES ebx ecx edi
    invoke HandleInput
    mov eax, Paused
    cmp eax, 1
    je Pause_Skip

Draw:
    ;; draw background
    invoke DrawBG

    ;; update the cycles and bitmaps for hero
    invoke UpdateHeroCycle

    ;; update clouds
    invoke UpdateClouds

    ;; update mummy positions, bitmaps
    invoke UpdateMummies

    ;; draw powerups
    invoke UpdatePowerups

    ;; draw hero
    invoke DrawHero

    ;; draw any fireballs
    invoke UpdateFireball, offset Fireball
    invoke UpdateFireball, offset Fireball1
    invoke UpdateFireball, offset Fireball2

    ;; update bomb
    invoke UpdateExplosion

Pause_Skip:
done:
	ret
GamePlay ENDP

{% endhighlight %}

### Collision Checking

Collision checking works off of hitboxes for each of the sprites. Collisions are checked between the hero and mummies, fireballs and mummies, the sword (if the hero has that powerup) and mummies, and the mummies and the treasure.

The logic collision checking is as follows:

{% highlight js %}
if (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.height + rect1.y > rect2.y) {
    // collision detected!
}
{% endhighlight %}

<div class="image-feature">
  <img src="/projects/mummyproof/collision.gif">
  <div class="caption"> Some collisions (good then bad) </div>
</div>

## Conclusions

It's hard to make a game in assembly. Ideally, I would have taken the time to write some more abstracted libraries for updating sprites and drawing text. Mummy updating and cloud updating happen in separate functions, for example. Arrays of sprites could be passed by reference to a function which handles updating all of the sprites. I'd also like to be able to handle input more thoroughly—keeping track of `KeyUp` events as well as `KeyDown` events for smoother walking.

Check out the code on GitHub [here](https://github.com/anderoonies/mummyproof).
