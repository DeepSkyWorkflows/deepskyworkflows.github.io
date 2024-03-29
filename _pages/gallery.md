---
layout: page
title: Gallery
image: "assets/images/gallery.jpg"
permalink: /gallery/
---
<div><button id="lucky" class="btn btn-sm btn-primary m-1" title="View a random picture from the gallery.">I feel lucky</button> Take me to a random item in the gallery.&nbsp;<span id="filterShare"></span></div>
<div><strong>Special collections:</strong>
{% for collection in site.portfolios %}
<a class="badge badge-info w-auto" href="{{ site.baseurl }}/tag/{{collection | strip | replace: ' ', '-' | remove: '(' | remove: ')' | downcase }}" title="{{collection}}" alt="{{collection}}">{{collection}}</a>
{% endfor %}
</div>
<p>Use the filters to narrow your search. <strong>Signature</strong> images are my self-selected favorites. <strong>Print-ready</strong> images can be ordered online. If you are interested in an image that is not print-ready, <a href="{{site.galleryhome}}/contact" target="_blank">send us the link</a> and we'll set it up. In addition to astrophotography I have galleries with pictures of Mt. Rainier, the Pacific Ocean, and more. Browse my <a href="https://dswgalleries.com/galleries" target="_blank">online galleries of astrophotography and Oregon coast landscape photography</a>.
<div id="galleryMain">
    <a name="top"/>
    <div id="filters">
        <div id="status"></div>
        <div id="filterExpand" class="clickable">[+] Show filters and sort</div>
        <div id="filterExpanded" >            
            <div>
                <span id="filterCollapse" class="clickable">[-]</span>
                <span><button id="reset" class="btn btn-link btn-warning">Reset</button></span>
                <span><input id="simplify" type="checkbox" title="Check to simplify the results and just show images."/> Simplify</span>
                <span><input type="checkbox" id="signature" title="Check to filter signature series"/> Signature</span>
                <span><input type="checkbox" id="print" title="Check to filter print-ready items"/> Print-ready</span>
                <span><input type="checkbox" id="archive" title="Click to view archived images"/> Archived</span>&nbsp;|&nbsp;
                <span><label for="text" class="mr-1">Search text:</label><input id="text" type="text" placeholder="Enter text to search for"/></span>                
            </div>
            <div>
                <span><label for="sortBy" class="mr-1">Sort by:</label><select id="sortBy" title="weighted is a score computed from the details in the profile and attributes like signature, firstCapture and lastCapture refer to the dates that images were acquired (multiple dates means multiple days of data were used), date is a simplified date sort that coalesces the date range, and title refers to the name of the piece"></select></span>
                <span><button title="Click to toggle sort direction" class="btn btn-link" id="sortDir">Desc</button></span>                
                <span><label for="telescope" class="mr-1">Telescope:</label><select id="telescope"></select></span>
            </div>
            <div id="categoryButtons"></div>
        </div>
        <div id="filterRefresh" class="alert alert-info">Applying filter and refreshing gallery... <img src="/assets/images/loading.gif" alt="Loading..."/></div>
    </div>
    <div class="card-deck">        
        <div class="alert alert-info">Initializing...</div>        
    </div>    
</div>
<div class="footer"><p xmlns:cc="http://creativecommons.org/ns#" >This work is licensed under <a href="http://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution-NonCommercial-NoDerivatives 4.0 International<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1"></a></p>
<p>If you wish to use the work for commercial purposes, <a href="{{ site.galleryhome }}/contact" alt="Send me a message directly." title="Send me a message directly.">contact me</a> with the details.</p>
</div>

<script id="basePrintUrl" type="text/template">{{site.galleryhome}}</script>

<script id="image-template" type="text/template">
<div id="%div_id%" class="card gallery-card-v2 text-white bg-dark mb-1 p-1">
    <img id="%img_id%" class="card-img clickable" src="/assets/images/loading.gif" alt="%desc%"/>
    <div class="card-body">
        <p class="mb-2px card-text-override">
            <a id="%title_id%" class="card-title clickable underlinehover"><strong>%title%</strong></a></p>
        <p id="%type_id%" class="card-text card-text-override mb-2px">...</p>
        <p id="%content_id%" class="card-text card-text-override">...</p>        
        <p class="card-text card-text-override text-right mb-2px"><small>%date%</small></p>        
    </div>    
</div>        
</script>

<script src="{{ site.baseurl }}/assets/js/dom_helper.js"></script>
<script src="{{ site.baseurl }}/assets/js/queryStringRouter.js"></script>
<script src="{{ site.baseurl }}/assets/js/gallerydb.js"></script>
<script src="{{ site.baseurl }}/assets/js/gallery_filter.js"></script>