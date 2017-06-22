---
title: Rhythm Rush
layout: page
photo_url: /projects/rhythmrush/rhythmrush.png
excerpt: A rhythm/racer game.
---

# Rhythm Rush

Rhythm Rush is a game myself and two other Northwestern students made for EECS 370 with Ken Forbus.

<div class="image-feature">
  <img src="/projects/rhythmrush/finallevel.gif">
</div>

The user has to move in time with music they're hearing. If you're on the beat you move successfully, but failing to input at the right time results in a stun. Fall too far behind and the level catches up with you.

## Staying On Beat

One of the challenges of synchronizing music and input in a game is working with frame rate. Unity provides `FixedUpdate`, which is invoked at every fixed framerate frame to compensate for it.

The architecture is designed so a game controller is responsible for firing the beat events, which trigger listeners on the level's and player's controllers.

The following code in the player's controller is called every time a beat event is received and is used to calculate whether or not the player should move:

{% highlight csharp %}
// proximity to the beat
float accuracy = Mathf.Abs (LevelController.NextQuarterPulse() - last_input_time);
// check if it's within threshold
if (accuracy < input_accuracy_threshold || accuracy > LevelController.quarterPulse - input_accuracy_threshold) {
  // successful move
  FlashCorrectInputColor (true);
  bool stun = SnapToNextTile(distance);
  if (stun) {
    StunPlayer(1);
    current_scale = Mathf.Max (1, current_scale - 1);
  } else {
    // Upgrade speed factor
    last_correct_input_time = last_input_time;
    current_scale = Mathf.Min (3, current_scale + 1);
  }
}
{% endhighlight %}

## UI

We wanted the UI to be able to indicate the bare minimum for the player to be able to succeed.

One of the things we realized early on was that a visual indicator is extremely helpful for people following a rhythm.

I designed a circular metronome that shows when the beat is striking and what the player's movement range is. It's a departure from something more linear like Rock Band or Guitar Hero implements, but shows the full duration of time between beats, which is essential in our game.

<div class="image-feature">
  <img src="/projects/rhythmrush/ui.gif">
  <div class="caption"> The metronome </div>
</div>

## Level Design

Level design proved to be one of the hardest parts of the game. We wanted levels that encouraged users to fall into our ideal play pattern while also being engaging.

The first level gives the user time to learn how to move around in the game.

<div class="image-feature">
  <img src="/projects/rhythmrush/lvl1.png">
  <div class="caption"> Level one </div>
</div>

The second level introduces two elements—first, intentionally reducing your movement range to fit through narrow doors. Second, avoiding red tiles.

<div class="image-feature">
  <img src="/projects/rhythmrush/lvl2.png">
  <div class="caption"> Level two </div>
</div>

The third level has all of these mechanics but at much higher stakes.

<div class="image-feature">
  <img src="/projects/rhythmrush/lvl3.png">
  <div class="caption"> Final level </div>
</div>

## Good Things?

Most of us agreed that the input method was successful and created a fun experience. The simplicity of the game creates a huge space for level design that we didn't have the time to explore.

<div class="image-feature">
  <img src="/projects/rhythmrush/leveldesign.jpg">
  <div class="caption"> A level mockup </div>
</div>

## Bad Things?

From testing the game in the class, some people picked it up right away but other struggled. Ideally we would have tested with more users to find out if this was a problem with our input thresholds, the UI, or something else we did, or if some people are just worse at rhythm games.
