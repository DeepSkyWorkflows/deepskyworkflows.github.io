---
layout: post
title:  "Video: What program is best for astrophotography stacking?"
author: deepskyworkflows
categories: ["videos"]
tags: ["stacking", "ngc1977"]
toc: true
image: assets/images/2022-06-21/stackbanner.png
description: "Using the same set of data, I compare the performance of five programs for stacking a deep sky object (DSO). Included: ASIDeepStack, Astrometric Stacking Program (ASTAP), AstroPixel Processor (APP), Deep Sky Stacker (DSS) and PixInsight."
featured: true
hide: true
comments: true
---

I've wanted to compare stacking programs for awhile now. A relaxing Father's Day finally gave me the opportunity. Yes, you heard that right: for fun, I stacked the same target five times and made a video with the results. This post dives into more details and caveats, so after you've watched the video, be sure to keep reading. I use all of these programs in different ways, so the ranking is more of a guide for beginners to help them choose a starting point rather than a way to "eliminate" any software. In fact, many of the programs do more than just stack and some handle specialized scenarios. This is "[What's the best software for stacking photos for astrophotography?](https://www.youtube.com/watch?v=zkvOXEM9iP4)".

{% include youtube.html code="zkvOXEM9iP4" title="What's the best software for stacking photos for astrophotography?" %}

## Methodology

> __Note__ I use affiliate links for products and may receive a commission if you purchase after clicking through. All proceeds are reinvested into my astrophotography hobby.

My goal is to approach stacking from the perspective of someone new to astrophotography. Every program has dials and levers that experienced users know how to operate. What about someone new who might not be so familiar? And what if their data isn't clean? With those goals in mind, I picked a data set I used to create my favorite [NGC1977: The Running Man Nebula](/gallery/running-man/) astrograph. The data was acquired on a Celestron EdgeHD 9.25" Schmidt-Cassegrain scope using the [ZWO ASI294MC Pro](https://amzn.to/3yUcfpo) camera. I included a set of darks to compensate for the amp glow and intentionally left several out of focus frames and frames with satellite trails. In my opinion, good software should sort frames on quality and discard the bad ones.

Here is a sample raw "light" frame that has been stretched for visibility.

{% include blogimage.html description="Light frame" url="samplelight.jpg" half=true target=true %}

The stars are squashed, there are faint dust rings and a satellite trail dominates the lower right. The master dark clearly reveals the amp glow the ASI294MC pro is known for. 

{% include blogimage.html description="Master dark frame" url="masterdark.jpg" half=true target=true %}

This illustrates the value of darks because the glow is subtracted and not present in the stacked pictures. The dust rings are also removed due to the existence of the flat. Here is the master flat. 

{% include blogimage.html description="Master flat frame" url="MasterFlat_Gain200.jpg" half=true target=true %}

Finally, the master dark flat:

{% include blogimage.html description="Master dark flat frame" url="masterdarkflat.jpg" half=true target=true %}

For processing the images, I tried to stick as close to the defaults as possible. Some software like PixInsight and Deep Sky Stacker has recommended settings you can choose to apply, so I used those when possible. I then ran the stacking software. I minimally processed the result by normalizing or "aligning" the red, green, and blue channels, cropping out noisy edges and applying a default stretch. I then ranked the results from 1 (best) to 5 (least favorite) using these categories:

- __Duration__ - how long did it take to stack from clicking "go" to getting a final result? Not everyone has high end machines and the longer it takes to stack, the fewer targets you can process in a limited amount of time.
- __User interface__ - a subjective measure of how "friendly" or easy to use the app is, especially for beginners.
- __Noise__ - an objective measure of the signal-to-noise ratio of the final result. I could have measured the raw output, but that would include the noisy borders. The measurement is based on the final image and therefore was influenced by post-processing. I did _not_ run any noise reduction algorithms.
- __Stars__ - a rating of how the stars appear. Did they end up with halos? Oversaturated cores? Funny shapes from the out-of-focus frames?
- __Edges__ - how well did the software stack "to the edge"? Did I have to trim a lot or a little to get rid of noisy borders?
- __Satellite trails__ - did the stacking algorithm reject frames with trails or at least weight them relatively lower so they are minimized or gone in the result?
- __Color__  - a subjective comparison of how crisp and saturated the colors came out.

I then added the scores up and ranked them. There was no weighting, so your rank might be different. For example, if star shape is more important you could double that score when comparing to the rest. There is an interactive calculator in this blog post that computes the weighted scores based on your preferences. 

## Contenders

These are the applications that I tested.

### Astrometric Stacking Program (ASTAP)

__Website__: [https://www.hnsky.org/astap.htm](https://www.hnsky.org/astap.htm)

__Cost__: FREE!

Stacking is just one of many features in ASTAP. It is my favorite plate-solving application because it is fast, accurate, and integrates with most image stacking programs. It will also live stack. The user interface

### ASIDeepStack

__Website__: [https://download.astronomy-imaging-camera.com/download/asistudio/](https://download.astronomy-imaging-camera.com/download/asistudio/)

__Cost__: FREE!

ZWO makes several astrophotography products and is known best for its cameras. I own two: the one-shot color ASI294MC Pro and the monochrome [ASI120MM-S](https://amzn.to/3RmKNIc). ASIDeepStack is part of ASI Studio, a suite of software that works directly with ZWO products. As far as I can tell, the software is free and will work fine even if you don't use ZWO hardware. I like the simplicity of the user interface and it is a fairly fast stacking program. I use it frequently during long imagine runs to spot check progress and quality.

### AstroPixel Processor (APP)

__Website__: [https://www.astropixelprocessor.com/](https://www.astropixelprocessor.com/)

__Cost__: Approximately $175 USD

APP was my "go to" stacker. It has a fairly intuitive UI. It does a fantastic job of stacking mosaics without special preparation. It also does a good job of integrating data from different cameras and even focal lengths. In fact, I don't know of any other software that can stack and align varied data sets. The drawback is that it much slower than all but PixInsight.

### Deep Sky Stacker (DSS)

__Website__: [http://deepskystacker.free.fr/english/index.html](http://deepskystacker.free.fr/english/index.html)

__Cost__: FREE!

Spoiler alert: this app surprised me the most. I've used it in the past and was happy with the results, but never really compared it to other solutions. Its interface may seem confusing at first, but there is a _really_ nice feature called "recommended settings" that configures most of the setup for you with just a single click per item. It is also one of the fastest stackers yet still produces very clean results. I plan to use it more often base on the results of this experiment!

### PixInsight

__Website__: [https://pixinsight.com/](https://pixinsight.com/)

__Cost__: Approximately $240 USD

PixInsight is __the__ tool for astrophotography. Although the price may seem high, the value far exceeds the cost and provides a high return on investment. This app is really a suite of functions that can do everything from scale, transform, and enhance your images to stack, plate-solve, annotate and even deconvolve stars. You can perform every step of the image processing workflow from de-mosaicing/de-bayering objects to calibration and registration to stretching and post-processing. PixInsight ships with a "weighted batch processing" script that automates most of the heavy lifting in the stacking workflow. I use this quite a bit besides it being the slowest method.

## Results

This table provides the results of my experiment. You may prioritize certain factors differently. For this scale, lower is better.

<style>
    th {
        font-weight: bold;
        border-right: solid 1px gray;
    }
    tr {
        border-bottom: solid 2px lightgray;
    }
    td {
        padding: 0.3em;
        border: solid 1px gray;        
    }
</style>

Results:

|App|Duration|Speed|UI|Noise|Stars|Edges|Satellite trails|Color|Score|
|:--|--:|--:|--:|--:|:--|--:|--:|--:|--:|
|1. Deep Sky Stacker (DSS)|01:51|2|2|1|3|1|1|2|12|
|2. AstroPixel Processor (APP)|08:08|4|3|3|4|2|1|1|18|
|3. PixInsight|14:22|5|4|3|2|3|1|3|22|
|4. ASIDeepStack|01:32|1|1|5|5|4|5|4|25|
|5. Astrometric Stacking Program (ASTAP)|03:14|3|5|4|1|5|5|5|26|
                                                                              
### Duration

Length of time is important. I built a "monster" system for processing, but not everyone has that luxury and slow stacking means slow processing overall. The fastest app is ASIDeepStack at just under 2 minutes. Although PixInsight is the slowest at over 14 minutes, it was also set at the highest quality option and lower quality workflows may be faster.

### Speed

Speed is just a factor used to rank the apps based on _duration_ with 1 representing the fasts and 5 the slowest.

### User interface

This is a very subjective category. I gave ASIDeepStack first place because you literally just drop in your files and start stacking. This means there is hardly any customization available, but it's handy for doing a quick stack in the field when you want to see how an imaging session is going. PixInsight is the most difficult to learn, but also produces higher quality results.

### Noise

The signal-to-noise ratio of your data set is fixed but how the software selects and discards subframes and combines them impacts the SNR of your final result. To rank the apps with this option, I used PixInsight's built in script to determine SNR. I then ranked the apps from 1 (highest signal compared to noise) to 5 (lowest signal compared to noise.)

### Stars

Stars ranks how well-formed the stars are, not just from a size and full half width measurement, but whether halos and/or bands exist. Star quality is mostly a function of data but can be impacted by artifacts from stacking. I included images from aberration inspector to zoom in on parts of the stacked images.

### Edges

Edges rates how much of the image must be trimmed to avoid noise from areas with less signal. Some programs do a better job of "stacking to the edge" than others.

### Satellite trails

A stack is only as good as your data and ideally bad frames that are out of focus or contain satellite trails will be pulled before stacking. However, a good stacking algorithm will also reject the satellite trails as outliers. In this category I either ranked 1 for no trails or 5 if they exist.

### Color

It's normal to have to color calibrate and balance RGB channels. This category rates how well the software sticks to the colors presented by the sensor and if it does any "extras" to make life easier such as aligning channels as part of the default settings.

## Conclusion

Your mileage may vary, but the results for me both affirmed my intuition (I almost always prefer AstroPixel Processor for stacking) and surprised me. I did not think Deep Sky Stacker produced such high-quality stacks, but it does a great job for being both the fastest option and totally free. ASI is evolving their software so it now stacks video as well. It is the easiest to use and I'll keep an eye on it as they work out the kinks.

In summary:

- **Astrometric Stacking Program** is one of the fastest plate-solvers that doesn't require an Internet connection. Its stacking is solid and it provides a live-stacking feature that is useful as well, but the user interface requires a bit of a learning curve.
- **ASIDeepStack** is an easy-to-use app that can give you fast results in the field. Check out their live stacking to see results as they come in!
- **AstroPixel Processor** isn't the fastest but consistently produces quality results, especially when you are stacking multiple sessions and/or channels or producing a mosaic.
- **Deep Sky Stacker** is probably the best choice for anyone starting out. It's fast, it's free, and the results are fantastic.
- **PixInsight** remains my tool of choice for processing images and does a great job of stacking. For advanced users, it is heavily customizable and provides full control over  the process.

For reference, here's my finished "Running Man" stacked with AstroPixel Processor and finished in PixInsight.

{% include blogimage.html description="The Running Man" url="/assets/images/gallery/running-man/running-man.jpg" target=true %}
