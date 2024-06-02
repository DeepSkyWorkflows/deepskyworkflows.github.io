---
layout: page
title: Search
image: "assets/images/gallery.jpg"
permalink: /search
---

<p>Use this page to search the entire site, including blog posts, videos, and images. Just tap outside of the input field or press enter to search. You can also bookmark searches and share them.</p>

<input class="search-input" disabled autofocus placeholder="Search terms." />
<progress class="search-progress"></progress>
<div class="alert search-status"></div>
<div class="search-results">
</div>

<script src="{{ site.baseurl }}/assets/js/queryStringRouter.js"></script>
<script src="{{ site.baseurl }}/assets/js/dom_helper.js"></script>
<script src="{{ site.baseurl }}/assets/js/search.js"></script>