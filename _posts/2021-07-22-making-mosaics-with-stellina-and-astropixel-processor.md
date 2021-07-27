---
layout: post
title:  "Making mosaics with Stellina and AstroPixel Processor: Polaris"
author: deepskyworkflows
categories: [ astrophotography, stellina, astropixel processor, 2021-July ]
tags: [ mosaic, polaris ]
toc: true
image: assets/images/2021-07-22/polaris-annotated.jpeg
description: "Learn how to use Stellina to reframe observations and produce panels for larger images, then use AstroPixel Processor to combine them into a mosaic."
featured: true
---

This post walks through one technique for making mosaics, or pictures that are combined from multiple exposures. This appproach integrates the mosaic during stacking using AstroPixel Processor.

My first mosaic was [Collinder 399](https://photos.app.goo.gl/HWJKtQTPo9s8p7MK6). The [first time](https://photos.app.goo.gl/CdZDPvWw46SvQHae8) I observed it, I realized it was too large for the field of view. I decided to use a feature of Stellina called _reframing_ and take a run at AstroPixel Processor’s solution for mosaics. I was happy with the result, so this time I set out to do the same thing with the North Star, Polaris, “Engagement Ring” asterism.

## Stellina and reframing

Anyone familiar with Stellina will smile when they see this screenshot.

|![Stellina start](/assets/images/2021-07-22/stellinastar.jpeg)|
|:---:|
|_Stellina starting_|

<br/>

This is the phone app telling us that Stellina is “waking up” and about to align and autofocus. It will scan a section of the sky based on GPS, use astrometry to plate solve the area, and adjust the focus to match the known starfield.

|![Autofocus](/assets/images/2021-07-22/autofocus.jpeg)|
|:---:|
|_Autofocus_|

<br/>

The autofocus step means Stellina has successfully plate solved its orientation and is now setting up focus. This is a good step because it usually means it is ready to observe. Most failures will occur by now (i.e., sky obscured by high ceiling clouds or too close to dawn). Once the autofocus is complete, you “dial in” your selection. I chose the Engagement Ring (found it by searching, “Polaris”) and tapped “Start observation.” This moves Stellina into position, verifies the position, and begins to track. Sometimes atmospheric turbulence, light pollution or simply clouds may throw a wrench in tracking. If you see the following screen, you can be fairly confident an image is coming.

|![Tracking activation](/assets/images/2021-07-22/trackingactivation.jpeg)|
|:---:|
|_Tracking activation_|

<br/>

The unit begins to capture subframes and use built-in algorithms to discard bad frames. While it is sorting the initial frames, a black hole keeps us company with fast moving lights streaming into the center.

|![The ring](/assets/images/2021-07-22/thering.jpeg)|
|:---:|
|_“The ring”_|

<br/>

When the ring becomes solid, Stellina is locked and the first image appears. Which happens to be another ring.

|![The engagement ring](/assets/images/2021-07-22/engagementring.jpeg)|
|:---:|
|_The Engagement Ring_|

<br/>

What you see is Polaris, the North Star, conveniently centered near the top, and some of the stars that make up the engagement ring.

> 👉 Ordinarily, Stellina would render the star as a near perfect circle. I prefer the look of diffraction patterns, so I fashioned a cap out of a tripod box, dental floss and tape that places crosshairs across the lens for diffraction.

|![Diffraction filter](/assets/images/2021-07-22/diffractionfilter.jpeg)|
|:---:|
|_Diffraction filter_|

<br/>

Now that I know the observation is possible, I tap the grid above the “stop button” and am presented with options to reframe.

|![Initial framing](/assets/images/2021-07-22/initialframing.jpeg)|
|:---:|
|_Initial Stellina framing_|

<br/>

I drag the star to the right to capture the “left” side of the field. Here is the first adjustment (subsequent captures will fill in the left column)…

|![Adjusted framing](/assets/images/2021-07-22/adjustedframing.jpeg)|
|:---:|
|_Adjusted framing_|

<br/>

I essentially slid the image 33% to the “right” to bring in 33% of the field of view to the “left”. After five minutes of exposure, I then reframed 66% in the opposite direction. The result is an image with 33% overlap that extends the same amount to either side of the original. Think of it as two pieces of paper side-by-side overlapping in the right third/left third.

I used my custom Stellinator tool to copy over the files and then launched AstroPixel Processor.

## AstroPixel Processor (APP) mosaic setup

I prefer APP to stack and integrate my images. It consistently outperforms the built-in scripts that PixInsight has. I even tried the free DeepSky Stacker (DSS) but I always end up coming back to APP. The process is aligned in steps. First, I start with the “Load” panel and specify a working directory and the name of what I’m processing. Then I click “lights” and load my main images. I don’t have to specify which framing and just load them all into the app. I follow that by clicking “darks” and loading the most recent set of darks I took.

> __Darks__ are taken with the same settings as lights, only the lens is completely covered to prevent any light from coming in. You might expect the result to be a black square, but it’s not. Defects in the pixel array cause certain pixels to “light up”. By taking darks, software like PixInsight (PI) and APP can subtract these “bad pixels” from your lights to eliminate noise from the image you process.

|[![Dark frame](/assets/images/2021-07-22/darkframe.png)](/assets/images/2021-07-22/darkframe.png)
|:----:|
|_Sample dark frame_|

<br/>

Here is the first dialog:

|![Loading subframes](/assets/images/2021-07-22/loadingsubframes.jpeg)]
|:----:|
|_Loading subframes_|

<br/>

On the “register” tab, I increase the scale stop and change the mode to “mosaic.”

|![Registration settings](/assets/images/2021-07-22/registrationsettings.jpeg)]
|:----:|
|_Registration settings_|

<br/>

I keep most of the defaults. I sometimes switch to triangles (trial and error) and always uncheck “same camera and optics.” Even though it _is_ the same, for a mosaic we want it to do extra processing to fit the panels.

|![Registration tweaks](/assets/images/2021-07-22/registrationtweaks.jpeg)
|:----:|
|_Registration tweaks_|

<br/>

Finally, on the “integrate” tab, I set up a few things:

- I turn on Local Normalization Correction (LNC). This makes it take much longer to process but helps align the images better.
- Multi-band blending helps smooth the seams across panels. The percentage should be near the actual overlap, but you can see here I backed off from 33% to 20% and it worked fine.
- Because Stellina uses a Color Filter Array (CFA) I _always_ use Bayer (the name for the CFA) and X-Trans drizzle. I make the image very large (300% of the captured size) so I can manipulate the larger image, then scale it down to reduce noise.

> __Drizzle__ is a technique that takes advantage of frames shifting ever-so-slightly. Imagine if you had a sequence of numbers 1234 and your lens was “two numbers wide” so you could only sequence 1.5 and 3.5 (the average of 1 and 2, and 3 and 4). Now imagine you could shift the lens so it captures the “2 and 3” pair too. With the same lens and resolution, now captured 1.5, 2.5, and 3.5 and have a higher resolution. That is an over-simplified explanation of Drizzle.

> __Note__: the larger images take a lot of resources. You may want to actually reduce the size of your target to speed up the process and conserve space.

|![Integration settings](/assets/images/2021-07-22/integrationsettings.jpeg)
|:----:|
|_Integration settings_|

<br/>

Finally! 👉🔘 I hit the integrate button. A few hours later, I was presented with this image. It “fans out” because with each framing the sky rotated a bit.

|[![The final mosaic](/assets/images/2021-07-22/finalmosaic.jpeg)](/assets/images/2021-07-22/finalmosaic.jpeg)
|:---:|
|_The final mosaic_|

<br/>

I then loaded it into PixInsight for processing.

## Presenting: “The Engagement Ring.”

|[![Polaris Engagement Ring Asterism](/assets/images/2021-07-22/theengagementring.jpg)](/assets/images/2021-07-22/theengagementring.jpg)
|:----:|
|_The Engagement Ring_|

<br/>

### Details

||||
|---:|:--:|:---|
|__Right ascension (center):__| | 02h 48m 37.571s|
|__Declination (center):__| |  +88° 54' 03.106"|
|__Size:__| |  54.1 x 52.5 arcmin|
|__Radius:__| |0.620 deg|
|__Pixel scale:__| | 0.826 arcsec/pixel|
|__Orientation:__| | Up is 110 degrees E of N|
|__Equipment:__| | Stellina|
|__Focal length:__| | 400mm|
|__Aperture:__| | 8mm|
|__Focal ratio:__| | f/5|
|__Sessions:__| | 1|
|__Lights:__| | 136 total 5s filtered to 115(10 minutes total exposure)|
|__Darks:__| | 84 5s (7 minutes total exposure)|
|__Software:__| | AstroPixel Processor, PixInsight, Topaz DeNoise, Google Photos, Astrometry.net|

<br/>

|![Annotated image](/assets/images/2021-07-22/theengagementringannotated.jpeg)|
|:----:|
|_Annotated image_|

<br/>

### Workflow

1. Dynamic Crop
1. Auto-Linear Fit (a custom script I wrote)
1. Dynamic Background Extraction
1. Background Neutralization
1. Color Calibration
1. TGV Denoise
1. Multiscale Linear Transform (luminance, then chrominance)
1. EZ Soft Stretch
1. Several Curves Transformations
1. Topaz DeNoise AI
1. Resample (scaled down)
1. Google Photos

No special notes — this was a straightforward workflow.

Regards,

Jeremy
