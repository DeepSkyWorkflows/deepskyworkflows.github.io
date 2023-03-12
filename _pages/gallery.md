---
layout: page
title: Gallery
image: "assets/images/gallery.jpg"
permalink: /gallery/
---
<p>Welcome to the DeepSkyWorkflows galleries. Here, you will find images of stars, planets, galaxies, clusters, nebulae, meteors and other celestial wonders. Most of these images were captured from the deck of my home in Monroe, WA. Visit our <a href="{{ site.galleryhome }}" target="_blank">online gallery shop</a> to browse and purchase metal, canvas, and paper prints. <a href="{{ site.galleryhome }}" target="_blank">🛒 Find the perfect print for you</a>. (<strong>TIP</strong>: <i>any</i> image is available for print, so if it's not in  the online shop just <a href="https://deepskyworkflows.shootproof.com/contact" target="_blank">contact me</a> with the image title or URL for a quote).</p>
<p>If you're new to the gallery, we can browse it for you via our  <a href="{{ site.baseurl}}/gallery/slideshow/" title="Slideshow"><i class="fa fa-film"></i> Slideshow</a>.
</p>
<p><span style="cursor: pointer;" alt="Click or tap to expand" title="Click or tap to expand"><strong id="helpIcon">[+]</strong></span>&nbsp;Gallery help</p>

<div id="help" class="d-none">
    <p>Gallery items are organized by category, so you can tap on <a href="#Lunar">"Lunar"</a> to quickly jump to the lunar images. For my highest quality images, check the <a href="/gallery/?signature=true">"⭐ Signature series"</a> filter. If you're looking for photographs that are ready to print, choose <a href="/gallery/?prints=true">"🖼 Prints available"</a> or <a href="https://deepskyworkflows.shootproof.com" target="_blank">visit our print gallery</a>. The filter will search title, description, and tags. For example, you can find <a href="/gallery/sapphires/">"The Winter Sky Sapphires"</a> by searching  for <a href="/gallery/?q=m45">M45</a> even though it doesn't appear in the title or description.</p>
    <p>Most images will show four tabs. The <a href="/gallery/rosecomplete/"><strong>main tab</strong></a> shows the image and, if available, an option to view it with the stars removed. The <a href="/gallery/rosecomplete/#annotated-fs"><strong>annotated (fullsize) tab</strong></a> is enhanced with labels for deep sky objects. The <a href="/gallery/rosecomplete/#grid"><strong>grid tab</strong></a> shows the right ascension and declination grid lines. <a href="/gallery/rosecomplete/#annotated"><strong>annotated tab</strong></a> is a smaller image so the labels appear larger. If the image is available as a direct print, a button will appear that links directly to the print options.</p>
    <p>On the right side is the description of the target. When available, you can click the link to the <a href="http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx?reverseparity=False&scale=1.578823&name=rosecomplete.jpg&imageurl=https://deepskyworkflows.com/assets/images/gallery/rosecomplete/rosecomplete.jpg&credits=Jeremy+Likness+at+DeepSkyWorkflows.com&creditsUrl=&ra=98.240334&dec=5.073447&x=2223.4&y=2553.1&rotation=-151.50&thumb=https://deepskyworkflows.com/assets/images/gallery/rosecomplete/thumb.jpg" target="_blank">World Wide Telescope</a> to see the image overlaid in a web-based planetarium. This will give you an idea of where in the sky it was taken.</p>
    <p>In addition to facts about the image, you will also find links to related images (it's fun for me to see how different the same target may look based on the equipment, field of view, and my skills when I processed it). "Objects in frame" includes detected deep sky objects. Clicking on these will take you into our <a href="/tags"><strong>tags network</strong></a> that interlinks all of the images, videos, and blog posts on the site. If you have any questions or need further help, please <a href="https://deepskyworkflows.shootproof.com/contact" target="_blank">contact me</a>.</p>
</div>

<h3>Random picks</h3>
{% include gallery-random.html %}
<h3 id="top">Filter and search</h3>
<a name="top"></a>
<p>
{% for collection in site.portfolios %}
<a href="{{ site.baseurl }}/tag/{{collection | strip | replace: ' ', '-' | remove: '(' | remove: ')' | downcase }}" title="{{collection}}" alt="{{collection}}">{{collection}}</a>&nbsp;|&nbsp;
{% endfor %}
</p>
{% assign version = 10 %}
{% assign types = site.gallery | group_by: 'type' | sort: 'lastCapture' | reverse %}
{% assign telescopeArray = '' | split: ',' %}
<div class="row mw-25">
    <div class="col-12">
    <p><input type="checkbox" id="signature" alt="Show Signature series photographs only" title="Show Signature series photographs only"/>⭐ Signature series
    &nbsp;|&nbsp;
    <input type="checkbox" id="prints" alt="Show photographs with available prints only" title="Show  photographs with available prints only"/>🖼 Prints available
    &nbsp;|&nbsp;
    ✨ Starless version</p>
<p><strong>Jump to Category:</strong>
{% assign cats = types | sort: 'name' %}
{% for nestedGroup in cats %}
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
        {% for group in cats %}
        {% assign groupCode = group.name | remove: " " %}
            <div class="row">&nbsp;</div>
            <div class="row groupheader" data-group="{{groupCode}}">
                <div class="col-12">
                    <h4 id="{{groupCode}}">
                        <a name="{{groupCode}}"></a> {{group.name}} <a href="#top">🔝</a>
                    </h4>
                </div>
            </div>                
            {% assign subitems = group.items | sort : 'lastCapture' | reverse %}
            {% assign itemCount = 0 %}
            <div class="row groupdetail" data-group="{{groupCode}}">
            {% assign itemIndex = 1 %}
            {% for item in subitems %}        
            {% if item.archive == true %}
            {% else %}
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
                    {% if item.lastCapture == item.firstCapture %}
                    {% else %}
                        {% if item.lastCapture %}
                        <span> - {{item.lastCapture}}</span>
                        {% endif %}
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
            {% endif %}            
            {% endfor %}
            </div>
        {% endfor %}    
    </div>
</div>

<script src="{{ site.baseurl }}/assets/js/gallery_filter.js"></script>