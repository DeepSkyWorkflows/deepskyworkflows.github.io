---
layout: null
sitemap: false
---
(function () {

    const debounceMs = 300;

    const queryManager = {

        values: {},
        keys: [],
        baseUrl: '',
        hash: '',

        parseIncoming: function () {

            queryManager.baseUrl = window.location.href.split('#')[0].split('?')[0];
            queryManager.hash = window.location.hash;

            if (queryManager.keys.length || !(window.location.search)) {
                return;
            }

            if (window.location.search) {
                const incoming = decodeURI(window.location.search.substring(1)).split("&");
                queryManager.values = {};
                queryManager.keys = [];
                for (let i = 0; i < incoming.length; i++) {
                    const keyValue = incoming[i].split("=");
                    queryManager.keys.push(keyValue[0]);
                    queryManager.values[keyValue[0]] = keyValue[1];
                    queryManager.set(keyValue[0], keyValue[1]);
                }
            }
        },

        setHash: function (hash) {
            queryManager.hash = hash;
        },

        get: function (key) {
            queryManager.parseIncoming();
            return queryManager.values[key];
        },

        set: function (key, value) {

            const pos = queryManager.keys.indexOf(key);

            if (pos < 0) {
                queryManager.keys.push(key);
            }

            queryManager.values[key] = value;
        },

        reset: function (key) {

            const pos = queryManager.keys.indexOf(key);

            if (pos >= 0) {
                queryManager.keys.splice(pos, 1);
                delete queryManager.values[key];
            }
        },

        update: function () {

            let str = '';
            let title = 'Gallery Search';
            
            if (queryManager.keys.length) {
                title += ' (';
                for (let i = 0; i < queryManager.keys.length; i++) {
                    if (i > 0) {
                        str += "&";
                        title += ", ";
                    }
                    title += `${queryManager.keys[i]}=${queryManager.values[queryManager.keys[i]]}`;
                    str += queryManager.keys[i];
                    str += "=";
                    str += queryManager.values[queryManager.keys[i]];
                }
            }

            const query = `?${encodeURI(str)}`;
            const url = queryManager.baseUrl;
            const hash = queryManager.hash;
        
            const newState = {
                Title: `${title})`,
                Url: `${url}${query}${hash}`
            };

            window.location.hash = queryManager.hash;
            window.history.pushState(newState, newState.Title, newState.Url);           
        }
    };

    const filterManager = {

        refreshFilters: function () {

            $("div.card").each(function () {

                $(this).removeClass('d-none');

                if (signatureContext.selected === true &&
                    $(this).attr('data-signature') !== 'true') {
                    $(this).addClass('d-none');
                    return;
                }

                if (signatureContext.prints === true &&
                    $(this).attr('data-prints') !== 'true') {
                    $(this).addClass('d-none');
                    return;
                }

                if (searchContext.query && searchContext.query.length) {

                    let target = $(this).text().toLowerCase().trim();
                    let tags = $(this).attr('data-tags').toLowerCase().trim().split(',');

                    if (tags.indexOf(searchContext.query) < 0 &&
                        target.indexOf(searchContext.query) < 0) {
                        $(this).addClass('d-none');
                        return;
                    }
                }

                const scope = telescopeContext.selected;

                if (scope && scope.length) {

                    if ($(this).attr("data-telescope") !== scope) {
                        $(this).addClass("d-none");
                        return;
                    }

                }
            });

            $(".groupheader").each(function () {

                const group = $(this).attr("data-group");

                $(`div[data-group='${group}']`).removeClass("d-none");

                let visible = false;

                $(`.groupdetail[data-group='${group}']`).each(function () {
                    $(this).find("div.card").not(".d-none").each(function () {
                        visible = true;
                    });
                });

                if (!visible) {
                    $(`div[data-group='${group}']`).addClass("d-none");
                }
            });
        }
    };

    const signatureContext = {

        selected: false,
        prints: false,

        init: function () {

            const sig = queryManager.get("signature");
            const print = queryManager.get("prints");

            if (sig === "true") {
                $("#signature").prop("checked", true)
                signatureContext.filterSig(true, print === "true");
            }

            if (print === "true") {
                $("#prints").prop("checked", true)
                signatureContext.filterPrint(true);
            }
        },

        filterSig: function (sig) {

            signatureContext.selected = sig;

            queryManager.set("signature", sig);
            
            if (print !== true) {
                queryManager.update();
                filterManager.refreshFilters();
            }
        },

        filterPrint: function (print) {

            signatureContext.prints = print;

            queryManager.set("prints", print);
            queryManager.update();

            filterManager.refreshFilters();
        },

        resetSig: function () {

            signatureContext.selected = false;

            queryManager.reset("signature");
            queryManager.update();
            filterManager.refreshFilters();
        },

        resetPrint: function () {

            signatureContext.prints = false;

            queryManager.reset("prints");
            queryManager.update();
            filterManager.refreshFilters();
        }
    };

    const telescopeContext = {

        selected: null,

        init: function () {

            const scope = queryManager.get("telescope");

            $(".telescopeFilter").each(function () {
                const scopeFilter = $(this).text();
                $(this).on("click", function () {
                    telescopeContext.filterScope(scopeFilter);
                });
                $(this).removeAttr("disabled");
            });

            if (scope) {
                telescopeContext.filterScope(scope);
            }
        },

        filterScope: function (scope) {

            telescopeContext.selected = scope;

            queryManager.set("telescope", scope);
            queryManager.update();

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

            filterManager.refreshFilters();
        },

        resetScope: function (scope) {

            scope = scope || telescopeContext.selected;
            telescopeContext.selected = null;

            queryManager.reset("telescope");
            queryManager.update();

            $(".telescopeFilter").each(function () {

                $(this).removeAttr("disabled");

                if ($(this).html().indexOf(scope) >= 0) {
                    $(this).text(scope);
                }

                const scopeFilter = $(this).text();

                $(this).on("click", function () {
                    telescopeContext.filterScope(scopeFilter);
                });

            });

            filterManager.refreshFilters();
        }
    };

    const searchContext = {
        query: null,
        timer: null,

        doClear: function () {

            queryManager.reset("q");
            queryManager.update();

            $("#gallerySearch").val('');
            searchContext.query = null;
            searchContext.timer = null;

            filterManager.refreshFilters();
            $("#gallerySearch").focus();

        },

        doSearch: function () {

            searchContext.timer = null;

            if (searchContext.query && searchContext.query.length) {
                searchContext.clear = false;
                const term = searchContext.query;
                queryManager.set("q", term);
                queryManager.update();
                $("#gallerySearch").val(term);
            }
            else {
                queryManager.reset("q");
                queryManager.update();
            }

            filterManager.refreshFilters();
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

        $("#signature").on("click", function () {
            signatureContext.filterSig($(this).prop("checked"), '');
        });

        $("#prints").on("click", function () {
            signatureContext.filterPrint($(this).prop("checked"));
        });

        $("#clearBtn").on("click", function () {
            searchContext.doClear();
        });

        if (queryManager.get("q")) {
            let query = queryManager.get("q");
            setTimeout(function () {
                searchContext.query = query.toLowerCase().trim();
                searchContext.doSearch();
            });
        }

        telescopeContext.init();
        signatureContext.init();

        $("img").each(function () {
            const url = $(this).data("url");
            if (url) {
                $(this).attr("src", url);
            }
        });

        $("a").each(function () {
            const url = $(this).attr("href");
            if (url && url[0] === '#') {
                (function (a, hash) {
                    $(a).on("click", () => {
                        queryManager.setHash(hash);
                        queryManager.update();
                    });
                })($(this), url);
            }
        });

        if (window.location.hash.length < 2) {
            $("#gallerySearch").focus();
        }
    });
})();