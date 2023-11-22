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
<p><a href="https://youtube.com/c/deepskyworkflows" title="Astrophotography videos" alt="Astrophotography videos" class="btn btn-sm w-auto btn-success" target="_blank"><i class="fab fa-youtube"></i>&nbsp;Visit our YouTube channel to subscribe</a>&nbsp;
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
        <div class="card-deck">
            {% for item in subitems %}        
            {% assign mainUrl = site.baseurl | append: item.url %}
            {% assign thumbPath = site.baseurl | append: "/" | append: item.image %}                       
                <div class="card gallery-card-v2 text-white bg-dark mb-1 p-1">
                    <a href="{{mainUrl}}" alt="{{item.description}}">
                        <img id="image-{{itemIndex}}" class="card-img clickable" src="{{thumbPath}}" alt="{{item.description}}"/>
                    </a>
                    <div class="card-body">
                        <p class="mb-2px card-text-override">
                            <a class="card-title" href="{{mainUrl}}" alt="{{item.description}}"><strong>{{item.title}}</strong></a>
                        </p>
                    {% assign itemIndex = itemIndex | plus: 1 %}
                        <p class="card-text card-text-override mb-2px">
                            <i class="fas fa-link"></i><a href="https://youtu.be/{{item.youtubeid}}" target="_blank">YouTube</a>
                        </p>
                        <p class="card-text card-text-override">{{item.description}}</p>        
                        <p class="card-text card-text-override text-right mb-2px"><small>{{ item.date | date_to_string }}</small></p>        
                    </div>    
                </div>                        
            {% endfor %}     
        </div>
    {% endfor %}        
</div>