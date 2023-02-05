---
title:  "How to Process a Comet in PixInsight"
type: Image Processing
date: 2023-02-02
categories: [ PixInsight ]
tags: [ comets ]
image: assets/images/videos/cometprocess.jpg
youtubeid: /GGSPEuj-Fs0
description: "Do you have the same issue that I did? Despite doing things like splitting out stars to align separately, you always end up with star streaks. I finally figured out the simple, single step to do between star alignment and comet alignment that makes all the difference and produces streak-free comets for me every time (without having to split the lights). This video walks through the full end-to-end of processing comets in PixInsight."
---

Prefer article format? Read [How do I stack a comet in PixInsight?](/how-do-i-stack-comets-in-pixinsight/).

Chapter Guide:

- 00:00:19 Review raw images
- 00:00:48 Step 1: Weighed Batch Preprocessing (WBPP)
- 00:01:50 Calibration settings
- 00:02:06 Exposure tolerance
- 00:02:29 Step 2: Comet alignment (wrong way)
- 00:03:39 Mark core of comet in first frame
- 00:04:01 Mark core of comet in last frame
- 00:04:36 Examine comet-aligned frame
- 00:04:54 Image integration
- 00:05:16 Streaks!
- 00:05:20 Step 2: Comet alignment (right way)
- 00:05:33 StarXTerminator (or StarNet++) to extract stars from integrated star-aligned image
- 00:06:06 Save stars to a file
- 00:06:24 Comet alignment...
- 00:06:31 Set the stars file as the "operand" (star-aligned) to subtract from each frame
- 00:06:52 Step 3: Post-processing
- 00:07:05 Examine comet-aligned frame
- 00:07:20 Image integration
- 00:08:16 PixelMath: combine the stars from the star-aligned integration with the comet  from the comet-aligned integration
- 00:08:32 Crop out noise at edges (DC)
- 00:08:54 Automatic Background Extraction (ABE)
- 00:09:14 Dynamic Background Extraction (DBE)
- 00:09:51 BlurXTerminator
- 00:10:06 EZ Soft Stretch
- 00:10:38 StarXTerminator to process comet separate from stars
- 00:10:54 SCNR to remove green stars
- 00:11:11 Curves, masks, etc. to sharpen comet
- 00:12:02 PixelMath to recombine the stars
- 00:12:39 Final result

- [Comet alignment](https://pixinsight.com/doc/tools/CometAlignment/CometAlignment.html)
- [StarXTerminator](https://www.rc-astro.com/resources/StarXTerminator/)
- [BlurXTerminator](https://www.rc-astro.com/resources/BlurXTerminator/index.php)

See also: [How to track a comet using N.I.N.A. software](/video/astro-tip-4/)