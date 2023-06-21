---
    layout: null
sitemap: false
---

    (async function () {

        await window.gallerydbpromise;

        (function (db, queryManager) {

            const help = { on: false };

            $("#helpIcon").click(() => {
                help.on = !help.on;
                if (help.on) {
                    $("#helpIcon").text("[-]");
                    $("#help").removeClass("d-none");
                }
                else {
                    $("#helpIcon").text("[+]");
                    $("#help").addClass("d-none");
                }
            });

            const welcome = {
                collapsed: $("#welcomeCollapsed"),
                expanded: $("#welcomeExpanded"),
                expandTrigger: $("#welcomeCollapsedExpand"),
                collapseTrigger: $("#welcomeExpandedCollapse"),                
                doCollapse: () => {                    
                    welcome.collapsed.removeClass("d-none");
                    welcome.expanded.addClass("d-none");
                },
                doExpand: () => {
                    welcome.collapsed.addClass("d-none");
                    welcome.expanded.removeClass("d-none");
                }
            };

            welcome.collapseTrigger.click(()=>welcome.doCollapse());
            welcome.expandTrigger.click(()=>welcome.doExpand());

            const debounceMs = 300;

            const defaultFilters = () =>
            ({
                "signature": true,
                "prints": false,
                "telescope": null,
                "filterText": "",
            });

            const domContext = {
                "signature": $("#signature"),
                "fullQuery": $("#fullQuery"),
                "filterOptions": $("#filterOptions"),
                "currentFilter": $("#currentFilter"),
                "prints": $("#prints"),
                "filterText": $("#gallerySearch"),
                "clearFilter": $("#clearBtn")
            };

            const defaultBtn = btn => {
                btn.removeClass("btn-primary");
                btn.addClass("btn-secondary");
                return;
            };

            const selectedBtn = btn => {
                btn.removeClass("btn-secondary");
                btn.addClass("btn-primary");
                return;
            };

            const filterManager = {

                lastFilter: null,
                lastButton: null,

                init: function () {

                    const parent = domContext.filterOptions;
                    var anyHasOption = false;

                    parent.html("");

                    filterContext.matrix = {};

                    const filters = [{
                        name: 'Reset',
                    }, {
                        name: "Type",
                        options: db.getTypes
                    }, {
                        name: 'Telescope',
                        options: db.getTelescopes
                    }, {
                        name: 'Exposure',
                        options: db.getExposures
                    }, {
                        name: 'FocalLength',
                        options: db.getFocalLengths
                    },
                    ];

                    domContext.currentFilter.html("");
                    let first = true;
                    filters.forEach((filter) => {

                        var hasOption = false;

                        if (filter.name === 'Reset') {

                            filterContext.matrix[filter.name] = {
                                lastOption: null,
                                selectedOption: null
                            };

                            const filterButton = document.createElement("button");
                            filterButton.classList.add("btn", "btn-warning");
                            filterButton.classList.add("btn", "text-red");
                            filterButton.classList.add("btn", "m-1");
                            defaultBtn($(filterButton));
                            filterButton.innerText = filter.name;
                            filterButton.addEventListener(
                                "click", () => location.href = db.makeAbsoluteUrl("/gallery"));
                            parent.append(filterButton);
                            return;
                        }

                        filterContext.matrix[filter.name] = {
                            lastOption: null,
                            selectedOption: null
                        };

                        const matrix = filterContext.matrix[filter.name];
                        const filterOptions = document.createElement("p");
                        const label = document.createElement("span");
                        label.textContent = `${filter.name}: `;
                        filterOptions.append(label);

                        const options = filter.options();

                        options.forEach((option) => {

                            if (option === NaN) {
                                return;
                            }

                            const optionButton = document.createElement("button");
                            defaultBtn($(optionButton));
                            optionButton.innerText = option;
                            if (filterContext.matrix
                                && filterContext.matrix[filter.name]
                                && filterContext.matrix[filter.name].selectedOption === option) {
                                selectedBtn($(optionButton));
                                if (!anyHasOption) {
                                    anyHasOption = true;
                                    hasOption = true;
                                }
                            }

                            (function (option, btn, filter) {

                                $(btn).click(() => {

                                    if (matrix.selectedOption === option) {
                                        matrix.selectedOption = null;
                                        defaultBtn($(matrix.lastOption));
                                        selectedBtn($(btn));
                                        matrix.lastOption = $(btn);
                                        queryManager.reset(filter.name);
                                    }
                                    else {
                                        matrix.selectedOption = option;
                                        queryManager.set(filter.name, option);
                                        if (matrix.lastOption) {
                                            defaultBtn($(matrix.lastOption));
                                        }
                                        matrix.lastOption = $(btn);
                                        selectedBtn($(btn));
                                    }
                                    queryManager.update("Gallery Search");
                                    filterContext.update();
                                });
                            })(option, optionButton, filter);
                            filterOptions.append(optionButton);
                        });
                        if (first) {
                            first = false;
                            filterManager.lastFilter = filterOptions;
                        }
                        else {
                            filterOptions.classList.add("d-none");
                        }
                        domContext.currentFilter.append(filterOptions);
                        const filterButton = document.createElement("button");
                        if (hasOption) {
                            selectedBtn($(filterButton));
                            hasOption = false;
                        }  else {
                            defaultBtn($(filterButton));
                        }
                        filterButton.innerText = filter.name;
                        (function (target, btn) {
                            filterButton.addEventListener("click", () => {
                                if (filterManager.lastFilter) {
                                    $(filterManager.lastFilter).addClass("d-none");
                                    defaultBtn($(filterManager.lastButton));
                                }
                                filterManager.lastFilter = target;
                                filterManager.lastButton = btn;
                                selectedBtn($(btn));                                
                                $(target).removeClass("d-none");
                            });
                        })(filterOptions, filterButton);
                        parent.append(filterButton);
                    });
                },

                refreshFilters: function () {

                    $("div.card").each(function () {
                        $(this).removeClass('d-none');
                        const key = $(this).attr("data-folder");
                        if (!(filterManager.items[key])) {
                            $(this).addClass('d-none');
                        }
                    });

                    $(".group-header").each(function () {

                        const group = $(this).attr("data-group");

                        const groupLink = `#link${group}`;

                        $(`.group-header[data-group='${group}']`).removeClass("d-none");

                        let visible = false;
                        let children = 0;

                        $(`.group-detail[data-group='${group}']`).not(".d-none").each(function () {
                                visible = true;
                                children++;
                        });

                        if (!visible) {
                            $(`.group-header[data-group='${group}']`).addClass("d-none");
                            $(`${groupLink}>a`).addClass("d-none");
                            $(`${groupLink}>span`).removeClass("d-none");
                        }
                        else {
                            $(`${groupLink}>a`).removeClass("d-none");
                            $(`${groupLink}>span`).addClass("d-none");
                            $(`.group-header[data-group='${group}'] p`)
                                .text(`${children} ${children === 1 ? "item" : "items"} in this group.`);
                        }
                    });
                }
            };

            const filterContext = {

                query: null,
                timer: null,

                items: {
                    list: [],
                },

                matrix: {},

                filters: defaultFilters(),

                filterSig: function (value) {
                    filterContext.filters.signature = !!value;
                    queryManager.set("signature", filterContext.filters.signature);
                    queryManager.update("Gallery Search");
                    filterContext.update();
                },

                filterPrints: function (value) {
                    filterContext.filters.prints = !!value;
                    queryManager.set("prints", filterContext.filters.prints);
                    queryManager.update("Gallery Search");
                    filterContext.update();
                },

                init: function () {

                    filterManager.init();

                    const sig = queryManager.get("signature");

                    if (sig && sig === "false") {
                        filterContext.filters.signature = false;
                    }
                    else {
                        domContext.signature.prop("checked", true)
                    }

                    const prints = queryManager.get("prints");

                    filterContext.filters.prints = prints && prints === "true";
                    if (filterContext.filters.prints) {
                        domContext.prints.prop("checked", filterContext.filters.prints);
                    }

                    const q = queryManager.get("q");

                    if (q && q.length) {
                        filterContext.query = q;
                        domContext.filterText.val(q);
                    }

                    const filters = filterContext.matrix;
                    for (let filter in filters) {
                        const value = queryManager.get(filter);
                        if (value && value.length) {
                            filters[filter].selectedOption = value;
                        }
                    }

                    filterContext.update();
                },

                update: function (title) {

                    title = title || "Gallery Search";

                    db.setPredicate();

                    if (filterContext.filters.signature) {
                        db.addPredicate("signature", "eq", true);
                    }

                    if (filterContext.filters.prints) {
                        db.addPredicate("prints", "eq", true);
                    }

                    if (filterContext.query && filterContext.query.length) {
                        db.addPredicate("text", "contains", filterContext.query);
                    }

                    for (filter in filterContext.matrix) {
                        const matrix = filterContext.matrix[filter];
                        if (matrix.selectedOption && matrix.selectedOption !== "") {
                            db.addPredicate(filter.toLowerCase(), "eq", matrix.selectedOption);
                        }
                    }

                    filterManager.items = {
                        list: db.getItems(9999),
                    };

                    title = `${title} - ${db.lastOp}`;

                    for (let idx = 0; idx < filterManager.items.list.length; idx++) {
                        const item = filterManager.items.list[idx];
                        filterManager.items[item.folder] = item;
                    }

                    document.title = title;
                    domContext.fullQuery.text(title);
                    filterManager.refreshFilters();
                },

                doClear: function () {

                    queryManager.reset("q");
                    queryManager.update();

                    $(domContext.filterText).val('');
                    filterContext.query = null;
                    filterContext.timer = null;

                    filterContext.update();
                    $(domContext.filterText).focus();
                },

                doSearch: function () {

                    filterContext.timer = null;

                    if (filterContext.query && filterContext.query.length) {
                        filterContext.clear = false;
                        const term = filterContext.query;
                        queryManager.set("q", term);
                        $(domContext.filterText).val(term);
                    }
                    else {
                        queryManager.reset("q");
                    }

                    queryManager.update();
                    filterContext.update();
                }
            };

            $(document).ready(function () {

                // setup filter
                $(domContext.filterText).on(
                    "input",
                    function () {
                        filterContext.query = $(this).val().toLowerCase().trim();
                        if (filterContext.timer) {
                            clearTimeout(filterContext.timer);
                        }
                        filterContext.timer = setTimeout(filterContext.doSearch, debounceMs);
                    });

                domContext.signature.on(
                    "click",
                    () => filterContext.filterSig(domContext.signature.prop("checked")));

                domContext.prints.on(
                    "click",
                    () => filterContext.filterPrints(domContext.prints.prop("checked")));

                domContext.clearFilter.on("click", () => filterContext.doClear());

                if (queryManager.get("q")) {
                    let query = queryManager.get("q");
                    setTimeout(function () {
                        filterContext.query = query.toLowerCase().trim();
                        filterContext.doSearch();
                    });
                }

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

                filterContext.init();
            });
        })(window.gallerydb, window.deepSkyRouter);
    })();