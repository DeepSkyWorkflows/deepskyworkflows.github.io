---
layout: slideshow
title: Slideshow
permalink: /gallery/slideshow/
---

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
</div>

<script id="astrodeck" type="slideshow/template">
{% assign first = true %}
    {% assign active = "active" %}
    {% for image in site.gallery %}
        {% assign imgPath = site.baseurl | append: "/assets/images/gallery/" | append: image.folder | append: "/" | append: image.folder | append: ".jpg" %}            
        {% assign mainUrl = site.baseurl | append: image.url %}                    
        <div class="carousel-item {{ active }}"> 
            <div class="card slideshow-card">
            <div class="card-header text-center">
                <strong class="card-title slideshow-title">{{image.title}}</strong>
                </div>
                <a href="{{mainUrl}}" title="{{image.description}}" class="stretch-link">
                    <img b-class="d-block" class="card-img-top slideshow-img" src="{{imgPath}}" alt="{{image.description}}" title="{{image.description}}"/>
                </a>                
            </div>
        </div>
        {% if first == true %}
            {% assign first = false %}
            {% assign active = "" %}
        {% endif %}
    {% endfor %} 
</script>
<script type="text/javascript" src="{{ site.baseurl }}/assets/js/slideshow.js"></script>
