---
title: JavaScript for Halftone Printing
layout: page
excerpt: Recreating something old
photo_url: /projects/
---

Halftone printing is a technique for printing continuous value using dots of solid color with varying size or spacing. Because continuous values can't be printed using a single color of ink, halftones are used to create the illusion of continuous color. From a distance, the discrete dots produced by a halftone appear to produce intermediate values.

<div class="image-feature">
  <img src="/projects/halftone/gradient.png" style="max-width: 400px">
  <div class="caption">From <i>The Atlas of Analytical Signatures of Photographic Processes: Halftone</i> by Dusan C. Stulik.</div>
</div>

By printing different colors of ink through layered halftones it's possible to create the illusion of the color of the original image.

<div class="image-feature">
  <img src="/projects/halftone/color.png" style="max-width: 400px">
  <div class="caption">From <i>The Atlas of Analytical Signatures of Photographic Processes: Halftone</i> by Dusan C. Stulik.</div>
</div>

Note that this is meant to be illustrative, not a one-to-one replica of the process. I'm embracing the artifacts that happen as a result of trying to imitate the process.

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

We can also change the size of dots. When we approach 1 pixel per dot, the optical illusion of the halftone begins to become more convincing.

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

The solution is printing in multiple layers with different color inks, called a "duotone." The dark areas of the image are printed using black ink at a fine resolution, and middle values would be printed using a lighter color of ink. This allowed for dark values to contrast with the rest of the image without oversaturating.

To accomplish this, let's create two half tones, one containing only the darkest values of the image, the other containing all values. First, we'll split the image into two grayscales. You can control the threshold that is used to split the image.

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
Let's look at an example of two large halftones, one red and one blue. Adjusting the angle between the halftones and you'll notice patterns emerge and disappear. Particularly, **note the area around 82º, and 13º**.

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

Notice the emergence and disappearance of the moiré as the angles change.

This is a great opportunity to look at rosettes. To get the most convincing optical illusion, all colors need to be clustered close to each other without resulting in moirés. Some angles produce small circular clusters, known as rosettes. These are too small to be distracting in printed material, but cluster the colors in a way that produces a convincing image.

- cmyk covers the spectrum
- figure out the c from r, m from g, etc.
- show a full red, a full green, a full blue

## Moire

- angles
- show the 90º and an interactive thing

<style>
    .snippet {
        display: flex;
        align-items: center;

    }
    .snippet figure {
        overflow: auto;
        max-height: 400px;
    }

    .canvas-container {
        display: flex;
        flex-flow: column;
    }
</style>
