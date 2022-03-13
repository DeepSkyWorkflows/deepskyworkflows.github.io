---
layout: page
title: Gallery
image: "assets/images/gallery.jpg"
permalink: /gallery/
---
 
{% assign version = 10 %}
{% assign types = site.gallery | group_by: 'type' | sort: 'name' %}
{% assign telescopeArray = '' | split: ',' %}
<div class="row mw-25">
    <div class="col-12">
<p><a href="{{ site.baseurl}}/gallery/slideshow/" title="Slideshow"><i class="fa fa-film"></i> Slideshow</a>
&nbsp;|&nbsp;
<strong>Jump to Category:</strong>
{% for nestedGroup in types %}
    <a href="#{{nestedGroup.name}}">{{nestedGroup.name}}</a>&nbsp;|
    {% for item in nestedGroup.items %}
    {% assign telescopeArray = telescopeArray | push: item.telescope %}
    {% endfor %}
{% endfor %}
{% assign uniqueScopes = telescopeArray | uniq | sort %}
</p>
<p><strong>Filter by telescope:</strong>{% for scope in uniqueScopes %}
 <button class="btn btn-sm btn-link telescopeFilter">{{scope}}</button>&nbsp;|
{%endfor%}
</p>
<p><a name="top"></a>
<strong><i class="fa fa-filter"></i> Filter:</strong>&nbsp;<span class="clickable" id="clearBtn"><i class="fa fa-times-circle"></i></span>&nbsp;
<input type="text" class="gallery-search form-control text-small mw-100" tabindex="0" placeholder="Start typing..." id="gallerySearch"/>
</p>
</div>
</div>
<div class="row mw-25">
    <div class="col-12">
        {% for group in types %}
            <div class="row">&nbsp;</div>
            <div class="row">
                <div class="col-12">
                    <h4>
                        <a name="{{group.name}}"></a> {{group.name}} <a href="#top">🔝</a>
                    </h4>
                </div>
            </div>                
            {% assign subitems = group.items | sort : 'title' %}
            {% assign itemCount = 0 %}
            <div class="row">
            {% assign itemIndex = 1 %}
            {% for item in subitems %}        
            {% assign mainUrl = site.baseurl | append: item.url %}
            {% assign annotated = mainUrl | append: "#annotated" %}
            {% assign grid = mainUrl | append: "#grid" %}
            {% assign itemCount = itemCount | plus: 1 %}
            {% assign thumbPath = site.baseurl | append: "/assets/images/gallery/" | append: item.folder | append: "/thumb.jpg" %}
                <div class="card gallery-card" data-url="{{item.url}}" data-telescope="{{item.telescope}}">
                    <a href="{{mainUrl}}" title="{{item.description}}" tabindex="{{itemCount}}">
                        <img class="card-img-top gallery-img" id="image-{{itemIndex}}" src="{{thumbPath}}" alt="{{item.description}}">
                        {% assign itemIndex = itemIndex | plus: 1 %}
                    </a>
                    <div class="card-header bg-dark text-center">
                        <a href="{{mainUrl}}" title="{{item.description}}">{{item.title}}</a>
                    </div>                
                </div>
            {% endfor %}
            </div>
        {% endfor %}    
    </div>
</div>

<script src="{{ site.baseurl }}/assets/js/gallery_filter.js"></script>
    