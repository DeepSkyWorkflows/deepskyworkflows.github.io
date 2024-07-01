---
layout: default
title: Tags
permalink: /tags
pagination: false
depends: 
    - tags.css
---
<p>Tags are attributes assigned to images, articles, and videos to identify objects (such as stars and galaxies), events (like the 2024 solar eclipse), and locations. Typically, tags are accessed by navigating to a resource such as a gallery item. This page is a comprehensive list of all of the tags in our database.</p>
{%- assign taglist = "" | split: "," -%}
{%- assign firstLetters = "" | split: "," -%}
{%- for item in site.gallery -%}
    {%- for tag in item.tags -%}
        {%- assign gtag = tag | capitalize | strip -%}        
        {%- assign taglist = taglist | push: gtag -%} 
        {%- assign ch = gtag | slice: 0 -%}    
        {%- if ch != '' -%}{%- assign firstLetters = firstLetters | push: ch -%}{%- endif -%}
    {%- endfor -%}    
{%- endfor -%}
{%- for item in site.posts -%}
    {%- for tag in item.tags -%}
        {%- assign ptag = tag | capitalize | strip -%}
        {%- assign taglist = taglist | push: ptag -%}        
        {%- assign ch = ptag | slice: 0 -%}                   
        {%- if ch != '' -%}{%- assign firstLetters = firstLetters | push: ch -%}{%- endif -%}
    {%- endfor -%}        
{%- endfor -%}
{%- for item in site.videos -%}
    {%- for tag in item.tags -%}
        {%- assign vtag = tag | capitalize | strip -%}
        {%- assign taglist = taglist | push: vtag -%}                    
        {%- assign ch = vtag | slice: 0 -%}                   
        {%- if ch != '' -%}{%- assign firstLetters = firstLetters | push: ch -%}{%- endif -%}
    {%- endfor -%}        
{%- endfor -%}
{%- assign sortedTags = taglist | uniq | sort -%}
{%- assign sortedChars = firstLetters | uniq | sort -%}
<div markdown="0">
<div class="quickjump">
    <a href="#Special tags">Special tags</a>
    {%- for ch in sortedChars -%}
        <a href="#{{ch}}">{{ch}}</a>        
    {%- endfor -%}
</div>
<div class="tag-section">
    <a name="Special tags"></a>
    <h3>Special tags</h3>    
    {%- for collection in site.portfolios -%}    
        <a href="{{ site.baseurl }}/tag/{{collection | strip | replace: ' ', '-' | remove: '(' | remove: ')' | downcase }}" title="{{collection}}" alt="{{collection}}">{{collection}}</a>
    {%- endfor -%}
</div>
{%- include top.html -%}
{%- for ch in sortedChars -%}
<div class="tag-section">
    <a name="{{ch}}"></a>
    <h3>Tags that start with: <strong>{{ch}}</strong></h3>
    {%- for tag in sortedTags -%}
        {%- assign tagCh = tag | slice: 0 -%}
        {%- if ch == tagCh -%}
            <a href="{{ site.baseurl }}/tag/{{tag | strip | replace: ' ', '-' | remove: '(' | remove: ')' | downcase }}" title="{{tag}}" alt="{{tag}}">{{tag}}</a>
        {%- endif -%}
    {%- endfor -%}
</div>
{%- include top.html -%}
{%- endfor -%}
</div>