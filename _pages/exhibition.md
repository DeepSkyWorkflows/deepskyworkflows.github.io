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
            We're sorry, but that piece has sold. Please check back later to see if an additional print is available. <a href="https://dswgalleries.com/contact">Contact me</a> for custom requests.
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-4 col-6 col-sm-12">
            <img src="/assets/images/exhibition/about.jpg" alt="Jeremy Likness">
        </div>
        <div class="col-lg-4 col-6 col-sm-12">
            <h3>Photography and Art by Jeremy Likness (DSW Galleries, LLC)</h3>
            <p>Jeremy Likness started astrophotography as a hobby in 2020. He quickly fell in love with photographing the night skies and began to invest in new equipment and try new techniques. After moving to Newport, Oregon, he grew an appreciation for outdoor and landscape photography in addition to astrophotography. Jeremy embraces several forms of astrophotography, including lunar, solar, deep sky, and Milky Way.</p>
            <p>In Jeremy's own words:</p>
            <p><quote>"Each piece is part of a story and has been chosen to capture a moment so that it can be shared and experienced again. It's not just about the target, but the experience of acquiring the target. I've braved thunderstorms and black bears, dodged forest fires, hiked over glaciers and slept in the car when it was 19° Fahrenheit to get a shot. Sometimes I'll take 600 shots just to use 1."</quote></p>
            <p>Every piece comes with a certificate of authenticity and includes information including where and when the photograph was taken, how many prints exist or if it is an exclusive or first edition print, the settings and equipment used, a description of the target and any backstory around the photo itself.</p>
            <p>If you are unable to find the piece you are looking for or it is not showing as available on this site, <a href="https://dswgalleries.com/contact" target="_blank">contact us</a> with your request. Share the URL if available, the name of the target, and any preferences you may have for size or materials. Photographs on this page are of the actual artwork or piece.</p>
        </div>
        <div class="col-lg-4 col-6 col-sm-12">
            <p>Artwork from Jeremy Likness is on display at the following venues:</p>
            <ul>
                {% for currentVenue in site.venues %}
                {% for venue in currentVenue %}
                {% if venue.start %}
                <li><strong>{{ venue.name }}</strong> &mdash; from {{ venue.start}} to {{ venue.end }}
                    {% if venue.address != "" %}
                    <span>&nbsp;at&nbsp;</span>
                    <a href="https://www.google.com/maps/search/{{ currentVenue.address }}" target="_blank">{{ venue.address }}</a>
                    {% endif %}
                </li>
                {% endif %}
                {% endfor %}
                {% endfor %}
            </ul>
        </div>
    </div>
    <div class="row">
        <div class="col">These prints are available for sale for local pickup only. <strong>I do not ship.</strong> I only sell pieces that have been printed and are on display. Sales are made on a first come, first served basis and delivery will be made when the exhibition concludes.</div>        
    </div>
    <div class="row">
        <div class="col">&nbsp;</div>
    </div>
    {% assign version = 1 %}
    {% assign pieces = site.exhibition | where: 'active', true | sort: 'Index' %}
    {% assign itemIndex = 1 %}
    {% for item in pieces %}        
        {% assign mainUrl = site.baseurl | append: item.url %}
        {% assign itemCount = itemCount | plus: 1 %}
        {% assign thumbPath = site.baseurl | append: "/assets/images/exhibition/" | append: item.Thumbnail %}
        {% assign qrPath = site.baseurl | append: "/assets/images/exhibition/" | append: item.QR %}
    <div class="row mw-25">
        <div class="col-3">
            <a href="{{mainUrl}}" title="{{item.description}}" tabindex="{{itemCount}}">
                <img class="card-img-top gallery-img" id="image-{{itemIndex}}" src="{{thumbPath}}" alt="{{item.description}}"/>            
            </a>
        </div>
        <div class="col-2">
            <img class="card-img-top gallery-img" style="height: 256px; width: 256px;" id="image-qr-{{itemIndex}}" src="{{qrPath}}" alt="{{item.description}}"/>
        </div>
        {% assign itemIndex = itemIndex | plus: 1 %}
        <div class="col-4">
            <strong><a href="{{mainUrl}}" title="{{item.description}}">{{item.title}}</a></strong><p>{{item.description}}</p>      
        </div>                                         
        <div class="col-2">
            {{ item.Print }} &mdash; {{ item.Width }}" x {{ item.Height }}"
        </div>
        <div class="col-1">
            <a href="{{mainUrl}}" title="Click to buy">${{ item.Price }} USD</a>
            {% if item.Sold == true %}(sold){% endif %}
        </div>                        
    </div>
    {% endfor %}
</div>        
<script src="{{ site.baseurl }}/assets/js/exhibition.js"></script>
