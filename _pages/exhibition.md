---
layout: page
title: Exhibition
image: "assets/images/gallery.jpg"
permalink: /exhibition/
---

<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/exhibition.css"/>
<div class="exhibition container">
    <h2>Astrophotography, Landscape and other Art Prints</h2>
    <p><strong>By Jeremy Likness, DSW Galleries LLC</strong></p>
    <p>This page contains a list of items in my physical inventory. It is possible to create a print from any image in our <a href="/gallery">gallery</a>, so if your image is not here you can always <a href="https://dswgalleries.com/contact">contact us</a> with your request. The purpose of this gallery is to show you what prints are available at galleries, exhibitions, and shows, especially if you're interested in grabbing a first edition. All prints come with a certificate of authenticity and a bill of sale. I do not currently ship but will drop it off anywhere near Highway 101 between Lincoln City and Waldport.</p>
    <h3>Current venues:</h3>
    {% for currentVenue in site.venues %}
        {% for venue in currentVenue %}
            {% if venue.start %}
                <p><strong>{{ venue.name }}</strong><span>&mdash; from {{ venue.start}}&nbsp;</span>
                    {% if venue.end %}
                        <span>to {{ venue.end }}&nbsp;</span>
                    {% endif %}
                    {% if venue.address and venue.address != '' %}
                        <small><span>&nbsp;at&nbsp;</span><a href="https://www.google.com/maps/search/{{ venue.address }}" target="_blank">{{ venue.address }}</a></small>
                    {% endif %}
                </p>
            {% endif %}
        {% endfor %}
    {% endfor %}    
    <h3>Current prints</h3>
    <div class="ex-container">
        {% assign pieces = site.exhibition | where: 'active', true | sort: 'Index' %}
        {% for item in pieces %}
            {% assign mainUrl = site.baseurl | append: item.url %}
            {% assign thumbPath = site.baseurl | append: "/assets/images/exhibition/" | append: item.Thumbnail %}
            {% assign qrPath = site.baseurl | append: "/assets/images/exhibition/" | append: item.QR %}
            <div class="ex-cell">
                <img src="{{thumbPath}}" class="ex-responsive-image" alt="{{item.description}}" />
                <p><strong><a href="{{ mainUrl }}">{{ item.title }}</a></strong></p>
                <p class="small"><i>{{item.Print}}, {{item.Width}}" x {{item.Height}}"</i></p>
                <p class="small right">
                    <strong>
                        {% if item.Sold %}
                            <span>${{ item.Price }} USD <strong>(sold)</strong></span>
                        {% else %}
                            <span><a href="https://www.paypal.com/ncp/payment/{{ item.PayPal }}">${{ item.Price }} USD</a></span>
                        {% endif %}
                    </strong>
                </p>
                <p class="small">
                    {% if item.Edition == 1 %}<span>🥇 1st edition&nbsp;</span>{% endif %}                
                    <a href="{{ mainUrl }}" target="_blank">Details</a>
                    <span>&nbsp;|&nbsp;</span>
                    <a href="{{ qrPath }}" target="_blank">QR Code</a>
                </p>
            </div>
        {% endfor %}
    </div>
</div>
<script src="{{ site.baseurl }}/assets/js/exhibition.js"></script>    