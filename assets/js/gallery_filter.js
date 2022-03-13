---
layout: null
sitemap: false
---
    (function () {

        const debounceMs = 300;

        const telescopeContext = {
            selected: null,
            init: function () {
                $(".telescopeFilter").each(function () {
                    const scope = $(this).text();
                    $(this).on("click", function () {
                        telescopeContext.filterScope(scope);
                    });
                })
            },
            filterScope: function (scope) {
                searchContext.doClear();
                telescopeContext.selected = scope;
                $(".telescopeFilter").each(function () {
                    const tgtScope = $(this).text();
                    if (tgtScope !== scope) {
                        $(this).attr("disabled", "disabled");
                    } else {
                        $(this).html(`<strong>${scope}</strong>`);
                        $(this).on("click", function () {
                            telescopeContext.resetScope(scope);
                        });
                    }
                });
                $("div.card").each(function () {
                    $(this).removeClass("d-none");
                    if ($(this).attr("data-telescope") !== scope) {
                        $(this).addClass("d-none");
                    }
                });
            },
            resetScope: function (scope) {
                scope = scope || telescopeContext.selected;
                telescopeContext.selected = null;
                $(".telescopeFilter").each(function () {
                    $(this).removeAttr("disabled");
                    if ($(this).html().indexOf(scope) >= 0) {
                        $(this).text(scope);
                    }
                });
                $("div.card").each(function () {
                    $(this).removeClass("d-none");
                });
                telescopeContext.init();
            }
        };

        const searchContext = {
            query: null,
            timer: null,
            savedHash: [],
            doClear: function () {
                $("#gallerySearch").val('');
                $("#gallerySearch").select();
                $("div.card").each(function () {
                    $(this).removeClass("d-none");
                });
            },
            doSearch: function (skipButtons) {
                telescopeContext.resetScope();
                searchContext.timer = null;
                if (searchContext.query && searchContext.query.length) {
                    const term = searchContext.query;
                    location.hash = '#q-' + term;

                    $("div.card").each(function () {
                        let target = $(this).text().toLowerCase().trim();
                        if (target.indexOf(term) >= 0) {
                            $(this).removeClass('d-none');
                        }
                        else {
                            $(this).addClass('d-none');
                        }
                    });
                }
                else {
                    location.hash = "#";
                    $("div.card").each(function () {
                        $(this).removeClass('d-none');
                    });
                }
            }
        };

        $(document).ready(function () {
            // setup filter
            $("#gallerySearch").on("input", function () {
                searchContext.query = $(this).val().toLowerCase().trim();
                if (searchContext.timer) {
                    clearTimeout(searchContext.timer);
                }
                searchContext.timer = setTimeout(searchContext.doSearch, debounceMs);
            });

            $("#clearBtn").on("click", function () {
                searchContext.doClear();
            });

            if (location.hash.startsWith('#q-')) {
                let query = decodeURI(location.hash.substring(3));
                $("#gallerySearch").val(query);
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

            telescopeContext.init();
            $("#gallerySearch").focus();
        });
    })();