---
layout: post
title:  "Cluster NGC6823 Pass 1"
author: deepskyworkflows
toc: true
categories: [ astrophotography, pixinsight, astropixel processor, year-2021, month-2021-july ]
tags: [ngc6823, nebula ]
image: assets/images/2021-07-21/ngc6823-annotated.jpeg
description: "Image and workflow for cluster with nebula NGC6823."
featured: false
---

NGC 6823 is an open cluster. It contains a small reflection nebula (NGC6820).

It is a very faint target so I’ll likely want to take more exposures to build a final image. I almost ignored the target until I did some research and realized it contains some interesting dark structures that would be a fun challenge to take on. Although I’m not happy with the current picture, I thought I’d post it anyway and share my approach.

[![NGC6823 Pass 1](/assets/images/2021-07-21/ngc6823.jpeg)](/assets/images/2021-07-21/ngc6823.jpeg)

*NGC 6823 (NGC 6820)*

## Details

| | | |
|--:|---|:--| 
|__Right ascension (center):__| |19h 43m 10.456s|
|__Declination (center):__| | +23° 16' 16.947"|
|__Size:__| | 58.9 x 44.5 arcmin|
|__Radius:__| | 0.615 deg|
|__Pixel scale:__| | 0.687 arcsec/pixel|
|__Orientation:__| | Up is 181 degrees E of N|
|__Equipment:__| | Stellina|
|__Focal length:__| | 400mm|
|__Aperture:__| | 8mm|
|__Focal ratio:__| | f/5|
|__Sessions:__| | 2|
|__Lights:__| | 809 10s filtered to 723 (2 hours total exposure)|
|__Darks:__| | 36 10s (6 minutes total exposure)|
|__Software:__| | AstroPixel Processor, PixInsight, Topaz DeNoise, Google Photos, Astrometry.net|

## Workflow

I stacked both sessions with AstroPixel Processor. I chose a drizzle integration at 3x resolution because I can work at the high resolution, then scale down to reduce noise. I picked the top 90% of images and let APP do its thing. When I pulled it into PixInsight, this is what I started with (artificially stretched):

[![Raw linear image](/assets/images/2021-07-21/ngc6823-linear.jpeg)](/assets/images/2021-07-21/ngc6823-linear.jpeg)

The starfield was beautifully captured, but the nebula incredibly faint. I took it through the following workflow:

1. Fast Rotation
1. Dynamic Crop
1. Auto-Linear Fit
1. Dynamic Background Extraction
1. Background Neutralization
1. Photometric Color Calibration
1. TGVDenoise
1. Multiscale Linear Transformation
1. Deconvolution
1. EZ Soft Stretch
1. StarNet
1. Local Histogram Equalization
1. Morphological Transformation
1. Curves Transformation
1. PixelMath
1. Curves Transformation

I saved the final result as a TIFF and imported it into Topaz DeNoise AI for noise reduction. I then reduced the size to 60% of the original, uploaded it to Google Photos and tweaked the settings.

## Notes

- I used a script that I wrote to normalize the RGB channels.
- The nebula was incredibly faint before stretching, so after stretching it, I used StarNet to pull the stars out. I adjusted the curves to bring out the contrast, boosted the saturation, and pulled out details with local histogram equalization.
- The resulting “no stars” image still had a dense starfield, so I used a Morphological Transformation erosion to reduce the stars. This required a range mask to avoid impacting the nebula.
- The image was still a mess, but had better detail and contrast than before

  [![No stars](/assets/images/2021-07-21/ngc6823-no-stars.jpeg)](/assets/images/2021-07-21/ngc6823-no-stars.jpeg)
- Instead of combining the stars back to the main image, I opted to take the image *before* manipulation and average it with the manipulated one. This reduced the noise artifacts significantly.
- I then used contrast to make a dark background. This sacrificed the brightness of the nebula but minimized the ugly background noise.

I’m confident I’ll be capturing more subs and revisiting this one in the future!

Regards,

Jeremy