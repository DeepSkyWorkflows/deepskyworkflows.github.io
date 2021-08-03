---
layout: page
title: Gallery
image: "assets/images/gallery/m31-spain/thumb.jpg"
permalink: /gallery/
---

{% assign version = 2 %}
{% assign types = site.gallery | group_by: 'type' | sort: 'name' %}
<div class="row mw-25">
    <div class="col-md-9 col-sm-6 mr-2">
        {% for group in types %}
            <div class="row">&nbsp;</div>
            <div class="row">
                <div class="col-12">
                    <h4>
                        <a name="{{group.name}}"></a> {{group.name}}
                    </h4>
                </div>
            </div>                
            {% assign subitems = group.items | sort : 'title' %}
            {% assign itemCount = 0 %}
            <div class="row">
            {% for item in subitems %}
            {% assign mainUrl = site.baseurl | append: item.url %}
            {% assign annotated = mainUrl | append: "#annotated" %}
            {% assign grid = mainUrl | append: "#grid" %}
            {% assign itemCount = itemCount | plus: 1 %}
            {% assign thumbPath = site.baseurl | append: "/assets/images/gallery/" | append: item.folder | append: "/thumb.jpg" %}
                <div class="card gallery-card" data-url="{{item.url}}">
                    <a href="{{mainUrl}}" title="{{item.description}}" tabindex="{{itemCount}}">
                        <img class="card-img-top gallery-img" src="{{thumbPath}}" alt="{{item.description}}">
                    </a>
                    <div class="card-header bg-light text-center">
                        <a href="{{mainUrl}}" title="{{item.description}}">{{item.title}}</a>
                    </div>                
                </div>
            {% endfor %}
            </div>
        {% endfor %}    
    </div>
    <div class="col-md-2 col-sm-5 pr-2">
        <a href="{{ site.baseurl}}/gallery/slideshow/" title="Slideshow"><i class="fa fa-film"></i> Slideshow</a>
        <hr/>
        <ul>
        {% for nestedGroup in types %}
            <li><a href="#{{nestedGroup.name}}">{{nestedGroup.name}}</a></li>
        {% endfor %}
        </ul>
        <p><strong><i class="fa fa-filter"></i> Filter:</strong></p>
        <input type="text" class="gallery-search form-control text-small mw-100" tabindex="0" placeholder="Start typing..." id="gallerySearch"/>
        <br/>
        <p><strong><i class="fa fa-tags"></i> Tags:</strong></p>
        <div id="tagContainer">
        </div>    
        </div>
</div>

<script src="{{ site.baseurl }}/assets/js/gallery_filter.js"></script>
    