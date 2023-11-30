---
layout: post
title:  "Processing Planets with PixInsight using Bulk Operations"
author: deepskyworkflows
categories: [ PixInsight, Planetary ]
tags: [ jupiter ]
toc: false
image: assets/images/gallery/jupiter/thumb.jpg
description: "Learn how to use ImageContainer, ProcessContainer, and FFTRegistration to stack planetary images produced by Stellina. With a guest appearance from Pierre, my parrot."
featured: false
hide: true
comments: true
---

I recorded a quick video to show how I work with planets. Stellina is definitely designed for deep space photography, so the planets it captures usually end up quite small relative to the field of view. That does't mean you can't shoot enough frames to draw out detail. This example uses the planet Jupiter. The workflow looks like this:

1. Blink and remove any bad frames
2. Apply a mass reasmple to upsize the remaining frames
3. Run FFTRegistration to align and stack the images
4. Build a moon mask
5. Build a planet mask
6. Bring out the contrast in the moons
7. Saturate the planet
8. Apply UsharpMask, LocalHistogramEqualization and/or HDRMultiscaleTranform
9. Plenty of Curves
10. Publish!

This short video walks through the steps and hopefully will answer most questions you have:

{% include youtube.html code="OhBeBjJGNtw" title="Planet Processing with PixInsight" %}

For the questions and answers that I missed, please use the comments below!

Regards,

Jeremy