---
layout: page
title: Gallery
image: "assets/images/gallery.jpg"
permalink: /gallery/
---
<div><button id="lucky" class="btn btn-sm btn-primary m-1" title="View a random picture from the gallery.">I feel lucky</button> Take me to a random item in the gallery.</div>
<p><strong>Signature</strong> images are my self-selected favorites. Print-ready images can be ordered online. If you are interested in an image that is not print-ready, <a href="{{site.galleryhome}}/contact" target="_blank">send us the link</a> and we'll set it up. In addition to astrophotography I have galleries with pictures of Mt. Rainier, the Pacific Ocean, and more. You can browse the print-ready galleries <a href="{{site.galleryhome}}" target="_blank">here</a> or jump straight to a category using the dropdown:</p>
<div><script type="text/javascript">var _cb = parseInt(Math.random() * 99999999);document.write('<sc' + 'ript type="text/javascript" src="https://deepskyworkflows.shootproof.com/remote/chooser?events=1&email=0&language=en_US&cb=' + _cb + '"></sc' + 'ript>');</script></div>
<div id="galleryMain">
    <a name="top"/>
    <div id="filters">
        <div id="status"></div>
        <div id="filterExpand" class="clickable">[+] Show filters and sort</div>
        <div id="filterExpanded" >            
            <div>
                <span id="filterCollapse" class="clickable">[-]</span>
                <span><button id="reset" class="btn btn-link btn-warning">Reset</button></span>
                <span><input type="checkbox" id="signature" title="Check to filter signature series"/> Signature</span>
                <span><input type="checkbox" id="print" title="Check to filter print-ready items"/> Print-ready</span>
                <span><input type="checkbox" id="archive" title="Click to view archived images"/> Archived</span>&nbsp;|&nbsp;
                <span><label for="text" class="mr-1">Search text:</label><input id="text" type="text" placeholder="Enter text to search for"/></span>                
            </div>
            <div>
                <span><label for="sortBy" class="mr-1">Sort by:</label><select id="sortBy"></select></span>
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

<script id="basePrintUrl" type="text/template">{{site.galleryhome}}</script>

<script id="image-template" type="text/template">
<div id="%div_id%" class="card gallery-card-v2 text-white bg-dark mb-1 p-1">
    <img id="%img_id%" class="card-img clickable" src="/assets/images/loading.gif" alt="%desc%"/>
    <div class="card-body">
        <p class="mb1"><strong id="%title_id%" class="card-title clickable underlinehover">%title%</strong></p>
        <p class="card-text text-right mb-1"><small>%date%</small></p>
        <p id="%type_id%" class="card-text mb-1">...</p>
        <p id="%content_id%" class="card-text">...</p>        
    </div>
</div>        
</script>

<script src="{{ site.baseurl }}/assets/js/queryStringRouter.js"></script>
<script src="{{ site.baseurl }}/assets/js/gallerydb.js"></script>
<script src="{{ site.baseurl }}/assets/js/gallery_filter.js"></script>