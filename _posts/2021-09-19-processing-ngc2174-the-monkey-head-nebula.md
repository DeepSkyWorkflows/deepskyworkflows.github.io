---
layout: post
title:  "Processing NGC2174: The Monkey Head Nebula"
author: deepskyworkflows
categories: [ Imaging session, Processing, Stacking, Learning ]
tags: [ ngc2174 ]
toc: false
image: assets/images/2021-09-19/NGC2174-Monkey-Head-Nebula.png
description: "A full end-to-end processing workflow from acquiring images to final polish using AstroPixel Processor, PixInsight, and Topaz Labs."
featured: false
hide: true
comments: true
---

I recently ran a poll asking what my next video should be, and the response was near-unanimous: a full walkthrough. So, here it is. I processed NGC2174 from two sessions and recorded the entire process end-to-end. This is what it looked like:

{% include youtube.html code="dVpnERUD-j0" title="Monkey Head Nebula Part 1" %}

- I started with showing how to use [Stellinator](https://github.com/DeepSkyWorkflows/Stellinator) to organize the files from Stellina's thumb drive. 
- Next, I used the [Blink tool](https://www.youtube.com/watch?v=dVpnERUD-j0&t=445s) to remove bad images.
- Finally, I [stacked the images](https://www.youtube.com/watch?v=dVpnERUD-j0&t=799s) with AstroPixel Processor.

{% include youtube.html code="tgQEQBr3TUg" title="Monkey Head Nebula Part 2" %}

- Next, I applied background extraction and background neutralization, then ran color calibration.
- Finally, I ran my [deconvolution script](https://github.com/DeepSkyWorkflows/DeepSkyWorkflowScripts/blob/main/docs/generateDeconSupport.md) to generate special masks to improve the quality of stars in the image.

{% include youtube.html code="4TR2JW0SxSY" title="Monkey Head Nebula Part 3" %}

- To clean up noise I used the [EZ Processing Suite](https://darkarchon.internet-box.ch:8443) EZ DeNoise feature.
- I used the same suite to [apply a soft stretch](https://www.youtube.com/watch?v=4TR2JW0SxSY&t=340s) to the nebula.
- I [created some special masks](https://www.youtube.com/watch?v=4TR2JW0SxSY&t=565s) to tweak the contrast and saturation and darken the background.
- I [experimented with](https://www.youtube.com/watch?v=4TR2JW0SxSY&t=909s) Local Histogram Equalization and HDR Multiscale Transform but decided they weren't right for this workflow.
- Finally, I [created a range mask](https://www.youtube.com/watch?v=4TR2JW0SxSY&t=1324s) to remove the last bit of noise from the background.

{% include youtube.html code="JjvGfwwdAvg" title="Monkey Head Nebula Part 4" %}

- I used [Topaz Labs DeNoise AI](https://www.topazlabs.com/denoise-ai) to smooth the final image.
- Back in PixInsight, I [scaled the image](https://www.youtube.com/watch?v=JjvGfwwdAvg&t=197s) and added my signature.
- I [pulled into Google Photos](https://www.youtube.com/watch?v=JjvGfwwdAvg&t=370s) for some final tweaks.

I'm very happy with the [final result](https://www.youtube.com/watch?v=JjvGfwwdAvg&t=442s).

Let me know your thoughts!