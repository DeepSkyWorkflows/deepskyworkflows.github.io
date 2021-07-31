---
layout: page
title: Gallery
permalink: /gallery/
---

{% assign type = "" %}

{% assign types = site.gallery | group_by: 'type' | sort: 'name' %}
<div class="row">
<div class="col-2 pr-2">
    <ul>
    {% for nestedGroup in types %}
        <li><a href="#{{nestedGroupname}}">{{nestedGroup.name}}</a></li>
    {% endfor %}
    </ul>
</div>
<div class="col-10">
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
        <div class="row">
        {% for item in subitems %}
        {% assign mainUrl = site.baseurl | append: item.url %}
        {% assign annotated = mainUrl | append: "#annotated" %}
        {% assign grid = mainUrl | append: "#grid" %}
        {% assign thumbPath = site.baseurl | append: "/assets/images/gallery/" | append: item.folder | append: "/thumb.jpg" %}
            <div class="card gallery-card">
                <a href="{{mainUrl}}" title="{{item.description}}">
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
</div>
    