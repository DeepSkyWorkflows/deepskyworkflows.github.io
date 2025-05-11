---
layout: page
title: Gallery
image: "assets/images/gallery.jpg"
permalink: /gallery/
depends:
    - gallery_filter.js
    - forms.css
    - gallery.css
---                                     
<div id="filterWrapper" class="filterWrapper d-none">
    <button id="btnLucky" type="button" class="btn btn-primary" disabled="disabled" title="Take me to a random item in the gallery.">I feel lucky!</button>
    <button id="btnRefresh" type="button" class="btn btn-success" title="Refresh results with current filter">Refresh</button>
    <button id="btnReset" type="button" class="btn btn-danger" title="Reset the form">Reset</button>
    <button id="btnSlideshow" type="button" class="btn btn-success" title="Turn these results into a slideshow">Slideshow</button>
    <div class="specialJump">
    <span>View one of our special collections:</span>
    <select id="selectSpecial" title="Jump to a special collection." class="filterSpecial" name="filterSpecial">
        <option value="0">No collection</option>
        {%- assign idx = 1 -%}
        {%- assign collections = site.portfolios | sort -%}
        {%- for collection in collections -%}
        <option value="{{ site.baseurl }}/tag/{{collection | strip | replace: ' ', '-' | remove: '(' | remove: ')' | downcase }}">{{ collection }}</option>
        {%- assign idx = idx | plus: 1 -%}
        {%- endfor -%}
    </select>                                                                                     </div>
    <input id="searchText" name="searchText" class="searchTerms" placeholder="Enter search terms."/>
    <select id="category" title="Choose your category" class="filterCategory" name="category">
        <option selected="selected" value="All">All categories</option>
    </select>
    <select id="sort" title="Choose your sort column" class="filterSort" name="sortBy">
        <option selected="selected" value=0>Choose your sort</option>    
    </select>
    <a href="#" class="sortDirection">
        <span class="fa fa-arrow-up" title="Sort ascending. Tap to change."></span>
    </a>
    <select id="telescope" title="Restrict to images taken with a specific telescope." 
            class="filterTelescope" name="telescope">
        <option selected="selected" value="All">All telescopes</option>
    </select>
    <div class="formCheckbox">
        <input id="signatureOnly" title="Check to only show results from our signature series"
            class="signature" type="checkbox" name="signatureOnly"/>&nbsp;
        <span class="checkboxState" id="signatureCbState"></span>
    </div>
    <div class="formCheckbox">
        <input id="printOnly" title="Check to only show results that have a related physical piece in our printed collection."
            class="print" type="checkbox" name="printOnly"/>&nbsp;
        <span class="checkboxState" id="printCbState"></span>
    </div>
    <div class="formCheckbox">
        <input id="includeArchived" title="Check to include archived results."
            class="archive" type="checkbox" name="includeArchive"/>&nbsp;
        <span class="checkboxState" id="archiveCbState"></span>
    </div>
    <div class="formCheckboxSimplify">
        <input id="simplifyToggle" title="Check to simplify with tiled gallery view."
            class="simplify" type="checkbox" name="simplifyToggle"/>&nbsp;
        <span class="checkboxState" id="simplifyCbState"></span>
    </div>
</div>
<hr/>
<div class="alert alert-info init">
    <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>&nbsp;Preparing the gallery for use...
</div>
<div class="results">
</div>