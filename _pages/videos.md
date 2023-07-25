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
<div class="flexible">    
        {% for group in types %}
            <div class="group-header" data-group="{{group.name}}">
                <h4>
                    <a name="{{group.name}}"></a> {{group.name}} <a href="#top">🔝</a>
                </h4>            
            </div>                
            {% assign subitems = group.items | sort : 'date' | reverse %}
            {% assign itemCount = 0 %}            
            {% assign itemIndex = 1 %}
            {% for item in subitems %}        
            {% assign mainUrl = site.baseurl | append: item.url %}
            {% assign thumbPath = site.baseurl | append: "/" | append: item.image %}           
                <div class="gallery-card group-detail" data-url="{{item.url}}">
                        <img class="gallery-img" id="image-{{itemIndex}}" src="{{thumbPath}}" title="{{item.description}}" alt="{{item.description}}">
                        <small><strong class="video-title">{{item.title}}</strong></small>                        
                        {% assign itemIndex = itemIndex | plus: 1 %}
                    <div class="card-img-overlay card-header bg-dark text-center">
                        <a href="{{mainUrl}}" title="{{item.description}}" tabindex="{{itemCount}}">
                           Learn more
                        </a>&nbsp;|&nbsp;<a href="https://youtu.be/{{item.youtubeid}}" target="_blank"  title="Play on YouTube">Watch on YouTube</a><br/>
                        <small>{{ item.date | date_to_string }}</small><br/>                        
                    </div>                
                </div>
            {% endfor %}     
        {% endfor %}        
</div>