---
layout: page
title: Videos
image: "assets/images/gallery.jpg"
permalink: /videos/
---
{% assign version = 1 %}
{% assign types = site.videos | group_by: 'type' | sort: 'name' %}
<p>
    <strong>Jump to Category:</strong>
{% for nestedGroup in types %}
    <a href="#{{nestedGroup.name}}">{{nestedGroup.name}}</a>&nbsp;|
{% endfor %}
</p>
<p><a href="https://youtube.com/c/deepskyworkflows" title="Astrophotography videos" alt="Astrophotography videos" class="btn btn-success" target="_blank"><i class="fab fa-youtube"></i>&nbsp;Visit our YouTube channel to subscribe</a>&nbsp;
<p><a name="top"></a></p>
<div class="row mw-25">
    <div class="col-12">
        {% for group in types %}
            <div class="row">&nbsp;</div>
            <div class="row groupheader" data-group="{{group.name}}">
                <div class="col-12">
                    <h4>
                        <a name="{{group.name}}"></a> {{group.name}} <a href="#top">🔝</a>
                    </h4>
                </div>
            </div>                
            {% assign subitems = group.items | sort : 'date' | reverse %}
            {% assign itemCount = 0 %}
            <div class="row groupdetail" data-group="{{group.name}}">
            {% assign itemIndex = 1 %}
            {% for item in subitems %}        
            {% assign mainUrl = site.baseurl | append: item.url %}
            {% assign thumbPath = site.baseurl | append: "/" | append: item.image %}           
                <div class="card gallery-card" data-url="{{item.url}}">
                    <a href="{{mainUrl}}" title="{{item.description}}" tabindex="{{itemCount}}">
                        <img class="card-img-top gallery-img" id="image-{{itemIndex}}" src="{{thumbPath}}" title="{{item.description}}" alt="{{item.description}}">
                        {% assign itemIndex = itemIndex | plus: 1 %}
                    </a>
                    <div class="card-header bg-dark text-center">
                        <small>{{ item.date | date_to_string }}</small><br/>
                        <a href="{{mainUrl}}" title="{{item.description}}">{{item.title}}</a>
                    </div>                
                </div>
            {% endfor %}
            </div>
        {% endfor %}    
    </div>
</div>