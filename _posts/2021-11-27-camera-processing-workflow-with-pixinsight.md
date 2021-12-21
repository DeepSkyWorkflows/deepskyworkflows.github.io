---
layout: post
title:  "My Camera Processing Workflow with PixInsight"
author: deepskyworkflows
categories: [ PixInsight, AstroPixel Processor, Topaz Labs ]
tags: [ pixinsight, processing, M42, NGC1977, NGC2024, deconvolution ]
toc: false
image: assets/images/2021-11-27/camera.jpg
description: "A full end-to-end processing workflow for my camera-only (no telescope) photos focused on PixInsight. Contains some advanced tips for rounding stars, stretching contrast, and making masks."
featured: false
hide: true
comments: true
---

An editing workflow recorded live with tips from changing the shape of stars _without_ Deconvolution to dual frequency processing.

After what felt like an eternity of polar alignment, I accidentally knocked my mount. In what was supposed to be a period of clear skies, the only thing clear was that clouds were moving in. So, I desperately captured several 45-second exposures and called it a night. Or a morning, rather. You know what I mean. I quickly moved my images from my laptop that I use to drive imaging sessions to my processing workstation. A "blink" (quick scan of images) revealed what I feared: most were ruined by clouds. I ended up stacking a measely handful of frames and the result did not look good. So, what to do? Why, use it as practice! I decided to go live on Thanksgiving Day with an editing session that you can watch here:

{% include youtube.html code="VT67o_Bz6nQ" title="Live: Camera Editing Workflow in PixInsight" %}

In this video I show several of my more advanced techniques. Here is what I shared:

- Using my [Autolinear Fit](https://github.com/DeepSkyWorkflows/DeepSkyWorkflowScripts/blob/main/docs/autoLinearFit.md) script to balance the colors up front.
- Dynamic Background Extraction to remove a rather aggressive gradient/vignette.
- The secrets to a successful Photometric Color Calibration.
- Using my [Generate Decon Support](https://github.com/DeepSkyWorkflows/DeepSkyWorkflowScripts/blob/main/docs/generateDeconSupport.md) script to create a star mask, deconvolution support, and a mask to help with Dynamic PSF.
- How I stretch my non-linear images.
- A trick to get Curves Transformations "just right."
- Noise reduction using Multiscale Linear Transformations.
- How I use dual frequency processing.
- ArcSinhStretch to bring out contrast and detail.
- How to make a mask with Range Selection.
- A technique besides Deconvolution for making stars more round.
- How I use Multiscale Linear Transformation to dim lights.
- A little PixelMath to tie it altogether.

I hope you are able to learn from this video and look for the lessons and tips you are able to share in return!