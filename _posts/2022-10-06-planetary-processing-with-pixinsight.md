---
layout: post
title:  "Planetary processing with PixInsight (no RegiStax!)"
author: deepskyworkflows
categories: [ PixInsight, Registax ]
tags: [ moon ]
toc: true
image: assets/images/2022-10-06/planetary-processing-pixinsight.jpg
description: "If RegiStax gives you fits and crashes or you just want to stick with one tool, let me show you how I process planets and lunar surfaces with PixInsight!"
featured: true
comments: true
---

Lucky imaging is a process used to image planets and the lunar surface. You capture video or frames at a high rate, then use software like [Planetary Imaging PreProcessor](https://sites.google.com/site/astropipp/) to eliminate bad frames and center your target, then stack with [Autostakkert!](http://www.autostakkert.com/). The resulting images often need to be sharpened, which is done via wavelet processing in [RegiStax](https://www.astronomie.be/registax/). The software was last updated in 2011 and can be slow and buggy on some systems. I've moved to processing most of my results entirely in [PixInsight](https://pixinsight.com/). The only caveat is that PixInsight is paid software, so if you're looking for a free solution then RegiStax is still probably the way to go.

I also covered this topic in the video, [Planetary processing with PixInsight (and NO RegiStax)](https://youtu.be/-p_C-2Ta4xI).

{% include youtube.html code="-p_C-2Ta4xI" title="Planetary processing with PixInsight (and NO RegiStax)" %}

## Deconvolution

Deconvolution is that feature that helps make your stars round, right? Sort of. You may or may not have heard the story that the Hubble telescope had a [flaw in its primary mirror](https://www.nasa.gov/content/hubbles-mirror-flaw). The "computer image reconstruction techniques" to compensate for the flaw are rumored to be the same algorithms adopted for deconvolution. The process in modern astrophotography software is used to counter the effects of atmospheric distortion, and planetary imaging can benefit from that. There is no magic formula that I am aware of. Instead, I try different leveles of standard deviation and iterations until I find the clearest image using a preview. After that, I apply it to the image. I circled the two settings I change in the screenshot below.

{% include blogimage.html description="Deconvolution dialog" url="dialog.jpg" half=true target=true %}

The interactive image below shows the difference with different deconvolution settings. Change the iterations and standard deviation to see the results. Tap `Reset` to revert to the original image.

<section markdown="0">
{% assign url = site.baseUrl | append: "/assets/images/2022-10-06/" %}
<div id="deconvolution">
    <div id="deconStatusDiv">Loading...</div>
    <p id="deconParameters">(original image)</p>
    <div>
        <button id="reset" disabled="disabled">Reset</button>&nbsp;
        <button id="iter25" disabled="disabled">25 iterations</button>&nbsp;
        <button id="iter75" disabled="disabled">75 iterations</button>&nbsp;|&nbsp;
        <button id="std2" disabled="disabled">Std. dev. 2</button>&nbsp;
        <button id="std5" disabled="disabled">Std. dev. 5</button>&nbsp;
        <button id="std10" disabled="disabled">Std. dev. 10</button>&nbsp;
    </div>
    <img id="deconImg"/>
</div>
<img id="decon0" style="display: none;" data-src="{{ url }}preview.jpg"/>   
<img id="decon1" style="display: none;" data-src="{{ url }}preview2_25.jpg"/>
<img id="decon2" style="display: none;" data-src="{{ url }}preview5_25.jpg"/>
<img id="decon3" style="display: none;" data-src="{{ url }}preview10_25.jpg"/>   
<img id="decon4" style="display: none;" data-src="{{ url }}preview2_75.jpg"/>
<img id="decon5" style="display: none;" data-src="{{ url }}preview5_75.jpg"/>
<img id="decon6" style="display: none;" data-src="{{ url }}preview10_75.jpg"/>
<script>
setTimeout(() => {    
    const controls = {
        status: document.getElementById("deconStatusDiv"),
        params: document.getElementById("deconParameters"),
        reset: document.getElementById("reset"),
        iter25: document.getElementById("iter25"),
        iter75: document.getElementById("iter75"),
        std2: document.getElementById("std2"),
        std5: document.getElementById("std5"),
        std10: document.getElementById("std10"),
        deconImg: document.getElementById("deconImg"),
        imageArray: []
    };    
    const state = { 
        loaded: 0, 
        reset: true,
        iterations: -1,
        stdDeviation: -1,
        map: () => {
            if (state.iterations === 25) {
                return state.stdDeviation === 2 ? controls.imageArray[1] :
                (state.stdDeviation === 5  ? controls.imageArray[2] 
                : controls.imageArray[3]);
            }            
            return state.stdDeviation === 2 ? controls.imageArray[4] :
                (state.stdDeviation === 5  ?controls.imageArray[5] 
                : controls.imageArray[6]);
        },            
        increment: () => {
            if (controls.deconImg.src) {} else {
                controls.deconImg.src = controls.imageArray[0].src;
            }
            state.loaded++;
            if (state.loaded === 7) {
                state.initialized();
            }          
        },
        enable: ctrlList => {
            if (ctrlList.length) {} else {
                ctrlList = [ctrlList];
            }
            for (let idx = 0; idx < ctrlList.length; idx += 1) {
                ctrlList[idx].disabled = false;
            }
        },
        disable: ctrlList => {
            if (ctrlList.length) {} else {
                ctrlList = [ctrlList];
            }
            for (let idx = 0; idx < ctrlList.length; idx += 1) {
                ctrlList[idx].disabled = true;
            }
        },
        initialized: () => {
            controls.status.innerText = "Use the buttons to configure deconvolution.";
            controls.reset.onclick = state.reset;
            controls.iter25.onclick = _ => state.iter(25);
            controls.iter75.onclick = _ => state.iter(75);
            controls.std2.onclick = _ => state.stddev(2);
            controls.std5.onclick = _ => state.stddev(5);
            controls.std10.onclick = _ => state.stddev(10);
            state.setImage();
        },
        reset: () => {
            state.iterations = state.stdDeviation = -1;
            state.setImage();
        },
        iter: i => {
            state.iterations = i;
            if (state.stdDeviation < 0) {
                state.stdDeviation = 10;
            }
            state.setImage();
        },
        stddev: sd => {
            state.stdDeviation = sd;
            if (state.iterations < 0) {
                state.iterations = 25;
            }
            state.setImage();
        },      
        setImage: () => {
            const btnstate = { enabled: [], disabled: [] };
            if (state.iterations < 0) {
                controls.params.innerText = "(original image)";
                btnstate.disabled.push(controls.reset);
                btnstate.enabled.push(controls.iter25);
                btnstate.enabled.push(controls.iter75);
                btnstate.enabled.push(controls.std2);
                btnstate.enabled.push(controls.std5);
                btnstate.enabled.push(controls.std10);
                controls.deconImg.src = controls.imageArray[0].src;
            }
            else {
                controls.params.innerText = `Std. Dev. ${state.stdDeviation} | Iterations ${state.iterations}`;
                btnstate.enabled.push(controls.reset);
                if (state.iterations === 25) {
                    btnstate.disabled.push(controls.iter25);
                    btnstate.enabled.push(controls.iter75);
                }
                else {
                    btnstate.enabled.push(controls.iter25);
                    btnstate.disabled.push(controls.iter75);
                }
                if (state.stdDeviation === 2) {
                    btnstate.disabled.push(controls.std2);
                    btnstate.enabled.push(controls.std5);
                    btnstate.enabled.push(controls.std10);
                } else {
                    if (state.stdDeviation == 5) {
                        btnstate.enabled.push(controls.std2);
                        btnstate.disabled.push(controls.std5);
                        btnstate.enabled.push(controls.std10);
                    } else {
                        btnstate.enabled.push(controls.std2);
                        btnstate.enabled.push(controls.std5);
                        btnstate.disabled.push(controls.std10);
                    }
                }
                const newImage = state.map();
                controls.deconImg.src = newImage.src;
            }
            state.enable(btnstate.enabled);
            state.disable(btnstate.disabled);
        }
    };    
    for (let idx = 0; idx < 7; idx+= 1) {
        const layer = document.getElementById(`decon${idx}`);
        layer.onload = state.increment;
        layer.src = layer.dataset.src;
        controls.imageArray.push(layer);
    }
}, 1);
</script>

</section>

<section markdown="1">
As you can see, deconvolution provides a substantial amount of sharpening already. The next step is to target the _wavelets_ directly.

## Wavelets

What's this wavelet thing, anyway? Wavelets are a way of managing images at multiple levels of detail. Each wavelet layer represents patterns at a pixel scale. Each level represents a view of larger structures in the image. For example, layer 1 is for single pixels. Layer 2 looks at the image as blocks of 2x2 pixels, and layer 3 is 3x3 blocks or 9 pixels per unit. The last layer is always the _residual_ or `R` layer and represents everything that's left.

Wavelets are great for targeting the right scale. For example, most noise appears as errant pixels, so wavelet layer 1 is the best place to reduce noise. Stars appear across multiple pixels and structures like galaxies and nebulae have information at much higher levels. To illustrate this, look at the following image of the moon. Then, slide the slider to view various wavelets. Notice how the higher wavelets are more "blurred" and larger than the lower ones. To make each image, I used the Multiscale Linear Transformation (MLT) tool, set the number of levels to 8, and deleted all levels except the layer I  wanted to show.
</section>

<section markdown="0">
<div id="wavelethost">
    <div id="statusDiv"><label for="waveletChooser">Loading...</label></div>
    <div>
        <input disabled="disabled" id="waveletChooser" type="range" min="0" max="9" value="0" step="1"/>
        &nbsp;
        <span id="currentWavelet">0%</span>
    <div>
    <img id="waveletImg"/>
</div>
{% assign url = site.baseUrl | append: "/assets/images/2022-10-06/" %}
<img id="wavelet0" style="display: none;" data-src="{{ url }}original.jpg"/>   
<img id="wavelet1" style="display: none;" data-src="{{ url }}wavelet1.jpg"/>
<img id="wavelet2" style="display: none;" data-src="{{ url }}wavelet2.jpg"/>
<img id="wavelet3" style="display: none;" data-src="{{ url }}wavelet3.jpg"/>
<img id="wavelet4" style="display: none;" data-src="{{ url }}wavelet4.jpg"/>
<img id="wavelet5" style="display: none;" data-src="{{ url }}wavelet5.jpg"/>
<img id="wavelet6" style="display: none;" data-src="{{ url }}wavelet6.jpg"/>
<img id="wavelet7" style="display: none;" data-src="{{ url }}wavelet7.jpg"/>
<img id="wavelet8" style="display: none;" data-src="{{ url }}wavelet8.jpg"/>
<img id="wavelet9" style="display: none;" data-src="{{ url }}waveletR.jpg"/>
<script>
setTimeout(() => {    
    const controls = {
        status: document.getElementById("statusDiv"),
        waveletChooser: document.getElementById("waveletChooser"),
        currentWavelet: document.getElementById("currentWavelet"),
        waveletImg: document.getElementById("waveletImg"),
        imageArray: []
    };    
    const state = { 
        loaded: 0, 
        current: 0,
        increment: () => {
            const pct = (state.loaded + 1)*10;
            controls.currentWavelet.innerText=`${pct}%`;
            if (controls.waveletImg.src) {} else {
                controls.waveletImg.src = controls.imageArray[0].src;
            }
            state.loaded++;
            if (state.loaded === 10) {
                state.initialized();
            }          
        },
        initialized: () => {
            controls.status.innerText = "Use the slider to explore the wavelet levels.";
            controls.currentWavelet.innerText="original";
            controls.waveletChooser.oninput = state.change;
            controls.waveletChooser.removeAttribute("disabled");            
        },
        change: () => {
            const idx = parseInt(controls.waveletChooser.value);
            controls.currentWavelet.innerText = `${idx == 0 ? 'original' : `Wavelet ${idx == 9 ? 'Residual' : idx}`}`;
            controls.waveletImg.src = controls.imageArray[idx].src;
        }
    };    
    for (let idx = 0; idx < 10; idx+= 1) {
        const layer = document.getElementById(`wavelet${(idx < 10) ? idx : 'R'}`);
        layer.onload = state.increment;
        layer.src = layer.dataset.src;
        controls.imageArray.push(layer);
    }
}, 1);
</script>

<section markdown="1">

A full explanation of wavelets involves math and more knowledge than I possess, but hopefully this gives you a higher level understanding. Let's work on our lunar image.

## Multiscale Linear Transformation

Multiscale linear transformation, or MLT for short, is often introduced as a way to reduce noise in your image. A lesser known function is for sharpening of image. At each level or layer, you can manipulate a _bias_ setting from `0.001` to `15`. For all practical purposes, the bias is the level of sharpening. Because higher layers involve more pixels per unit, small changes in bias have major effects on the image. The lower layers can handle higher bias because the impact is distributed across more pixels and affects a finer set of details.

One frustration I have with RegiStax is the lack of a repeatable approach to sharpening. Everyone seems to do it their own way and has their own opinions about what works. They are capable of producing amazing images, but I struggle to learn the technique and apply it to my own. With MLT, however, I have a very precise methodology to share with you.

Maybe I'm biased from my 8-bit computer programming days, but eight layers seems to give me the right amount of control over the process. The default of 4 doesn't leave me enough room. Here's my process:

1. Create a preview over an area with intersting details
1. Open MLT
1. Reset
1. Set the layers to `8`
1. On the residual layer, set the bias to `0.001` and click preview to review the results
1. If I don't see any result, I double the bias and let the preview refresh
1. I inspect the image to make sure it's no oversaturated or clipping pixeles &mdash; when either happens, I back off on the bias level
1. As a general rule of thumb, lower layers can be sharpened more, so I always start with the next layer's bias (for example, if layer 4 is at `0.42` bias, I'll start working on layer 3 with `0.42`)
1. I generally double until I hit saturation, then back off 
1. After I have the preview in a satisfactory state, I apply MLT to the entire image

> **Tip** When you find a good set of values, consider saving the process to a process icon so you can start with those settings the next time. Every image is different and may require tweaking but having some values that worked on other images can help you get to a result faster.

Here is the preview at the start of the session:

{% include blogimage.html description="Starting MLT" url="startingmlt.jpg" target=true %}

Here the adjustment is too high and has oversaturated and clipped pixels:

{% include blogimage.html description="Too much" url="toomuch.jpg" target=true %}

And when it appears just about right:

{% include blogimage.html description="Just right" url="itworks.jpg" target=true %}

After finding the sweet spot, I apply to the whole image and move on.

## The finishing touches

Two more tools in my arsenal are `LocalHistogramTransformation` and `HDRTransformation`. As with other options, the key is to use preview and expereiment with different values until you find what works.

1. Save your work often as the new `xisf` format also embeds history
1. One trick I do is to apply a transformation, such as LHT, and the clone the image. I then undo the original image, and use PixelMath to blend the original with the clone. This gives me more control over how much is applied. For example, if I want to keep 70% of the original and 30% of new, I'll use the expression `0.7*$T+0.3*hdr` where `$T` is the target image I'm manipulating and `hdr` is the easy identifier I gave to the cloned image.
1. Another trick is to use multiple clones and blend them as described in [this excellent article](https://www.chaoticnebula.com/pixinsight-hdr-multiscale-transform/)
1. Curves can also help manipulate the image by increasing contrast.

Here is my before and after.

</section>

{% assign url = site.baseUrl | append: "/assets/images/2022-10-06/" %}
<div id="finalImg">
    <div><label id="finalStatus" for="imageChooser">Loading...</label></div>
    <div>
        Orignal&nbsp;
        <input disabled="disabled" id="imageChooser" type="range" min="0" max="1000" value="1" step="1"/>
        &nbsp;Processed        
    <div>
    <img id="finalLoader" style="display: none;" data-src="{{ url }}finalimage.jpg"/>
    <img id="originalLoader" style="display: none;" data-src="{{ url }}initialimage.jpg"/>       
</div>
<script>
setTimeout(() => {    
    const controls = {
        status: document.getElementById("finalStatus"),
        imageChooser: document.getElementById("imageChooser"),
        originalLoader: document.getElementById("originalLoader"),
        finalLoader: document.getElementById("finalLoader")
    };    
    const state = { 
        loaded: 0, 
        current: 0,
        increment: () => {
            state.loaded++;
            if (state.loaded === 2) {
                state.initialized();
            }          
        },
        initialized: () => {
            controls.status.innerText = "Use the slider to compare images.";
            controls.imageChooser.oninput = state.change;
            controls.imageChooser.removeAttribute("disabled");            
            controls.finalLoader.style.display="inline";
            controls.finalLoader.style.position="absolute";
            controls.originalLoader.style.display="inline";
            controls.originalLoader.style.display="absolute";            
            state.change();
        },
        change: () => {
            const pct = Math.floor(100-(parseInt(controls.imageChooser.value)/10));
            if (pct == 100) {
                pct = 99;
            }
            const pctDbl = pct/100.0;
            controls.originalLoader.style.opacity=pctDbl;
            controls.originalLoader.style.filter = `alpha(opacity=${pct})`;
        }
    };
    controls.originalLoader.onload = state.increment;
    controls.originalLoader.src = controls.originalLoader.dataset.src;
    controls.finalLoader.onload = state.increment;
    controls.finalLoader.src = controls.finalLoader.dataset.src;
}, 1);
</script>
<div><p>&nbsp;</p></div>

<section markdown="1">
That's all for this post! Be sure to visit my [astrophotography YouTube channel](https://youtube.com/c/DeepSkyWorkflows) and subscribe!
</section>