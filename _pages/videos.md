---
layout: page
title: Videos
image: "assets/images/gallery.jpg"
permalink: /videos/
depends: 
    - videos.css
---
{% assign version = 1 %}
{% assign types = site.videos | group_by: 'type' | sort: 'name' %}
<p class="categoryJump">
    <strong>Jump to Category:</strong>
    {% for nestedGroup in types %}
        <a href="#{{nestedGroup.name}}">{{nestedGroup.name}}</a>&nbsp;|
    {% endfor %}
</p>
{%- include youtube_subscribe.html -%}
<div class="videos"> 
    <div class="group-header" data-group="latestvideos">
        <h3>
            <a name="latestvideos"></a> Latest videos 
        </h3>
    </div>
    {% assign latest = site.videos | sort: 'date' | reverse %}
    {% assign latestidx = 1 %}
    <div class="video-results">
    {% for vid in latest %}
            {% assign mainUrl = site.baseurl | append: vid.url %}
            {% assign thumbPath = site.baseurl | append: "/" | append: vid.image %}                           
            {% if latestidx < 6 %}
                <div class="video">
                    <a href="{{mainUrl}}" alt="{{vid.description}}">
                        <img id="image-latest-{{latestidx}}" src="{{thumbPath}}" alt="{{vid.description}}"/>
                    </a>
                    <a href="{{mainUrl}}" alt="{{vid.description}}"><strong>{{vid.title}}</strong></a>                    
                    {% assign latestidx = latestidx | plus: 1 %}
                    <p>
                        <i class="fa fa-youtube"></i> <a href="https://youtu.be/{{vid.youtubeid}}" target="_blank">View on YouTube</a>
                    </p>
                    <p>{{vid.description}}</p>        
                    <small>{{ vid.date | date_to_string }}</small>
                </div>                    
            {% endif %}
    {% endfor %}
    </div>
    <small><a href="#dsw-top"><i class="fa fa-arrow-up"></i> Back to top</a></small>
    {% for group in types %}
        <div class="group-header" data-group="{{group.name}}">
            <h3>
                <a name="{{group.name}}"></a> {{group.name}} 
            </h3>            
        </div>                
        {% assign subitems = group.items | sort : 'date' | reverse %}
        {% assign itemCount = 0 %}            
        {% assign itemIndex = 1 %}
        <div class="video-results">
            {% for item in subitems %}        
            {% assign mainUrl = site.baseurl | append: item.url %}
            {% assign thumbPath = site.baseurl | append: "/" | append: item.image %}                       
                <div class="video">
                    <a href="{{mainUrl}}" alt="{{item.description}}">
                        <img id="image-{{itemIndex}}" src="{{thumbPath}}" alt="{{item.description}}"/>
                    </a>
                    <a href="{{mainUrl}}" alt="{{item.description}}"><strong>{{item.title}}</strong></a>                        
                    {% assign itemIndex = itemIndex | plus: 1 %}
                    <p><i class="fa fa-youtube"></i> <a href="https://youtu.be/{{item.youtubeid}}" target="_blank">View on YouTube</a></p>
                    <p>{{item.description}}</p>        
                    <small>{{ item.date | date_to_string }}</small>
                </div>                        
            {% endfor %}     
        </div>
        <small><a href="#dsw-top"><i class="fa fa-arrow-up"></i> Back to top</a></small>
    {% endfor %}        
</div>