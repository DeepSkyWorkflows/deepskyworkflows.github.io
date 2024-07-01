---
layout: page
title: Search
permalink: /search
comments: false
image: "assets/images/logo.png"
depends: 
    - forms.css
    - search.css
    - search.js
---
<p>Use this page to search the entire site, including blog posts, videos, and images. Just tap outside of the input field or press enter to search. You can also bookmark searches and share them.</p>
<form>
    <input id="search-input" name="search-input" class="search-input" disabled placeholder="Search terms." />
</form>
<progress class="search-progress"></progress>
<div id="status" class="alert search-status">(loading)</div>
<div id="results" class="search-results">(no results)</div>