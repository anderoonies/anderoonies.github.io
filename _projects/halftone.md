---
title: JavaScript for Halftone Printing
layout: page
excerpt: Recreating something old
photo_url: /projects/
---

Halftone printing is a technique for printing continuous value using dots of solid color with varying size or spacing. Because continuous values can't be printed using a single color of ink, halftones are used to create the illusion of continuous color. From a distance, the discrete dots produced by a halftone appear to produce intermediate values.

<div class="image-feature">
  <img src="/projects/halftone/gradient.png" style="max-width: 80vw; width: 400px">
  <div class="caption">From <i>The Atlas of Analytical Signatures of Photographic Processes: Halftone</i> by Dusan C. Stulik.</div>
</div>

By printing different colors of ink through layered halftones it's possible to create the illusion of the color of the original image.

<div class="image-feature">
  <img src="/projects/halftone/color.png" style="max-width: 80vw; width: 400px">
  <div class="caption">From <i>The Atlas of Analytical Signatures of Photographic Processes: Halftone</i> by Dusan C. Stulik.</div>
</div>

Note that this is meant to be illustrative, not a one-to-one replica of the process. I'm embracing the artifacts that happen as a result of trying to imitate it.

## Generating Halftones

Traditionally, halftone screens were made by exposing high-contrast film through a mesh screen, which would create dots on the film. Here, we're going to imitate this process by creating dots on an HTML5 canvas.

We'll begin by generating a halftone from a grayscale gradient. Areas of the gradient which are darker will result in larger dots in our halftone, and areas of the gradient which are lighter will result in smaller dots.

<div class="snippet">
{% highlight javascript %}
{% include halftone/source_gradient.js %}
{% endhighlight %}
    <div class="canvas-container">
        <script>
            {% include halftone/source_gradient.js %}
        </script>
    </div>
</div>

To generate the halftone, we'll sample the source canvas's color data at a regular interval and draw a dot (with `context.arc()`) sized based on the value of the gradient at that point.

<div class="snippet">
{% highlight javascript %}
{% include halftone/halftone.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/halftone.js %}
    </script>
    </div>
</div>

Next, lets look at what happens when the angle of the screen changes.
To change the screen angle, the code conceptually rotates the entire screen around its center to find the positions of the dots that will need to be drawn. Because a screen of the same size as the image wouldn't cover the entire image when rotated, the conceptual boundaries of the screen are expanded.

<div class="snippet">
{% highlight javascript %}
{% include halftone/rotation.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/rotation.js %}
    </script>
    </div>
</div>

We'll see later how important the angle of the screens can be when printing multiple layers.

We can also change the size of dots and the resolution of dots. When we approach 1 pixel per dot, the optical illusion of the halftone begins to become more convincing.

<div class="snippet">
{% highlight javascript %}
{% include halftone/dotsize.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/dotsize.js %}
    </script>
    </div>
</div>

## Layering Halftones

Using a single color of ink results in a loss of detail when printing the darkest values. Because the only way to achieve a dark value in a single halftone is with large dots, the detail becomes limited by the size of the dot (and any resulting ink bleed).

The solution is printing in multiple layers with different color inks, called a "duotone." The dark areas of the image are printed using black ink, and middle values would be printed using a lighter color of ink. When the two layers are superimposed, the dark areas appear darker without over-saturating.

Let's create a duotone of this still life, <i>Maiolica Basket of Fruit</i> by Fede Galizia.

<div class="snippet">
{% highlight javascript %}
{% include halftone/imagesplit.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/imagesplit.js %}
    </script>
    </div>
</div>

Let's now convert those two grayscales into halftones. The halftone we're using to print black will have smaller dots, to prevent over-saturation and bleed.

<div class="snippet">
{% highlight javascript %}
{% include halftone/imagesplithalftone.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/imagesplithalftone.js %}
    </script>
    </div>
</div>

Finally, let's draw those two halftones on the same canvas, but with different ink colors. The darker colors will still use black, but the lighter colors will use gray. We'll make one final, vital adjustment: **the two layers will be offset by 45º**.

<div class="snippet">
{% highlight javascript %}
{% include halftone/combinedduotone.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/combinedduotone.js %}
    </script>
    </div>
</div>

Move the slider the entire way to 0, and notice how this is visually identical to just the gray layer alone. When the two screens are offset, though, the gray midvalues are visible. Importantly, reduced the size of the dots, so the blackest areas are no longer over-saturated but still appear dark.

Early duotones were produced from photographs, but ink color was chosen manually. You can play with that here.

<div class="snippet">
{% highlight javascript %}
{% include halftone/customcolorduotone.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/customcolorduotone.js %}
    </script>
    </div>
</div>

Also, note the grid pattern that appears when sliding the angle. This is called a **moiré**, and we're going to figure out how to eliminate it.

## Moiré and Rosettes

When printing two halftones on top of one another, their grid patterns will align at intervals.
Let's look at an example of two large halftones, one red and one blue. Adjusting the angle between the halftones and you'll notice patterns emerge and disappear. Particularly, **note the pattern around 82º and 12º**.

<div class="snippet">
{% highlight javascript %}
{% include halftone/moireone.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/moireone.js %}
    </script>
    </div>
</div>

In printed material, this grid can be distracting, and angles are chosen in order to eliminate it.
Let's look at eliminating the moiré with four layers: cyan, magenta, yellow, and black (commonly known as CMYK, where black is "key").

<div class="snippet">
{% highlight javascript %}
{% include halftone/cmyk.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/cmyk.js %}
    </script>
    </div>
</div>

There is no single "best" set of angles, but the angles are designed to maximize the distance between cyan, magenta and key. Because yellow is least visible, it can be comfortably aligned with cyan or magenta without producing visible moiré.

This alignment produces a specific moiré called a "rosette," which is the least distracting moiré. Rosettes occur at a high frequency in printed material, which makes them difficult to see at distance.

## Converting an Image to CMYK

CMYK is a "subtractive" color model, compared with additive color models like LCD screens. Cyan, magenta, and yellow act as filters that absorb color from the printing substrate. Cyan is the complement of red, so the presence of cyan prevents red light from being reflected back to the viewer.

To calculate the corresponding CMY values for an RGB color, then, we can just take the complement of each channel. Cyan is the complement of red, magents is the complement of green, and blue is the complement of yellow.

Here's a canvas with an RGB gradient (ignore the gray that gets generated when doing RGB interpolation) and the three individual CMY half tones created from it, then those three composited. I extract each to a grayscale in-memory canvas first, which may seem unnecessarily complex, but it's in keeping with the practical way these halftones would be generated.

<div class="snippet">
{% highlight javascript %}
{% include halftone/cmygradient.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/cmygradient.js %}
    </script>
    </div>
</div>

The only bit that's left is extracting the key, which is done by extracting the value of the color. That key value is subtracted from each of the CMY colors.

The final example allows all parameters to be configured. I've manually chosen halftone angles that I think "look good," which is of course my right.

<div class="snippet">
{% highlight javascript %}
{% include halftone/birds.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/birds.js %}
    </script>
    </div>
</div>

<style>
    .snippet {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
    }
    .snippet figure {
        overflow: auto;
        max-height: 500px;
    }

    .canvas-container {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        flex: 1 0;
    }
</style>
