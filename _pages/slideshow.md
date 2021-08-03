---
layout: slideshow
title: Slideshow
permalink: /gallery/slideshow/
---

<div class="text-right d-none" id="carouselcontrols">
        <button class="btn btn-link" id="btnPause">⏸</button>
    </div>        
    
<div id="astroshow" class="carousel slide slideshow-carousel" data-ride="carousel">
    <div id="astroturf" class="carousel-inner">
         <div class="carousel-item active"> 
            <div class="card slideshow-card">
            <div class="card-header text-center">
                <strong id="astroheader" class="card-title slideshow-title">Initializing slideshow...</strong>
                </div> 
                <canvas id="dwitter" width="1920" height="1080"></canvas>                           
            </div>
        </div>       
    </div>
    <button class="btn btn-link carousel-control-prev d-none" href="#carouselExampleControls" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
    </button>
    <button class="btn btn-link carousel-control-next d-none" href="#carouselExampleControls" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
    </button>
</div>

<script id="astrodeck" type="slideshow/template">
{% for image in site.gallery %}
    {% assign imgPath = site.baseurl | append: "/assets/images/gallery/" | append: image.folder | append: "/" | append: image.folder | append: ".jpg" %}            
    {% assign mainUrl = site.baseurl | append: image.url %}                    
    <div class="carousel-item"> 
        <div class="card slideshow-card">
            <div class="card-header text-center">
                <strong class="card-title slideshow-title">{{image.title}}</strong>
            </div>
            <a href="{{mainUrl}}" title="{{image.description}}" class="stretch-link">
                <img b-class="d-block" class="card-img-top slideshow-img" data-src="{{imgPath}}" alt="{{image.description}}" title="{{image.description}}"/>
            </a>
            <div class="carousel-caption d-none d-md-block">
                <p>{{image.description}}</p>
            </div>                
        </div>
    </div>    
{% endfor %} 
</script>
<script type="text/javascript" src="{{ site.baseurl }}/assets/js/slideshow.js"></script>
