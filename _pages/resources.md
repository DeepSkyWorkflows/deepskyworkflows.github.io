---
layout: page
title: Resources
permalink: /resources
comments: true
image: "assets/images/logo.png"
---

This page contains links to obtain software, scripts, websites, and tools that are related to astrophotography. I started with resources I use in my own workflows, but would like to make this a comprehensive resource for everyone. If you use, maintain, or sell a tool you believe should be listed here, share your details by using the [add me](https://github.com/DeepSkyWorkflows/deepskyworkflows.github.io/issues/new/choose) issue to file your request. You don't have to own it to nominate it.  

<small><strong>Legend:</strong> <strong><i class="fa fa-check"></i></strong> Free or donation <strong><i class="fa fa-dollar-sign"></i></strong> Fee <strong><i class="fa fa-calendar"></i></strong> Subscription <strong><i class="fa fa-hourglass"></i></strong> Trial or limited versions available <strong><i class="fa fa-globe"></i></strong> Web-based <strong><i class="fa fa-window-restore"></i> </strong>Windows only <strong><i class="fa fa-moon"></i></strong> Planetary</small>

{% assign sections = site.resources | group_by: 'section' | sort: 'name' %}
<div id="resources" class="resources card-deck container-fluid w-100 p-1 m-1">
    {% for section in sections %}
    <div class="card">
        <div class="card-header">
            <div class="card-title">{{ section.name }}</div>
        </div>
        <div class="card-body">
        {% assign subitems = section.items | sort : 'name' %} 
        {% for resource in subitems %}
            <p>
                <a href="{{ resource.url }}>">{{ resource.name }}</a>
                <span>&nbsp;</span>                
                {% for flag in resource.flags %}
                    {% assign icon = "" %}
                    {% assign description = "" %}
                    {% if flag == "free" %}
                        {% assign icon = "check" %}
                        {% assign description = "Free or donation-based." %}
                    {% endif %}
                    {% if flag == "web" %}
                        {% assign icon = "globe" %}
                        {% assign description = "Software is web-based." %}
                    {% endif %}
                    {% if flag == "fee" %}
                        {% assign icon = "dollar-sign" %}
                        {% assign description = "Software requires purchase of a license." %}
                    {% endif %}
                    {% if flag == "sub" %}
                        {% assign icon = "calendar" %}
                        {% assign description = "Software is subscription-based." %}
                    {% endif %}
                    {% if flag == "trial" %}
                        {% assign icon = "hourglass" %}
                        {% assign description = "A free trial is available." %}
                    {% endif %}
                    {% if flag == "win" %}
                        {% assign icon = "window-restore" %}
                        {% assign description = "Software only runs on Windows machines." %}
                    {% endif %}
                    {% if flag == "planet" %}
                        {% assign icon = "moon" %}
                        {% assign description = "Software is primarily used for planetary workflows." %}
                    {% endif %}
                    <span><i class="fa fa-{{ icon }}" title="{{ description }}" alt="{{ description }}"></i></span>
                {% endfor %}
            </p>
            <p><small>{{ resource.description }}</small></p>
        {% endfor %}   
        </div>
    </div>
    {% endfor %}
