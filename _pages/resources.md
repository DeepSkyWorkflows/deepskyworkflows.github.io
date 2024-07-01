---
layout: page
title: Resources
permalink: /resources
comments: true
image: "assets/images/logo.png"
depends:
    resources.css
---
<p>This page contains links to obtain software, scripts, websites, and tools that are related to astrophotography. I started with resources I use in my own workflows, but would like to make this a comprehensive resource for everyone. If you use, maintain, or sell a tool you believe should be listed here, share your details by using the "<a href="https://github.com/DeepSkyWorkflows/deepskyworkflows.github.io/issues/new/choose" target="_blank" title="Add a request">add me</a>" issue to file your request. You don't have to own it to nominate it.</p>

<div class="legend">
    <small><strong>Legend:</strong></small>
    <p><strong><i class="fa fa-check"></i></strong> Free or donation</p>
    <p><strong><i class="fa fa-money"></i></strong> Fee</p>
    <p><strong><i class="fa fa-calendar"></i></strong> Subscription</p>
    <p><strong><i class="fa fa-hourglass"></i></strong> Trial or limited versions available</p>
    <p><strong><i class="fa fa-globe"></i></strong> Web-based</p>
    <p><strong><i class="fa fa-window-restore"></i> </strong>Windows only</p>
    <p><strong><i class="fa fa-moon-o"></i></strong> Planetary</p>
</div>

{%- assign sections = site.resources | group_by: 'section' | sort: 'name' -%}
<p class="quickjump">
    <strong>Quick jump:</strong>
    {%- for section in sections -%}
    <a href="#{{section.name}}">{{section.name}}</a>
    {%- endfor -%}
</p>
<div id="resources" class="resources">
    {%- for section in sections -%}
    <div class="resource">
        <h3>{{section.name}}</h3>
        <a name="{{section.name}}"></a>
        <div class="resource-body">
        {%- assign subitems = section.items | sort : 'name' -%} 
        {%- for resource in subitems -%}
            <p>
                <a target="_blank" href="{{ resource.site }}">{{ resource.name }}</a>
                <span>&nbsp;</span>                
                {%- for flag in resource.flags -%}
                    {%- assign icon = "" -%}
                    {%- assign description = "" -%}
                    {%- if flag == "free" -%}
                        {%- assign icon = "check" -%}
                        {%- assign description = "Free or donation-based." -%}
                    {%- endif -%}
                    {%- if flag == "web" -%}
                        {%- assign icon = "globe" -%}
                        {%- assign description = "Software is web-based." -%}
                    {%- endif -%}
                    {%- if flag == "fee" -%}
                        {%- assign icon = "money" -%}
                        {%- assign description = "Software requires purchase of a license." -%}
                    {%- endif -%}
                    {%- if flag == "sub" -%}
                        {%- assign icon = "calendar" -%}
                        {%- assign description = "Software is subscription-based." -%}
                    {%- endif -%}
                    {%- if flag == "trial" -%}
                        {%- assign icon = "hourglass" -%}
                        {%- assign description = "A free trial is available." -%}
                    {%- endif -%}
                    {%- if flag == "win" -%}
                        {%- assign icon = "window-restore" -%}
                        {%- assign description = "Software only runs on Windows machines." -%}
                    {%- endif -%}
                    {%- if flag == "planet" -%}
                        {%- assign icon = "moon-o" -%}
                        {%- assign description = "Software is primarily used for planetary workflows." -%}
                    {%- endif -%}
                    <span><i class="fa fa-{{ icon }}" title="{{ description }}" alt="{{ description }}"></i></span>
                {%- endfor -%}
            </p>
            <p><small>{{ resource.description }}</small></p>
        {%- endfor -%}   
        <p><a href="#dsw-top"><i class="fa fa-arrow-up"></i> Back to top</a></p>      
        </div>
    </div>
    {%- endfor -%}
</div>