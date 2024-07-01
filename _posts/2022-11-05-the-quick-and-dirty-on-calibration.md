---
layout: post
title:  "A Quick (Bias-ed) and Dirty Look at Calibration"
author: deepskyworkflows
categories: [ Learning ]
tags: [ sh2-206 ]
toc: true
image: assets/images/2022-11-05/quick-and-dirty-calibration.jpg
description: "A very fast and high-level overview of what calibration frames are in astrophotography, why you care, and how you can get started. Includes a hands-on example with real photographs to show differences."
featured: false
comments: true
---
There are a lot of sites with videos, articles, and blogs that explain calibration frames in detail and provide instructions about "what goes where." If you want to know the exact science behind calibration frames and fascinating in-depth discussions about electrons and well-depth, you should definitely not waste time reading this post. Those things are important, but many of you just want to take pictures and get results. I hope this gives you enough to understand what you need to get started without getting lost in the details.

If you're more of a video person, check out [Calibration explained in less than 4 minutes](https://youtu.be/a7mAYRouGbU). It's actually great if you have 4 minutes.

{% include youtube.html code="a7mAYRouGbU" title="Calibration explained in less than 4 minutes" %}

Let's get right to it. Here's _how_ I take calibration frames. Trust me, it's helpful to know when we go into the _why_. Last night, I took 30 1-minute pictures of the Orion constellation. This is what a single frame looks like:

{% include blogimage.html description="Single frame" url="raworion.jpg" half=true target=true %}

After I took the pictures, I came inside and pulled up an app on my phone that just makes the entire screen turn white. I dimmed my phone a little bit, then set it so my camera lens was pointed squarely at the phone. I kept the same ISO settings as my raw photos and took a few pictures with different exposures until I verified my histogram level was between 50% - 75%. It turned out to be 1/3rd of a second for this round. I then shot 20 pictures of just the phone screen. I took 20 more pictures with the lens cap on at the same ISO and exposure as the previous set. After that, I set my shutter speed to the fastest possible (1/4000th second for my camera) and, with the cap still on, took 60 more photos. Finally, I used a device called an [intervalometer](https://amzn.to/3fDdDGh) designed for my camera and took 30 more pictures at 60 seconds. Using the combination of the 30 photos and these "calibration frames", here is what I was able to create.

{% include blogimage.html description="Final image" url="/assets/images/gallery/orion-50mm/orion-50mm.jpg" half=true target=true %}

## Why you should take calibration frames

Simply put, cameras and their sensors are messy. You might pride yourself in keeping lens wipes handy, but what happens when you get dust inside your lens? The sensor itself is subject to random noise that creates fuzzy patterns and speckles of color that don't belong. Calibration frames are special images you take to isolate things like dust, vignetting (the round "circle of light" or dark effect like what I showed in my original Orion image), smudges, and sensor noise. Image processing software understands how to use these frames to compensate and produce a less noisy, dust-free image. Some cameras are great and don't require much in the way of calibration, but most will benefit to some extent. The trick is know which calibration to take and how to take them.

## What calibration frames to take

There are four common types of calibration frames: _bias_, _dark_, _flat_, and _dark flat_. Let's tackle these one-by-one.

### Bias

**Bias** frames are taken with no light on the sensor using the fastest possible exposure time. The temperature and ISO or gain setting should match that of your main images. If you used multiple ISOs, you should take multiple bias frames. Every sensor has built-in defects that can be captured with bias frames. A perfect sensor would create a completely black image in the absence of light. But sensors aren't perfect, so here's what their bias looks like:

{% include blogimage.html description="Bias" url="bias.jpg" half=true target=true %}

### Dark

**Dark** frames are taken with no light on the sensor using the same exposure time, temperature, and ISO or gain that you used for your main images. The same way a long exposure collects more light to capture the faint details of nebulae, it also picks up noise from current in your sensor. In addition, some pixels are defective and can appear darker ("cold pixels") or brighter ("hot pixels") than neighboring pixels. Darks isolate these pixels so they can be brightened or darkened during processing to match the rest of the image. Finally, some cameras leak light and produce what is called "amp glow." In the following dark, can you spot the three areas of amp glow and see just how many "hot" red, green, and blue pixels there are in the magnified inset? 

{% include blogimage.html description="Dark" url="dark.jpg" half=true target=true %}

### Flat

**Flat** frames are taken with a diffuse, uninform (evenly illuminated) light source. A common practice is to point the scope skyward in the early morning and cover the lens with white paper or a t-shirt. The ISO will match your target image but the exposure time will vary. You need to set the exposure so that your histogram readout is between 50-75%. This ensures you pick up artifacts the lens like dust and smudges without oversaturating them. This image saves my pictures but also reminds me to clean my image train.

{% include blogimage.html description="Flat" url="flat.jpg" half=true target=true %}

### Dark flat

**Dark flat** frames are usually taken when you, for whatever reason, don't have or take bias frames. They are _darks_ taken specifically for flats. These are easy to do because you simply repeat the exact same sequence of photographs you took for flats, only this time with the lens cap on.

## See for yourself 

It's all good to _talk_ about calibration, but what does it _look_ like? In this interactive photo, you can toggle flats and darks to see what the difference looks like.

<section markdown="0">
{% assign url = site.baseUrl | append: "/assets/images/2022-11-05/" %}
<div class="container container-fluid">
    <div class="row">
        <div class="col-12">
            <button class="btn btn-primary m-2" id="darkToggle"/>
            &nbsp;
            <button class="btn btn-primary m-2" id="flatToggle"/>
            &nbsp;
            <button id="state" class="btn btn-success" disabled=true>Initializing...</button>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <img id="noneImg" src="{{ url }}nocalibration.jpg" alt="An uncalibrated photograph."/>
            <img id="flatsImg" data-imgurl="{{ url }}flatsonly.jpg" alt="Calibrated with flats."/>
            <img id="darksImg" data-imgurl="{{ url }}darksonly.jpg" alt="Calibrated with darks and bias."/>
            <img id="allImg" data-imgurl="{{ url }}full.jpg" alt="Fully calibrated."/>
        </div>
    </div>
</div>
<style>
    img.d-none {
        display: none;
    }
    p#state {
        color: white;
    }
</style>
<script>
setTimeout(() => {
    const app = {
        none: $("#noneImg"),
        flat: $("#flatsImg"),
        dark: $("#darksImg"),
        all: $("#allImg"),
        btnDark: $("#darkToggle"),
        btnFlat: $("#flatToggle"),
        state: $("#state"),
        images: () => [app.none, app.flat, app.dark, app.all],
        imgs: [],
        states: ["Uncalibrated", "Flats applied", "Darks applied", "Fully calibrated"],
        classes: ["danger", "warning", "warning", "success"],
        curImg: {},
        darkToggle: false,
        lightToggle: false,
        switch: 0x0,
        set: (flat, dark) => {
            app.switch = (flat === true ? 0x01 : 0x0)
                + (dark === true ? 0x02 : 0x0);
            console.log(app.switch);
            app.darkToggle = dark;
            app.lightToggle = flat;
            $(app.btnDark).text(app.darkToggle === true ? "Deactivate darks" : "Activate darks");
            $(app.btnFlat).text(app.lightToggle === true ? "Deactivate flats" : "Activate flats");
            $(app.curImg).addClass("d-none");
            app.curImg = app.imgs[app.switch];
            $(app.curImg).removeClass("d-none");
            $(app.state).attr("class", `btn btn-${app.classes[app.switch]}`);
            $(app.state).text(app.states[app.switch]);
        }
    };
    app.imgs = app.images();
    app.curImg = app.imgs[0];
    for (let i = 1; i < app.imgs.length; i++) {
        (function (idx) {
            $(app.imgs[idx]).on("load", () => {
                $(app.imgs[idx]).addClass("d-none");
            });
        })(i);
        $(app.imgs[i]).attr("src", $(app.imgs[i]).data("imgurl"));
    }
    $(app.btnDark).on("click", () => app.set(app.lightToggle, !app.darkToggle));
    $(app.btnFlat).on("click", () => app.set(!app.lightToggle, app.darkToggle));
    app.set(false, false);
});
</script>

</section>

<section markdown="1">
## How to take calibration frames
Now you know what they are. How do you take them? I created a table to help know when and how.

</section>

<section markdown="0">
<div class="container container-fluid p-2">
<div class="row">
    <div class="col-2">
        <strong>Type</strong>
    </div>
    <div class="col-1">
        <strong>Per session?&nbsp;</strong>
    </div>
    <div class="col-1">
        <strong>Temp?&nbsp;</strong>
    </div>
    <div class="col-1">
        <strong>ISO/Gain?&nbsp;</strong>
    </div>
    <div class="col-1">
        <strong>Exposure?&nbsp;</strong>
    </div>
    <div class="col-1">
        <strong>Filter?&nbsp;</strong>
    </div>
    <div class="col-1">
        <strong>Quantity&nbsp;</strong>
    </div>
    <div class="col-1">
        <strong>Technique&nbsp;</strong>
    </div>
</div>
<div class="row">
    <div class="col-2">Bias</div>
    <div class="col-1">NO</div>
    <div class="col-1">YES</div>
    <div class="col-1">YES</div>
    <div class="col-1">NO</div>
    <div class="col-1">NO</div>
    <div class="col-1">60 - 80</div>
    <div class="col-1">Dark technique</div>
</div>
<div class="row">
    <div class="col-2">Dark</div>
    <div class="col-1">NO</div>
    <div class="col-1">YES</div>
    <div class="col-1">YES</div>
    <div class="col-1">YES</div>
    <div class="col-1">NO</div>
    <div class="col-1">20 - 60</div>
    <div class="col-1">Dark technique</div>
</div>
<div class="row">
    <div class="col-2">Flat</div>
    <div class="col-1">YES</div>
    <div class="col-1">NO</div>
    <div class="col-1">YES</div>
    <div class="col-1">YES</div>
    <div class="col-1">YES</div>
    <div class="col-1">20 - 60</div>
    <div class="col-1">Flat technique</div>
</div>
<div class="row">
    <div class="col-2">Dark flat</div>
    <div class="col-1">YES</div>
    <div class="col-1">NO</div>
    <div class="col-1">YES</div>
    <div class="col-1">YES (same as Flat)</div>
    <div class="col-1">YES</div>
    <div class="col-1">(same as Flat)</div>
    <div class="col-1">Dark technique</div>
</div>
</div>

</section>

<section markdown="1">
- **Dark technique** is to cover the lens with the lens cap. Preferably run at night so no light leaks in, otherwise consider covering your scope or putting it somewhere dark like a closed closet.
- **Flat technique** is to take a picture of a uniform, white light source and adjust your exposure until the histogram reading is between 50 - 75% analog digital units (ADUs). You can use the sky, a white t-shirt and paper, or a flat panel. I use an app on my smartphone that turns the LED display white for smaller lenses. For larger lenses, I use an adjustable LED tracing pad. I point the telescope straight up and set the tracing pad on top, illuminated side facing the telescope.

> **TIP** Considering using SharpCap's [Capture Flat Frame](http://docs.sharpcap.co.uk/3.2/26_CapturingandUsingFlatFrames.htm) feature or N.I.N.A's [Flat Wizard](https://nighttime-imaging.eu/docs/master/site/tabs/flatwizard/) to make things easier. 

Imagine I have a session where I image with no filter using 60 second exposures at a gain of 200. I then switch to a narrowband filter and do the same exposure and gain. After awhile I decide the filter requires a longer exposure, so I take some 120 second exposures. I find it's a bit noisy, so I drop the gain to 120. 

In this session, I had four groups:

- **Group 1** RGB 60s 200
- **Group 2** NB 60s 200
- **Group 3** NB 120s 200
- **Group 4** NB 120s 120

Assuming everything was at the same temperature, my calibration frames would then look something like this:

- Bias 1/4000th second ISO 200 - usable for Groups 1 through 3
- Bias 1/4000th second ISO 120 - usable for Group 2
- Dark 60s ISO 200 - usable for Groups 1 and 2
- Dark 120s ISO 200 - usable for Group 3
- Dark 120s ISO 120 - usable for Group 4
- Flat RGB 0.3s ISO 200 - usable for Group 1
- Flat NB 0.6s ISO 200 - usable for Groups 2 and 3
- Flat NB 0.7s ISO 120 - usable for Group 4
- Dark flat RGB 0.3s ISO 200 - usable for Group 1
- Dark flat NB 0.6s ISO 200 - usable for Groups 2 and 3
- Dark flat NB 0.7s ISO 120 - usable for Group 4

## Conclusion

Take calibration frames. Most software knows how to use it and your pictures will benefit. When your software creates a "master" dark or bias, save it with a filename like "Master-Bias-ISO-200" or "Master-Dark-180s-ISO-200". That way you can reuse it when you shoot at the same exposure and ISO or gain. Finally, unless you have a cooled camera, having a sudden temperature rise or drop is a good reason to take a new set of calibrations.

Wishing you clear skies!
