---
layout: page
title: Messier Catalog
image: "assets/images/gallery.jpg"
permalink: /messier/
---
<p><strong><span id="expando" data-value="open">🔽</span>&nbsp;Description</strong></p>
<p id="expando-target">The Messier Catalog dates to the 18th century when French astronomer Charles Messier set out to create a "Catalog of Nebulae and Star Clusters." Interestingly enough, his motivation wasn't to discover deep sky objects. Charles was a devoted comet hunter and wanted to be sure other astronomers didn't waste their time on these "distractions." The catalog features 110 objects ranging from nebulae, galaxies, and star clusters to rich star fields and asterisms. My goal is to observe every target in the catalog. Use this grid to explore the catalog. Click colum headings to sort. The season is the best time of year to observe the target and the difficulty describes how easy targets are to view with binoculars.</p>

{% assign items = site.messier | sort: "Index" %}
{% assign grid-flow = "col-2" %}
<button id="btnGrid"><span class="fa fa-list"/> &nbsp; Grid</button>&nbsp;
<button id="btnTile"><span class="fa fa-th"/> &nbsp; Tiles</button>
<div class="container-fluid" id="tiles">
    <div class="row">
        <div class="{{grid-flow}}">
            <span class="fa fa-star"/> &nbsp;<span id="report"></span>
        </div>
        <div class="{{grid-flow}}">
            <h4>✅ Very Easy</h4>
        </div>
        <div class="{{grid-flow}}">
            <h4>🟢 Easy</h4>
        </div>
        <div class="{{grid-flow}}">
            <h4>🟡 Moderate</h4>
        </div>
        <div class="{{grid-flow}}">
            <h4>🔴 Hard</h4>
        </div>
        <div class="{{grid-flow}}">
            <h4>⛔ Very Hard</h4>
        </div>
    </div>
    {% assign seasons = "Spring,Summer,Autumn,Winter" | split: "," %}
    {% for season in seasons %}
    <div class="row" data-value="{{ season }}">
        <div class="{{grid-flow}}">            
            <h4>
            {% if season == "Spring" %}
            🌼 Spring
            {% endif %}
            {% if season == "Summer" %}
            ☀ Summer
            {% endif %}
            {% if season == "Autumn" %}
            🍂 Autumn
            {% endif %}
            {% if season == "Winter" %}
            ❄ Winter
            {% endif %}
            </h4>
        </div>
        {% assign difficulties = "Very Easy,Easy,Moderate,Hard,Very Hard" | split: "," %}
        {% for difficulty in difficulties %}
        <div class="{{grid-flow}} border border-dark" data-value="{{ difficulty }}">
            {% assign cell = site.messier | sort : "Index" | where: "Season", season | where: "Difficulty", difficulty %}
            {% for target in cell %}
                {% assign style = "btn-danger" %}
                {% if target.Image %}
                    {% assign style = "btn-success" %}
                {% endif %}
                <a href="/messier/{{ target.Target }}" class="m-1 p-1 btn {{style}}" title="View details of {{ target.NGC }}">
                    {{ target.Target }}
                </a>&nbsp;
            {% endfor %}            
        </div>
        {% endfor %}
    </div>    
    {% endfor %}        
</div>
<div class="container-fluid" id="grid">
    <div class="row">
        <div class="col-6">
            <strong>Filter:</strong>&nbsp;<span id="filters">None</span>&nbsp;
            <a class="btn btn-secondary btn-sm mb-1" id="btnClearFilter" href="#">Reset</a>
        </div>
        <div class="col-6">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="filter-label">Filter:</span>
                </div>
                <input type="text" id="textFilter" class="form-control" placeholder="Type text to filter by" aria-label="Filter" aria-describedby="filter-label"/>
                <button class="btn btn-secondary btn-sm mb-1 ml-1" id="btnClearText">Clear</button>
            </div>
        </div>
    </div>
    <div class="row">
        Set quick filter to:
        <button id="filterToggle" class="btn btn-link btn-sm"></button>
        &nbsp;Current filter (<span id="currentFilter"></span>):&nbsp;
        <span id="filter-type"></span>
        <span id="filter-constellation"></span>
        <span id="filter-season"></span>
        <span id="filter-difficulty"></span>
    </div>
    <div class="row">
        <div class="col-12">
            <table class="table table-striped table-hover table-sm mw-100">
                <thead class="thead-light table-info">
                    <tr>
                        <th scope="col" class="" data-sort="target">Target</th>
                        <th scope="col" data-sort="name" class="text-center">Name</th>
                        <th scope="col" data-sort="type">Type</th>      
                        <th scope="col" data-sort="constellation">Constellation</th>
                        <th scope="col" data-sort="ra">R.A.</th>
                        <th scope="col" data-sort="dec">Dec.</th>
                        <th scope="col" data-sort="magnitude">Mag.</th>
                        <th scope="col" data-sort="size">Size</th>
                        <th scope="col" data-sort="distanceLy">Distance</th>
                        <th scope="col" data-sort="season">Season</th>
                        <th scope="col" data-sort="difficulty">Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    {% for item in items %}
                    <tr class="align-items-center">
                        <th scope="row" class="align-items-center" data-value="{{item.Target}}">
                            <a href="/messier/{{item.Target}}" title="{{item.Target}}">{{item.Target}}</a>
                        </th>
                        <td class="text-center" data-value="{{item.NGC}}" data-captured="{{ item.Image }}">
                            {% if item.Image %}
                                {% assign gallery = site.gallery | find: "folder", item.Image %}
                                {% assign mainUrl = site.baseurl | append: gallery.url %}
                                {% assign thumbPath = site.baseurl | append: "/assets/images/gallery/" | append: gallery.folder | append: "/thumb.jpg" %}
                                <div class="card bg-light messier-card">
                                    <img class="card-img-top" src="{{thumbPath}}" alt="{{gallery.description}}" title="{{gallery.description}}">
                                    <div class="card-img-overlay">
                                        <h5 class="card-title">
                                            <a class="stretched-link" href="/messier/{{item.Target}}" title="Messier {{item.Target}}">
                                                {{item.NGC}}
                                            </a>
                                        </h5>          
                                    </div>
                                </div>                                
                            {% else %}
                            <div class="card bg-light messier-card">
                                    <strong style="font-size: 2em;">❌</strong>
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            <a class="stretched-link" href="/messier{{item.Target}}" title="Messier {{item.Target}}">
                                                {{item.NGC}}
                                            </a>
                                        </h5>          
                                    </div>
                            </div>
                            {% endif %}
                        </td>
                        <td data-value="{{item.Type}}" data-filter="type">{{item.Type}}</td>
                        <td data-value="{{item.Constellation}}" data-filter="constellation">{{item.Constellation}}</td>
                        <td data-value="{{item.RA}}">{{item.RA}}</td>
                        <td data-value="{{item.Dec}}">{{item.Dec}}</td>
                        <td data-value="{{item.Magnitude}}">
                            {% assign magnitude = item.Magnitude | to_integer %}
                            {% assign value = "&nbsp;" | append: item.Magnitude | append: "&nbsp;" %}
                            {% assign intensity = 200 | times: magnitude | divided_by: 10  %}
                            {% assign intensity = 255 | minus: intensity %}
                            {% assign fontcolor = "white" %}
                            {% if intensity > 127 %}
                            {% assign fontcolor = "black" %}
                            {% endif %}
                            <span class="border m-2 p-1 rounded-circle d-none d-lg-inline" style="width: 5em; color: {{fontcolor}}; background-color: rgb({{intensity}}, {{intensity}}, {{intensity}})">{{ value }}</span>
                        </td>
                        <td data-value="{{item.Size}}">{{item.Size}}</td>
                        <td data-value="{{item.DistanceLy}}">{{item.DistanceLy}} L.Y.</td>
                        <td data-value="{{item.Season}}" data-filter="season">
                            {% case item.Season %}
                                {% when "Winter" %}
                                <span title="Winter">❄</span>
                                {% when "Spring" %}
                                <span title="Spring">🌼</span>
                                {% when "Summer" %}
                                <span title="Summer">☀</span>                    
                                {% when "Autumn" %}
                                <span title="Autumn">🍂</span>                    
                                {% else %}
                            {% endcase %}
                            <span class="d-none d-lg-inline">&nbsp;{{ item.Season }}</span>
                        </td>
                        <td data-value="{{item.Difficulty}}" data-filter="difficulty">
                            {% case item.Difficulty %}
                                {% when "Very Easy" %}
                                <span title="Very Easy">✅</span>
                                {% when "Easy" %}
                                <span title="Easy">🟢</span>
                                {% when "Moderate" %}
                                <span title="Moderate">🟡</span>
                                {% when "Hard" %}
                                <span title="Hard">🔴</span>
                                {% when "Very Hard" %}
                                <span title="Very Hard">⛔</span>
                            {% endcase %}
                            <span class="d-none d-lg-inline">&nbsp;{{ item.Difficulty }}</span>
                        </td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
    </div>
</div>


<script src="{{ site.baseurl }}/assets/js/messier.js"></script>