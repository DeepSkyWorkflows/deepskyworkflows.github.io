---
layout: page
title: Categories
permalink: /categories
comments: false
image: "/assets/images/logo.png"
depends:
    categories.css
---
<div markdown="0">
    <p>Find blog posts and videos based on your favorite categories.</p>
    {%- assign posts = site.posts | sort: "date" | reverse -%}
    {%- assign videos = site.videos | sort: "date" | reverse -%}
    {%- assign categories = "" | split: "" -%}
    {%- for post in posts -%}
        {%- for category in post.categories -%}
            {%- assign categories = categories | push: category -%}
        {%- endfor -%}
    {%- endfor -%}
    {%- for video in videos -%}
        {%- for category in video.categories -%}
            {%- assign categories = categories | push: category -%}
        {%- endfor -%}
    {%- endfor -%}
    {%- assign sortedCategories = categories | uniq | sort -%}
    <p class="quickjump">
        <strong>Quick jump:</strong>
        {%- for category in sortedCategories -%}
            <a href="#{{category}}">{{ category }}</a>
        {%- endfor -%}
    </p>
    <div id="categories" class="category-list">
        {%- for category in sortedCategories -%}
            <div class="category">
                <a name="{{ category }}"></a>
                <h3 id="{{ category }}">{{category}}</h3>
                <div class="results">            
                    {%- for post in posts -%}
                        {%- for postCategory in post.categories -%}
                            {%- if category == postCategory -%}
                                <div class="post-result">
                                    <img src="{{ site.baseurl}}/{{ post.image }}" title="{{ post.title }}" alt="{{ post.title }}"/>                                    
                                    <small>{{ post.date | date: '%Y-%m-%d' }}</small>
                                    <a href="{{ site.baseurl }}{{ post.url }}" 
                                        title="{{ post.title }}">
                                        {{ post.title }}
                                    </a>
                                </div>
                            {%- endif -%}
                        {%- endfor -%}
                    {%- endfor -%}                   
                    {%- for video in videos -%}
                        {%- for videoCategory in video.categories -%}
                            {%- if category == videoCategory -%}
                                <div class="video-result">
                                    <img src="{{ site.baseurl}}/{{ video.image }}" title="{{ video.title }}" alt="{{ video.title }}"/>            
                                    <small>{{ video.date | date: '%Y-%m-%d' }}</small>
                                    <a href="{{ site.baseurl }}{{ video.url }}" 
                                        title="{{ video.title }}">
                                        {{ video.title }}
                                    </a>
                                </div>
                            {%- endif -%}
                        {%- endfor -%}
                    {%- endfor -%}                   
                </div>                          
            </div>
        {%- endfor -%}   
        <p><a href="#dsw-top"><i class="fa fa-arrow-up"></i> Back to top</a></p>      
    </div>
</div>