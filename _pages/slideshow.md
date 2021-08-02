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
                {% assign loading = site.baseurl | append: "/assets/images/loading.gif" %}
               <img b-class="d-block" class="card-img-top slideshow-img" src="{{loading}}" alt="Loading the slideshow" title="Loading the"/>                           
            </div>
        </div>       
    </div>
</div>

<script type="slideshow/template">
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
<!--<iframe width=500 height=570 frameBorder="0" src="https://www.dwitter.net/e/4731" allowFullScreen="true"></iframe>-->
