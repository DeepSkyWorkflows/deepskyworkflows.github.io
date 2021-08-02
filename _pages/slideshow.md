---
layout: slideshow
title: Slideshow
permalink: /gallery/slideshow/
---

<div id="astroshow" class="carousel slide bg-dark" data-ride="carousel">        
    <div class="carousel-inner gallery-carousel">
    {% assign first = true %}
    {% assign active = "active" %}
    {% for image in site.gallery %}
        {% assign imgPath = site.baseurl | append: "/assets/images/gallery/" | append: image.folder | append: "/" | append: image.folder | append: ".jpg" %}            
        {% assign mainUrl = site.baseurl | append: image.url %}                    
        <div class="carousel-item {{ active }} bg-dark"> 
            <div class="card">
                <a href="{{mainUrl}}" title="{{image.description}}" class="stretch-link">
                    <img b-class="d-block w-25" class="card-img-top" src="{{imgPath}}" alt="{{image.description}}" title="{{image.description}}"/>
                </a>
                <div class="card-img-overlay text-center white">
                    <h4 class="card-title">{{image.title}}</h4>
                    <p class="card-text">{{image.description}}</p>
                </div>
            </div>
        </div>
        {% if first == true %}
            {% assign first = false %}
            {% assign active = "" %}
        {% endif %}
    {% endfor %}        
    </div>
</div>