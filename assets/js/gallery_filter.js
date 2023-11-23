---
layout: null
sitemap: false
---
    (async function () {

        await window.gallerydbpromise;

        (function (dom, db, queryManager) {

            const filterState = {
                simplify: false,
                limit: 20,
                limits: [10, 20, 50, 100, 200, 500, 99999],
                text: null,
                category: null,
                telescope: null,
                sortBy: 'weighted',
                sortAscending: false,
                signature: false,
                print: false,
                archive: false,
                filterExpanded: false
            };

            const filter = {
                refreshing: false,
                state: { ...filterState },
                lastText: null,
                simplify: dom.id('simplify'),
                filterShare: dom.id('filterShare'),
                resetBtn: dom.id('reset'),
                sort: dom.id('sortBy'),
                telescope: dom.id('telescope'),
                category: dom.id('categoryButtons'),
                categoryBtn: null,
                categoryButtons: {},
                text: dom.id('text'),
                signature: dom.id('signature'),
                print: dom.id('print'),
                archive: dom.id('archive'),
                expander: dom.id('filterExpand'),
                collapser: dom.id('filterCollapse'),
                filterExpanded: dom.id('filterExpanded'),
                sortToggle: dom.id('sortDir'),
                filterRefresh: dom.id('filterRefresh'),

                querySet: function (key, value, deferUpdate = false) {
                    if (filter.state[key] === filterState[key]) {
                        queryManager.reset(key);
                    } else {
                        queryManager.set(key, value);
                    }
                    if (deferUpdate !== true) {
                        queryManager.update("Gallery Search");
                    }
                },

                textChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    dom.resetRun("textChangedHook");
                    dom.runAfterMs(() => filter.textChangedHook(), 300, "textChangedHook");
                },

                textChangedHook: function () {
                    if (filter.refreshing) {
                        return;
                    }

                    let compare = filter.text.value.toLowerCase();

                    if (compare.length < 3) {
                        compare = null;
                    }

                    if (compare !== filter.state.text) {
                        filter.state.text = compare;
                        filter.querySet("text", filter.state.text ?? '');
                        app.refresh();
                    }
                },

                telescopeChanged: function (forceVal = null) {
                    if (filter.refreshing) {
                        return;
                    }
                    const val = forceVal ?? filter.telescope.value;
                    filter.state.telescope = val === 'all' ? null : val;
                    dom.setSelectedValue(filter.telescope, val);
                    filter.querySet("telescope", filter.state.telescope ?? 'all');
                    app.refresh();
                },

                categoryChanged: function (val) {
                    if (filter.refreshing) {
                        return;
                    }
                    if (val === "all") {
                        if (filter.categoryBtn) {
                            dom.modifyClasses(filter.categoryBtn, "-btn-success +btn-primary");
                            filter.categoryBtn = null;
                        }

                        filter.state.category = null
                    }
                    else if (filter.categoryBtn && filter.categoryBtn.innerText === val) {
                        dom.modifyClasses(filter.categoryBtn, "-btn-success +btn-primary");
                        filter.categoryBtn = null;
                        filter.state.category = null;
                    } else {
                        if (filter.categoryBtn) {
                            dom.modifyClasses(filter.categoryBtn, "-btn-success +btn-primary");
                        }
                        const button = filter.categoryButtons[val];
                        if (button) {
                            filter.state.category = val;
                            dom.modifyClasses(button, "-btn-primary +btn-success");
                            filter.categoryBtn = button;
                        }
                    }

                    filter.querySet("category", filter.state.category ?? 'all');
                    app.refresh();
                },

                sortChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.sortBy = filter.sort.value;
                    dom.setSelectedValue(filter.sort, filter.state.sortBy);
                    filter.querySet("sortBy", filter.state.sortBy);
                    app.refresh();
                },

                sortToggled: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.sortAscending = !filter.state.sortAscending;
                    filter.sortToggle.innerText = filter.state.sortAscending ? 'Asc' : 'Desc';
                    filter.querySet("sortAscending", filter.state.sortAscending);
                    app.refresh();
                },

                signatureChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.signature = filter.signature.checked;
                    filter.querySet("signature", filter.state.signature);
                    app.refresh();
                },

                printChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.print = filter.print.checked;
                    filter.querySet("print", filter.state.print);
                    app.refresh();
                },

                archiveChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.archive = filter.archive.checked;
                    filter.querySet("archive", filter.state.archive);
                    app.refresh();
                },

                simplifyChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.simplify = filter.simplify.checked;
                    filter.querySet("simplify", filter.state.simplify);
                    const targets = document.querySelectorAll("div.card-body");
                    for (let idx = 0; idx < targets.length; idx++) {
                        const target = targets[idx];
                        if (filter.state.simplify) {
                            dom.hide(target);
                        } else {
                            dom.show(target);
                        }
                    }   
                },

                expand: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    dom.show(filter.filterExpanded);
                    dom.hide(filter.expander);
                    filter.state.filterExpanded = true;
                },

                collapse: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    dom.hide(filter.filterExpanded);
                    dom.show(filter.expander);
                    filter.state.filterExpanded = false;
                },

                changeLimit: function (limit) {
                    if (filter.state.limits.includes(limit)
                        && !filter.refreshing
                        && filter.state.limit !== limit) {
                        filter.state.limit = limit;
                        filter.querySet("limit", limit);
                        app.refresh(true);
                    }
                },

                reset: function () {
                    filter.state = { ...filterState };
                    filter.refresh();
                    window.location.reload();
                },

                refresh: function () {
                    filter.querySet("limit", filter.state.limit, true);
                    filter.querySet("simplify", filter.state.simplify, true);
                    filter.querySet("text", filter.state.text ?? '', true);
                    filter.querySet("sortBy", filter.state.sortBy, true);
                    filter.querySet("telescope", filter.state.telescope ?? 'all', true);
                    filter.querySet("sortAscending", filter.state.sortAscending, true);
                    filter.querySet("category", filter.state.category ?? 'all', true);
                    filter.querySet("signature", filter.state.signature, true);
                    filter.querySet("print", filter.state.print, true);
                    filter.querySet("archive", filter.state.archive);
                },

                init: function () {

                    const sorts = db.getSorts();
                    const categories = db.getTypes();
                    const telescopes = db.getTelescopes();

                    const signature = queryManager.get("signature");
                    if (signature && signature.length) {
                        filter.state.signature = signature === 'true';
                    }

                    const print = queryManager.get("print");
                    if (print && print.length) {
                        filter.state.print = print === 'true';
                    }

                    const text = queryManager.get("text");
                    if (text && text.length) {
                        filter.state.text = text;
                    }

                    const archive = queryManager.get("archive");
                    if (archive && archive.length) {
                        filter.state.archive = archive === 'true';
                    }

                    const simplify = queryManager.get("simplify");
                    if (simplify && simplify.length) {
                        filter.state.simplify = simplify === 'true';
                    }

                    const sortByQuery = queryManager.get("sortBy");
                    if (sortByQuery && sortByQuery.length && sorts.includes(sortByQuery)) {
                        filter.state.sortBy = sortByQuery;
                    }

                    const telescopeQuery = queryManager.get("telescope");
                    if (telescopeQuery && telescopeQuery.length && (telescopes.includes(telescopeQuery)
                        || telescopeQuery === 'all')) {
                        filter.state.telescope = telescopeQuery === 'all' ? null : telescopeQuery;
                    }

                    const categoryQuery = queryManager.get("category");
                    if (categoryQuery && categoryQuery.length &&
                        (categories.includes(categoryQuery) || categoryQuery === 'all')) {
                        filter.state.category = categoryQuery === 'all' ? null : categoryQuery;
                    }

                    const filterLimitQuery = queryManager.get("limit");
                    if (filterLimitQuery
                        && filterLimitQuery.length
                        && filter.state.limits.includes(parseInt(filterLimitQuery))) {
                        filter.state.limit = parseInt(filterLimitQuery);
                    }

                    const sortAscendingQuery = queryManager.get("sortAscending");
                    if (sortAscendingQuery && sortAscendingQuery.length) {
                        filter.state.sortAscending = sortAscendingQuery === 'true';
                        filter.sortToggle.innerText = filter.state.sortAscending ? 'Asc' : 'Desc';
                    }

                    const options = dom.arrayToOptions(sorts, { selectedValue: filter.state.sortBy });
                    for (let idx = 0; idx < options.length; idx++) {
                        filter.sort.appendChild(options[idx]);
                    }

                    const choices = ['all', ...telescopes];
                    const telescopeOptions = dom.arrayToOptions(
                        choices, {
                        selectedValue: filter.state.telescope ?? 'all'
                    });
                    for (let idx = 0; idx < telescopeOptions.length; idx++) {
                        filter.telescope.appendChild(telescopeOptions[idx]);
                    }

                    const all = dom.elem("button", {
                        class: "btn btn-sm mr-1 mb-1 " +
                            (filter.state.category === "all" ? "btn-success" : "btn-primary"),
                        innerText: "All",
                        "onclick": () => filter.categoryChanged("all")
                    });
                    if (filter.state.category === "all") {
                        filter.categoryBtn = all;
                    }
                    filter.category.appendChild(all);
                    filter.categoryButtons["all"] = all;

                    for (let idx = 0; idx < categories.length; idx++) {
                        const category = categories[idx];
                        if (category && category.length) {
                            const option = dom.elem("button", {
                                class: "btn btn-sm mr-1 mb-1 " +
                                    (filter.state.category === category ? "btn-success" : "btn-primary"),
                                innerText: category,
                                "onclick": () => filter.categoryChanged(category)
                            });
                            filter.category.appendChild(option);
                            filter.categoryButtons[category] = option;
                        }
                    }

                    filter.resetBtn.addEventListener("click", () => filter.reset());
                    filter.telescope.addEventListener("change", () => filter.telescopeChanged());
                    filter.text.value = filter.state.text;
                    filter.text.addEventListener("keyup", () => filter.textChanged());
                    filter.signature.checked = filter.state.signature;
                    filter.signature.addEventListener("change", () => filter.signatureChanged());
                    filter.print.checked = filter.state.print;
                    filter.print.addEventListener("change", () => filter.printChanged());
                    filter.archive.checked = filter.state.archive;
                    filter.archive.addEventListener("change", () => filter.archiveChanged());
                    filter.simplify.checked = filter.state.simplify;
                    filter.simplify.addEventListener("change", () => filter.simplifyChanged());
                    filter.sort.addEventListener("change", () => filter.sortChanged());
                    filter.category.addEventListener("change", () => filter.categoryChanged());
                    filter.sortToggle.addEventListener("click", () => filter.sortToggled());
                    filter.expander.addEventListener("click", () => filter.expand());
                    filter.collapser.addEventListener("click", () => filter.collapse());

                    // share
                    if (navigator && navigator.share) {
                        const button = dom.elem("button", {
                            class: "btn btn-link",
                            title: "Share/save the current search",
                            innerHTML: `<i class="fas fa-share"></i> Share/save the current search`,
                            "onclick": function () {
                                navigator.share({
                                    title: document.title,
                                    text: "These are some astronomy photographs I'm interested in.",
                                    url: window.location.href
                                });
                            }
                        });
                        filter.filterShare.appendChild(button);
                    }

                    dom.hide(filter.filterExpanded);
                    dom.hide(filter.filterRefresh);
                    filter.refresh();
                }
            };

            const app = {

                lastImage: null,
                showMore: false,
                imageCount: 0,
                lucky: dom.id('lucky'),
                mainDiv: dom.id('galleryMain'),
                results: document.getElementsByClassName('card-deck')[0],
                template: dom.id('image-template').innerHTML,
                printUrl: dom.id('basePrintUrl').innerText,
                status: dom.id('status'),
                imageCache: {},

                refresh: function (limitChanged = false) {

                    if (limitChanged !== true) {
                        app.lastImage = null;
                    }

                    app.imageCount = 0;

                    const filterExpandedState = filter.state.filterExpanded;
                    filter.collapse();
                    dom.show(filter.filterRefresh);
                    app.results.innerHTML = '';

                    filter.refreshing = true;

                    dom.runNext(() => {

                        db.setSort(filter.state.sortBy, filter.state.sortAscending);
                        db.setPredicate();

                        if (filter.state.signature) {
                            db.addPredicate("signature", "eq", true);
                        }

                        if (filter.state.print) {
                            db.addPredicate("prints", "eq", true);
                        }

                        if (filter.state.category) {
                            db.addPredicate("type", "eq", filter.state.category);
                        }

                        if (filter.state.telescope) {
                            db.addPredicate("telescope", "eq", filter.state.telescope);
                        }

                        if (filter.state.text && filter.state.text.length > 2) {
                            db.addPredicate("text", "contains", filter.state.text);
                        }

                        db.addPredicate("archive", "eq", filter.state.archive);

                        const images = db.getItems(filter.state.limit);
                        app.showMore = db.showMore;
                        app.imageCount = images.length;
                        filter.refreshing = false;

                        for (let idx = 0; idx < images.length; idx++) {
                            const image = images[idx];
                            const date = image.converted.firstCapture === image.converted.lastCapture ?
                                image.firstCapture : `${image.firstCapture} - ${image.lastCapture}`;
                            const weight = Math.floor(image.weight.total * 100);
                            if (!app.imageCache[image.folder]) {
                                const html = app.template
                                    .replace('%div_id%', `div_${image.folder}`)
                                    .replace('%img_id%', `img_${image.folder}`)
                                    .replace('%title_id%', `ttl_${image.folder}`)
                                    .replace('%type_id%', `type_${image.folder}`)
                                    .replace('%content_id%', `con_${image.folder}`)
                                    .replace('%title%', image.title)
                                    .replace('%desc%', image.description)
                                    .replace('%date%', `<a name="${image.folder}"/><a href="#${image.folder}" title="Link to image result"><i class="fas fa-link"></i></a>&nbsp;<span class="badge badge-info" title="Weight">${weight}</span> ${date}`)
                                    .replace('%content%', 'stuff');
                                app.results.innerHTML += html;
                            } else {
                                app.results.innerHTML += `<span id="_${image.folder}">{{image.title}}</span>`;
                            }
                            dom.runNext(() => app.loadImage(image));
                        }

                        dom.runNext(() => {
                            const a = dom.elem("a", {
                                name: "bottom"
                            });
                            app.results.appendChild(a);
                        });

                        app.status.innerText = '';

                        dom.runNext(() => {
                            const span = dom.elem("span", {
                                innerHTML: `${db.lastOp} Limit results to: `
                            });
                            for (let idx = 0; idx < filter.state.limits.length; idx++) {
                                const limit = filter.state.limits[idx];
                                if (filter.state.limit === limit) {
                                    const s = dom.elem("span", {
                                        class: "badge badge-pill badge-success",
                                        innerHTML: limit
                                    });
                                    span.appendChild(s);
                                } else {
                                    const a = dom.elem("a", {
                                        class: "clickable w-auto badge badge-pill badge-primary",
                                        innerHTML: limit,
                                        onclick: () => filter.changeLimit(limit)
                                    });
                                    span.appendChild(a);
                                }
                                if (idx < filter.state.limits.length - 1) {
                                    span.appendChild(dom.elem("span", {
                                        innerHTML: ' | '
                                    }));
                                }
                            }

                            app.status.appendChild(span);
                        });

                        dom.hide(filter.filterRefresh);

                        if (filterExpandedState) {
                            filter.expand();
                        } else {
                            filter.collapse();
                        }
                    });
                },

                loadImage: function (image) {

                    const placeholder = dom.id(`_${image.folder}`);

                    if (placeholder) {
                        placeholder.replaceWith(app.imageCache[image.folder]);
                    }
                    else {
                        const makeSpan = (text, action) => dom.elem("span", {
                            innerHTML: text,
                            class: "clickable gallery-link",
                            onclick: action ? action : null,
                            title: action ? "Click to filter by this category" : null
                        });

                        const makeBreak = () => dom.elem("br");

                        const fullUrl = `${window.location.origin}/gallery/${image.folder}`;
                        const title = dom.id(`ttl_${image.folder}`);
                        title.href = fullUrl;

                        const img = dom.id(`img_${image.folder}`);
                        db.bindToItem(img, image.folder);
                        img.addEventListener("click", () => window.location.href = fullUrl);

                        const type = dom.id(`type_${image.folder}`);
                        type.innerHTML = '';

                        if (navigator && navigator.share) { 
                            const anchor = document.querySelectorAll(`a[href="#${image.folder}"]`)[0];
                            anchor.innerHTML = '<i class="fas fa-share"></i>';
                            anchor.title = "Share/save this image";
                            anchor.onclick = function () {
                                navigator.share({
                                    title: image.title,
                                    text: image.description,
                                    url: fullUrl
                                });
                            };
                        }

                        if (image.type && image.type.length) {
                            const categoryLabel = makeSpan(
                                `Category: ${image.type}`,
                                () => {
                                    if (filter.state.category !== image.type) {
                                        filter.categoryChanged(image.type);
                                    }
                                });
                            categoryLabel.title = "Click to filter by this category";
                            type.appendChild(categoryLabel);
                        }

                        let breakAfterCategory = false;

                        if (image.converted && image.converted.focalLength) {
                            breakAfterCategory = true;
                            type.appendChild(makeBreak());
                            type.appendChild(makeSpan(`&nbsp;<i class="fas fa-ruler" title="Focal Length"></i> ${image.converted.focalLength}mm`));
                        }

                        if (image.exposure && image.exposure.length) {
                            const lights = image.lights && image.lights.length ? parseInt(image.lights) : 1;
                            const exposure = lights * parseFloat(image.exposure);
                            if (exposure < 60) {
                                if (!breakAfterCategory) {
                                    type.appendChild(makeBreak());
                                }
                                type.appendChild(makeSpan(`&nbsp;<i class="fas fa-stopwatch" title="Exposure"></i> ${exposure}s`));
                            } else if (exposure < 3600) {
                                if (!breakAfterCategory) {
                                    type.appendChild(makeBreak());
                                }
                                type.appendChild(makeSpan(`&nbsp;<i class="fas fa-stopwatch" title="Exposure"></i> ${Math.round(exposure / 60)}m`));
                            } else {
                                if (!breakAfterCategory) {
                                    type.appendChild(makeBreak());
                                }
                                type.appendChild(makeSpan(`&nbsp;<i class="fas fa-stopwatch" title="Exposure"></i> ${Math.round(exposure / 3600)}h`));
                            }
                        }

                        if (image.telescope && image.telescope.length) {
                            type.appendChild(makeBreak());
                            const telescopeLabel = makeSpan(`&nbsp;<i class="fas fa-telescope" title="Telescope"></i> ${image.telescope}`,
                                () => {
                                    if (filter.state.telescope !== image.telescope) {
                                        filter.telescopeChanged(image.telescope);
                                    }
                                });
                            telescopeLabel.title = "Click to filter by this telescope";
                            type.appendChild(telescopeLabel);
                        }

                        const content = dom.id(`con_${image.folder}`);

                        const spacer = () => dom.elem("span", {
                            innerHTML: '&nbsp;|&nbsp;'
                        });

                        content.innerHTML = '';

                        if (image.signature === true) {
                            const span = dom.elem("span", {
                                class: "badge badge-pill badge-success",
                                innerHTML: 'Signature'
                            });
                            content.appendChild(span);
                            content.appendChild(spacer());
                        }

                        if (image.archive === true) {
                            const span = dom.elem("span", {
                                class: "badge badge-pill badge-warning",
                                innerHTML: 'Archived'
                            });
                            content.appendChild(span);
                            content.appendChild(spacer());
                        }

                        if (image.printUrl) {
                            const a = dom.elem("a", {
                                href: `${this.printUrl}${image.printUrl}`,
                                target: "_blank",
                                title: "Print",
                                innerHTML: '<i class="fas fa-print"></i> Order Print'
                            });
                            content.appendChild(a);
                            content.appendChild(spacer());
                        }

                        if (image.wwt) {
                            const a = dom.elem("a", {
                                href: image.wwt,
                                target: "_blank",
                                title: "View in WorldWide Telescope",
                                innerHTML: '<i class="fas fa-globe"></i> View in WorldWide Telescope'
                            });
                            content.appendChild(a);
                            content.appendChild(spacer());
                        }

                        const sortedTags = image.tags.sort((a, b) => b.length - a.length);
                        for (let idx = 0; idx < sortedTags.length && idx < 3; idx++) {
                            const tag = image.tags[idx];
                            const tagLink = tag.replace(/ /g, '-').replace(/\)/g, '').replace(/\(/g, '').toLowerCase();
                            const a = dom.elem("a", {
                                href: `${window.location.origin}/tag/${tagLink}`,
                                title: `View items related to tag '${tag}'`,
                                innerHTML: `<i class="fas fa-tag"></i> ${tag}`
                            });
                            content.appendChild(a);
                            content.appendChild(spacer());
                        }

                        const imgRef = dom.id(`img_${image.folder}`);
                        if (imgRef.naturalWidth > imgRef.naturalHeight) {
                            imgRef.style.maxWidth = '300px';
                            imgRef.style.maxHeight = 'auto';
                        } else {
                            imgRef.style.maxWidth = 'auto';
                            imgRef.style.maxHeight = '300px';
                        }

                        const a = dom.elem("a", {
                            class: "back-to-top",
                            "href": "#top",
                            "title": "Back to top",
                            "innerHTML": '<i class="fas fa-arrow-up"></i> Back to top'
                        });

                        content.appendChild(a);
                    }

                    app.imageCount--;

                    if (app.imageCount === 0) {

                        if (app.showMore) {
                            const limitIdx = filter.state.limits.indexOf(filter.state.limit);
                            if (limitIdx < filter.state.limits.length - 1) {
                                const limit = filter.state.limits[limitIdx + 1];
                                const a = dom.elem("a", {
                                    class: "back-to-top w-auto p-5 font-weight-bold",
                                    href: "#",
                                    title: "Show more",
                                    onclick: () => {
                                        dom.runNext(() => filter.changeLimit(limit));
                                        return false;
                                    },
                                    innerHTML: `<i class="fas fa-arrow-down"></i> Show more (${limit})`
                                });
                                app.results.appendChild(a);
                            }
                        }

                        const img = app.lastImage;
                        const imagesOnPage = document.querySelectorAll("img.card-img");
                        app.lastImage = imagesOnPage.length > 0
                            ? imagesOnPage[imagesOnPage.length - 1]
                            : null;
                        
                        if (img) {
                            dom.runNext(() => img.scrollIntoView(true));
                        }                          
                    }

                    dom.runNext(() =>
                        app.imageCache[image.folder] = dom.id(`div_${image.folder}`));
                }
            };

            app.lucky.addEventListener("click", () => {
                const image = db.getRandom();
                window.location.href = `${window.location.origin}/gallery/${image.folder}`;
            });

            filter.init();
            dom.runNext(app.refresh);

        })(window.ds_dom_helper, window.gallerydb, window.deepSkyRouter);
    })();