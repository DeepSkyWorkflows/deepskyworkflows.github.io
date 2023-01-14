---
layout: page
title: Gallery
image: "assets/images/gallery.jpg"
permalink: /gallery/
---
<h3>Random picks</h3>
{% include gallery-random.html %}
<h3>Purchase prints</h3>
<p>Visit our <a href="{{ site.galleryhome }}" target="_blank">online gallery shop</a> to browse and purchase metal, canvas, and paper prints. <a href="{{ site.galleryhome }}" target="_blank" class="btn btn-primary">🛒 Shop now</a></p>
<h3>Collections</h3>
<p>
{% for collection in site.portfolios %}
<a href="{{ site.baseurl }}/tag/{{collection | strip | replace: ' ', '-' | remove: '(' | remove: ')' | downcase }}" title="{{collection}}" alt="{{collection}}">{{collection}}</a>&nbsp;|&nbsp;
{% endfor %}
</p>
<h3 id="top">Filter and search</h3>
<a name="top"></a>
{% assign version = 10 %}
{% assign types = site.gallery | group_by: 'type' | sort: 'firstCapture' | reverse %}
{% assign telescopeArray = '' | split: ',' %}
<div class="row mw-25">
    <div class="col-12">
    <p><input type="checkbox" id="signature" alt="Show Signature series photographs only" title="Show Signature series photographs only"/>⭐ Signature series
    &nbsp;|&nbsp;
    <input type="checkbox" id="prints" alt="Show photographs with available prints only" title="Show  photographs with available prints only"/>🖼 Prints available
    &nbsp;|&nbsp;
    ✨ Starless version</p>
<p><a href="{{ site.baseurl}}/gallery/slideshow/" title="Slideshow"><i class="fa fa-film"></i> Slideshow</a>
&nbsp;|&nbsp;
<strong>Jump to Category:</strong>
{% for nestedGroup in types %}
    <a href="#{{nestedGroup.name | remove: ' '}}">{{nestedGroup.name}}</a>&nbsp;|
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
<p>
<strong><i class="fa fa-filter"></i> Filter:</strong>&nbsp;<span class="clickable" id="clearBtn"><i class="fa fa-times-circle"></i></span>&nbsp;
<input type="text" class="gallery-search form-control text-small mw-100" tabindex="0" placeholder="Start typing..." id="gallerySearch"/>
</p>
</div>
</div>
<div class="row mw-25">
    <div class="col-12">
        {% for group in types %}
        {% assign groupCode = group.name | remove: " " %}
            <div class="row">&nbsp;</div>
            <div class="row groupheader" data-group="{{groupCode}}">
                <div class="col-12">
                    <h4 id="{{groupCode}}">
                        <a name="{{groupCode}}"></a> {{group.name}} <a href="#top">🔝</a>
                    </h4>
                </div>
            </div>                
            {% assign subitems = group.items | sort : 'firstCapture' | reverse %}
            {% assign itemCount = 0 %}
            <div class="row groupdetail" data-group="{{groupCode}}">
            {% assign itemIndex = 1 %}
            {% for item in subitems %}        
            {% assign mainUrl = site.baseurl | append: item.url %}
            {% assign annotated = mainUrl | append: "#annotated" %}
            {% assign grid = mainUrl | append: "#grid" %}
            {% assign itemCount = itemCount | plus: 1 %}
            {% assign thumbPath = site.baseurl | append: "/assets/images/gallery/" | append: item.folder | append: "/thumb.jpg" %}           
            {% assign print = false %}
            {% if item.printurl %}
            {% assign print = true %}
            {% endif %}            
            {% assign loadingPath = site.baseurl | append: "/assets/images/loading.gif" %}
                <div class="card gallery-card" data-url="{{item.url}}" data-telescope="{{item.telescope}}" data-signature="{{item.signature}}" data-prints="{{print}}" data-nostars="{{item.nostars}}" data-tags="{{item.tags | join: ','}}">
                <small class="black">
                    {{item.firstCapture}}
                    {% if item.lastCapture %}
                        <span> - {{item.lastCapture}}</span>
                    {% endif %}
                </small>
                    <a href="{{mainUrl}}" title="{{item.description}}" tabindex="{{itemCount}}">
                        <img class="card-img-top gallery-img" id="image-{{itemIndex}}" data-url="{{thumbPath}}" src="{{loadingPath}}" alt="{{item.description}}">
                        {% assign itemIndex = itemIndex | plus: 1 %}
                    </a>
                    <div class="card-header bg-dark text-center">
                    {% if item.signature ==  true %}
                    <span title="Signature Series">⭐</span>
                    {% endif %}
                    {% if item.printurl %}
                    <span title="Prints available">🖼</span>
                    {% endif %}
                    {% if item.nostars ==  true %}
                    <span title="Starless version">✨</span>
                    {% endif %}
                        <a href="{{mainUrl}}" title="{{item.description}}">{{item.title}}</a>
                    </div>                
                </div>
            {% endfor %}
            </div>
        {% endfor %}    
    </div>
</div>

<script src="{{ site.baseurl }}/assets/js/gallery_filter.js"></script>