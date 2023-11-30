---
layout: post
title:  "How do I stack comets in PixInsight?"
author: deepskyworkflows
categories: [ PixInsight, Comets ]
tags: [ Comets ]
toc: true
image: assets/images/2023-02-04/how-to-process-comets-in-pixinsight.jpg
description: "Do you have the same issue that I did? Despite doing things like splitting out stars to align separately, you always end up with star streaks. I finally figured out the simple, single step to do between star alignment and comet alignment that makes all the difference and produces streak-free comets for me every time (without having to split the lights). This post walks through the full end-to-end of processing comets in PixInsight."
featured: true
comments: true
---
This post will dive straight into the solution. Everything covered here is shown in the video, [How to Process a Comet in PixInsight](/video/process-comet-pixinsight/).

# Weighted Batch Preprocessing

This step will calibrate, debayer, star-align and integrate your data. You can also do this manually. If you're not familiar with calibration, read my [quick and dirty intro to calibration frames for astrophotography](/the-quick-and-dirty-on-calibration). If you go the manual route, you'll do something like this depending on what data you have.

{% include blogimage.html description="Raw frame" url="rawframe.jpg" half=true target=true %}

1. Integrate **bias** frames to create a _master bias_ per ISO/Gain.
1. Integrate **dark** frames for a _master dark_ per exposure and ISO/Gain.
1. Subtract the _master bias_ from the _master dark_ to calibrate it.
1. Subtract the calibrated _master dark_ from the **dark flats** to calibrate them.
1. Integrate the dark flats into a _master dark flat_.
1. Subtract the _master dark flat_ from the **flat frames** to calibrate them.
1. Integrate the flat frames into a _master flat_.
1. Subtract the _master dark_ from the **lights** to calibrate them.
1. Divide the lights by the _master flat_ to calibrate them.
1. Optionally apply **cosmetic calibration** to the lights.
1. **Debayer** (de-mosaic) the lights.
1. **Star align** (register) the lights.
1. **Integrate** the the registered lights.

{% include blogimage.html description="Debayered" url="debayered.jpg" half=true target=true %}

{% include blogimage.html description="Registered" url="registered.jpg" half=true target=true %}

At the end of the process you should have an image with perfect stars but a seriously smeared comet. We'll call this one _star-integrated_.

{% include blogimage.html description="Star-integrated" url="star-integrated.jpg" half=true target=true %}

# Star extraction

The next step is to steal the stars. The stack came from the star-aligned frames. The resulting stars will align perfectly. We can use that to ignore the stars and focus on what changes, i.e. the data for the comet. If you have **StarXTerminator** run that and use the option to generate a star image and unscreen the stars. An alternative is to run **StarNet++**. Save the stars to a `fits` or `xisf` and call it _stars_. 

{% include blogimage.html description="It's full of stars..." url="stars.jpg" half=true target=true %}

> **TIP** If you notice some of the comet came along for the ride due to its bright core, use the **CloneStamp** tool to remove it by cloning the background over it. We just want stars here.

# Comet alignment

Now you can run the **CometAlignment** process. The steps here are:

1. Load the _registered_ frames (these are the same ones that were integrated in the first step).
2. Click on the nucleus/core of the comet in the first frame. You can either double-click on the first file in the list or use the button to load it, then stretch it and click.
3. Repeat the step for the comet in the last frame. The alignment tool will use the distance between these two points to compute the comets position in the other frames based on their timestamp. You can also manually update other frames.
4. Here is the key that most people miss. In the **subtract** section you can specify the _stars_ file you saved earlier and pick _stars aligned_ as the type. The result is that the stars will be subtracted from each frame, essentially leaving just the comet behind. The residual star "ghosts" will be averaged out by the stacking algorithm. This is how to a void star trails and streaks.
5. Align!

{% include blogimage.html description="Marked the nucleus" url="coremarked.jpg" half=true target=true %}

{% include blogimage.html description="Comet-aligned frame" url="cometaligned.jpg" half=true target=true %}

# Comet integration

Now run **ImageIntegration** on the comet-aligned frames. You should get the comet and some noise along the edges where comet alignment had to crop the frame.

{% include blogimage.html description="Integrated comet" url="comet.jpg" half=true target=true %}

You might be tempted to crop out the noise, but not yet. To finish the integration, we need to put the stars back. Using some simple **PixelMath** we'll blend the inverse of the two images and then invert the result. This makes for a smooth integration. If you used something besides _stars_ for your stars file, replace it in the following equation. This equation can be dropped onto the integrated comet (which will serve as the target, or `$T` in the formula) to integrate the stars.

```
~(~$T*~stars)
```

{% include blogimage.html description="The stars are back!" url="starintegration.jpg" half=true target=true %}

# Post-processing

Now we can process it like any other deep sky object. The process I usually follow is this:

1. **Dynamic Crop**
1. **Automatic Background Extraction**
1. **Dynamic Background Extraction**
1. **ImageSolver** if not already plate-solved
1. **SpectrophotometricColorCalibration**
1. **BlurXTerminator**
1. **EZ Soft Stretch**
1. Miscellaneous tweaking of curves, noise, and generation of masks to help bring out the comet detail.

{% include blogimage.html description="The final result" url="/assets/images/gallery/greencomet/greencomet.jpg" half=true target=true %}

Q.E.D.