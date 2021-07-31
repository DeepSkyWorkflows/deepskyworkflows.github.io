---
layout: null
sitemap: false
---
(function () {

    const debounceMs = 300;
    const autoSelectMs = 1000;

    const tags = [];
    const tagContent = {
        "_selectedTag": null,
        "_tag": "",
        selectTag: function(tagButton, tag) {
            if (tagContent["_selectedTag"] &&
                $(tagContent["_selectedTag"]).text() === tag) {
                    tagContent.deselectTag();
                    return;
                }
            tagContent["_selectedTag"] = tagButton;
            tagContent["_tag"] = tag;
            location.hash = '#tag-' + tag;
            $("#gallerySearch").attr("disabled", true);
            $(tagButton).removeClass("badge-primary")
                .addClass("badge-success");
            $("button.badge").each(function () {
                if ($(this).text() !== tag) {
                    $(this).removeClass("badge-primary")
                        .addClass("badge-secondary")
                        .attr("disabled", true);
                }
            });
            $("div.card").each(function () {
                let match = $(this).attr("data-url");
                if (tagContent[tagContent["_tag"]].indexOf(match) >= 0) {
                    $(this).removeClass("d-none");
                }
                else {
                    $(this).addClass("d-none");
                }
            });
        },
        deselectTag: function() {
            let tagButton = tagContent["_selectedTag"];
            location.hash = "#";
            tagContent["_selectedTag"] = null;
            tagContent["_tag"] = "";
            
            $("#gallerySearch").removeAttr("disabled");
            
            $(tagButton).removeClass("badge-success");
            
            $("button.badge").each(function () {
                $(this).removeClass("badge-secondary")
                    .addClass("badge-primary")
                    .removeAttr("disabled");
            });

            $("div.card").each(function () {
                $(this).removeClass("d-none");
            });
        }
    };

    {% assign tagList = "" | split: "," %}
    {% for item in site.gallery %}
        {% for tag in item.tags %}
            {% assign normalizedTag = tag | captialize | strip %}
            {% assign tagList = tagList | push: normalizedTag %}
        {% endfor %}
    {% endfor %}

    {% assign uniqueTags = tagList | uniq | sort %}

    {% for tag in uniqueTags %}
    tags.push("{{tag}}");
    tagContent["{{tag}}"] = [];
    {% endfor %}

    {% for item in site.gallery %}
        {% for tag in item.tags %}
            {% assign normalizedTag = tag | captialize | strip %}
    tagContent["{{normalizedTag}}"].push("{{item.url}}");
        {% endfor %}
    {% endfor %}            

    const searchContext = {
        query: null,
        timer: null,
        selectTimer: null,
        savedHash: [],
        doSearch: function (skipButtons) {
            searchContext.timer = null;
            if (searchContext.query && searchContext.query.length) {
                const term = searchContext.query;
                location.hash = '#q-' + term;
                if (skipButtons !== true) {
                    $("button.badge").each(function () {
                        $(this).removeClass("badge-primary")
                            .addClass("badge-secondary")
                            .attr("disabled", true);
                    });
                }
                $("div.card").each(function() {
                    let target =  $(this).text().toLowerCase().trim();
                    if (target.indexOf(term) >= 0) {
                        $(this).removeClass('d-none');
                    } 
                    else {
                        $(this).addClass('d-none');
                    }
                });
                if (searchContext.selectTimer) {
                    clearTimeout(searchContext.selectTimer);
                }              
                searchContext.selectTimer = setTimeout(function () {
                    searchContext.selectTimer = null;
                    $("#gallerySearch").select();
                }, autoSelectMs);
            }
            else {
                location.hash = "#";
                $("div.card").each(function () {
                    $(this).removeClass('d-none');
                });
                $("button.badge").each(function () {
                    $(this).removeClass("badge-secondary")
                        .addClass("badge-primary")
                        .removeAttr("disabled");
                });                
            }
        }
    };

    $(document).ready(function (){
        // setup filter
        $("#gallerySearch").on("input", function () {
            searchContext.query = $(this).val().toLowerCase().trim();      
            if (searchContext.timer) {
                clearTimeout(searchContext.timer);
            }
            searchContext.timer = setTimeout(searchContext.doSearch, debounceMs);            
        });

        // setup tags
        for (let idx = 0; idx < tags.length; idx++) {
            const tagButton = document.createElement("button");
            $(tagButton).addClass("badge")
                .addClass("badge-primary")
                .addClass("badge-small")
                .addClass("m-2")
                .text(tags[idx]);
            $(tagButton).on("click", function () {
                tagContent.selectTag(tagButton, tags[idx]);
            });
            $("#tagContainer").append(tagButton);
        }

        if (location.hash.startsWith('#tag-')) {
            let tag = decodeURI(location.hash.substring(5)); 
            let tagControl = $("button.badge:contains('" + tag + "')");
            setTimeout(function () {
                $(tagControl).trigger({type: 'click'});
            }, 0);
        }
        else if (location.hash.startsWith('#q-')) { 
            let query = decodeURI(location.hash.substring(3));
            setTimeout(function () {
                searchContext.query = query.toLowerCase().trim();
                $("gallerySearch")
                    .attr("value", query)
                    .trigger({
                        type: 'input'
                    });
                searchContext.doSearch(true);
            });
        }

        $("#gallerySearch").focus();
    });
})();