---
layout: page
title: Exhibition
image: "assets/images/gallery.jpg"
permalink: /exhibition/
---
<div class="exhibition">
    <div id="success" class="row d-none">
        <div class="col-12">
            <div class="alert alert-success">
            <span class="fa fa-check"></span> Your purchase was successful! We will be in touch shortly to arrange for pickup.
            </div>
        </div>
    </div>
    <div id="cancel" class="row d-none">
        <div class="col-12">
            <div class="alert alert-danger">
            <span class="fa fa-ban"></span> Transaction was cancelled.
            </div>
        </div>
    </div>
    <div id="soldout" class="row d-none">
        <div class="col-12">
            <div class="alert alert-warning">
            We're sorry, but that piece has sold. Please check back later to see if an additional print is available. <a href="/about">Contact me</a> for custom requests.
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-4 col-6 col-sm-12">
            <img src="/assets/images/exhibition/about.jpg" alt="Jeremy Likness">
        </div>
        <div class="col-lg-4 col-6 col-sm-12">
            <h3>Photography by Jeremy Likness</h3>
            <p>Jeremy Likness is a full-time software developer residing in Monroe. In early 2020, he was diagnosed with <a href="https://strengthwithparkinsons.com/" target="_blank">Young Onset Parkinson's Disease</a>. This was a wake up call to focus on doing the things he is passionate about and may not always be physically capable of performing. In 2021, he purchased his first telescope and took <a href="https://www.instagram.com/p/CKA4atJJduz/?utm_source=ig_web_copy_link" target="_blank">a picture of the Crab Nebula</a>. Since then, his passion for astrophotography and the size of his telescopes both have grown. We hope you enjoy this art that glorifies God's amazing creation.</p>
        </div>
        <div class="col-lg-4 col-6 col-sm-12">
            <p>Artwork from Jeremy Likness is on display at the following venues:</p>
            {% assign venueArray = '' | split: ',' %}
            {% for art in site.exhibition %}
                {% for venue in art.Venues %}
                    {% assign venueArray = venueArray | push: venue %}
                {% endfor %}
            {% endfor %}
            {% assign uniqueVenues = venueArray | uniq | sort %}
            <ul>
                {% for location in uniqueVenues %}        
                {% assign currentVenue = site.venues[location] %}
                <li>
                    <strong>{{ currentVenue.name }}</strong> &mdash; from {{ currentVenue.start}} to {{ currentVenue.end}}:
                    <a href="https://www.google.com/maps/search/{{ currentVenue.address }}" target="_blank">{{ currentVenue.address }}</a>
                </li>
                {% endfor %}
            </ul>
            {% include viewcart.html %}                        
        </div>
    </div>
    <div class="row">
        <div class="col">These prints are available for sale for local pickup only. <strong>I do not ship.</strong> I only sell the pieces that have been printed and are on display. Sales are made on a first come, first served basis and delivery will be made when the exhibition concludes.</div>
    </div>
    <div class="row">
        <div class="col">&nbsp;</div>
    </div>
    {% assign version = 1 %}
    {% assign pieces = site.exhibition | where: 'active', true | sort: 'Index' %}
    <div class="row mw-25">
        <div class="col-12">
                <div class="row">
                    {% assign itemIndex = 1 %}
                    {% for item in pieces %}        
                        {% assign mainUrl = site.baseurl | append: item.url %}
                        {% assign itemCount = itemCount | plus: 1 %}
                        {% assign thumbPath = site.baseurl | append: "/assets/images/exhibition/" | append: item.Thumbnail %}
                        <div class="card gallery-card" data-url="{{item.url}}">
                            <a href="{{mainUrl}}" title="{{item.description}}" tabindex="{{itemCount}}">
                                <img class="card-img-top gallery-img" id="image-{{itemIndex}}" src="{{thumbPath}}" alt="{{item.description}}">
                                {% assign itemIndex = itemIndex | plus: 1 %}
                            </a>
                            <div class="card-header bg-dark text-center">
                                <a href="{{mainUrl}}" title="{{item.description}}">{{item.title}}</a>
                            </div>                
                        </div>
                     {% endfor %}
                </div>        
        </div>
    </div>
<script src="{{ site.baseurl }}/assets/js/exhibition.js"></script>
