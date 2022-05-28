---
title: JavaScript for Halftone Printing
layout: page
excerpt: Recreating something old
photo_url: /projects/halftone/header.png
---

# JavaScript for Halftone Printing

Halftone printing is a technique for printing continuous value using dots of solid color with varying size or spacing.

Halftones were invented in the 19th century as a way to accurately reproduce photographs in print. Ink can only print one value (black or white), but halftones introduce the illusion of continous value with the size and spacing of dots.

<div class="image-feature">
  <img src="/projects/halftone/first.jpg" style="max-width: 80vw; width: 400px">
  <div class="caption">The first halftone print, a recreation of a photograph of Prince Albert from Canadian Illustrated News in 1869. The density of printed dots creates continuous value.</div>
</div>

Additionally, by printing different colors of ink through layered halftones, it's possible to create the illusion of the color of the original image.

<div class="image-feature">
  <img src="/projects/halftone/color.png" style="max-width: 80vw; width: 400px">
  <div class="caption">The Atlas of Analytical Signatures of Photographic Processes The Getty Conservation Institute, © 2013 J. Paul Getty Trust</div>
</div>

This article is meant to be illustrative, not a one-to-one replica of the printing process. I'm embracing the artifacts that happen as a result of trying to imitate it. The images generated here may appear differently based on the device you're using.

## Generating Halftones

Traditionally, halftone screens were made by exposing high-contrast film through a mesh screen, which would create dots on the film. Here, we're going to imitate this process by drawing circles on an HTML5 canvas.

<div class="image-feature">
  <img src="/projects/halftone/gradient.png" style="max-width: 80vw; width: 400px">
  <div class="caption">The Atlas of Analytical Signatures of Photographic Processes The Getty Conservation Institute, © 2013 J. Paul Getty Trust</div>
</div>

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

To generate the halftone, we'll sample the source canvas's color data at a regular interval and draw a dot (with `context.arc()`) sized based on the value of the gradient at that point. The value is extracted from the 2d rendering context's `ImageData`, which is organized as a flat array of `[R, G, B, A, R, G, B, A, ...]`.

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

The size of the circle in the half tone corresponds to the source image's value, which is some number between 0 and 255. In a grayscale image, the red, green, and blue channels will all have the same value, so the pixel's value can just be taken from `imageData.data[index]`, which is the red channel of the pixel.
Even when printing a color image the halftones are generated from grayscale, so we'll be able to use this same trick later on.

Let's look at what happens when the angle of the screen changes.
To change the screen angle, the code conceptually rotates the entire screen around its center to find the positions of the dots that will need to be drawn. Because a screen of the same size as the image wouldn't cover the entire image when rotated, the boundaries for iteration are expanded to cover the full region covered by the screen.

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

This is the `halftone` function we'll use throughout the rest of this article. It takes an:
* `angle` to rotate the halftone screen by, 
* `dotSize` which determines the radius of a dot,
* `dotResolution` which is the space between dots, 
* `targetCtx` onto which it will draw, 
* `sourceCtx` from which it will extract value (it assumes it is grayscale),
* `width` and `height` of the source and target, and 
* `color` it will use for dots. 
* `layer` determines whether the target context should be cleared before drawing.

The `halftone` function iterates over a 2-dimensional grid of positions where it would like to put a dot. When making a dot, it samples the source context's image data, converts the value from a range of 0-255 to a radius, and draws a circle at that position in the target context.

## Layering Halftones

Because the only way to print a darker value is putting more ink through a larger dot, darker areas of a printed image suffer from over-saturation and ink bleed. In order to maintain high detail in dark areas, multiple layers are printed using different color inks, called a "duotone."

<div class="image-feature">
  <img src="/projects/halftone/duotone.jpg" style="max-width: 80vw; width: 400px">
  <div class="caption">The Atlas of Analytical Signatures of Photographic Processes The Getty Conservation Institute, © 2013 J. Paul Getty Trust</div>
</div>

The dark areas of the image are still printed using black ink, but at a finer resolution to avoid over-saturation. A second layer is printed using a lighter ink, so when the two layers are superimposed, the dark areas appear dark while maintaining detail. This is called a "duotone."

Let's create a duotone of this still life by Goya.

<div class="snippet">
{% highlight javascript %}
{% include halftone/stilllife.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/stilllife.js %}
    </script>
    </div>
</div>

First, let's look at the result of generating a halftone directly from this image. I'm using a resolution of 3 pixels between dots and a dot diameter of 5 pixels.

<div class="snippet">
{% highlight javascript %}
{% include halftone/stilllifehalftone.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/stilllifehalftone.js %}
    </script>
    </div>
</div>

The area around the grapes (?) is very dark, and we lose some of the detail of the image because of how densely the dots are packed. The bottles in the background also disappear, because the dot size is oversaturated. Let's try to solve this using a duotone.

First, the image is split into two separate layers. The first layer contains all values, and will be printed first in a light color. The second layer contains primarily the darkest colors, and will be printed second in black. The exact distribution of value between the layers is usually controlled with a duotone curve, but in our case I'll just split on values darker than 127.

<div class="snippet">
{% highlight javascript %}
{% include halftone/stilllifesplit.js %}
{% endhighlight %}
    <div class="canvas-container">
    <script>
        {% include halftone/stilllifesplit.js %}
    </script>
    </div>
</div>

Next, we'll generate halftones from these two grayscale images and stack these two halftones on top of eachother, printing brown first, then our shadows second in black.

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

When the two screens are offset, the two layers overlap and form a dark value without making the dots too large. You can see the outlines of the bottles against the dark background and the contour of the pears.

Early duotones were produced from photographs, but ink color was chosen manually in order to match the mood of the original. You can play with that here.

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

When overlaying the two layers you may have noticed a distracting grid-like pattern. This is called a **moiré**, and we're going to look at how to control it.

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

This alignment produces a specific moiré called a "rosette," which is the least distracting moiré. Rosettes occur at a high frequency in printed material, which makes them difficult to see at distance. Look closely at printed material and you can find them.

<div class="image-feature">
  <img src="/projects/halftone/rosette.jpg" style="max-width: 80vw; width: 400px">
  <div class="caption">The Atlas of Analytical Signatures of Photographic Processes The Getty Conservation Institute, © 2013 J. Paul Getty Trust</div>
</div>

## Converting an Image to CMYK

CMYK is a "subtractive" color model, compared with additive color models like LCD screens. Cyan, magenta, and yellow act as filters that absorb color from the printing substrate. Cyan is the complement of red, so the presence of cyan prevents red light from being reflected back to the viewer.

To calculate the corresponding CMY values for an RGB color, then, we can just take the complement of each channel (255 - value). Cyan is the complement of red, magents is the complement of green, and blue is the complement of yellow.

Here's a canvas with an RGB gradient (ignore the gray that gets generated when doing RGB interpolation) and the three individual CMY half tones created from it, then those three composited.

I extract each to a grayscale in-memory canvas first, which may seem unnecessarily complex, but it's in keeping with the practical way these halftones would be generated. Halftone generation is concerned only with _value_, not color, so I convert the color to grayscale then create a halftone from that grayscale.

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

The only bit that's left is extracting the key, which is done by extracting the darkest value of the color. That key value is subtracted from each of the CMY colors.

For example, given the pixel `(126, 18, 20)`, the key is equal to `255 - max(126, 18, 20) == (255 - 126) == 129`. 

Then, the cyan channel is equal to `(255 - R - K) == (255 - 126 - 129)`,

the magenta channel is equal to `(255 - G - K) == (255 - 126 - 18)`, and

the yellow channel is equal to `(255 - B - K) == (255 - 126 - 20)`.

There's one last thing that needs to happen, which is complementing this value. We're creating a grayscale image to generate our halftone from, and because **dark values produce dots**, we'll want to finally take the complement of this value. For example, with our cyan channel of `(255 - 126 - 129) == 0`, we should end up with _no_ dot in the resulting cyan halftone. A white value will produce no dot, so subtracting our value from white (`(255, 255, 255)`) will give us that result. This math can be simplified, but keeping it longform makes conceptual sense to me.

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
        margin-bottom: 15px;
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
