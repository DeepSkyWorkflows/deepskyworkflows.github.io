---
layout: null
sitemap: false
---

    (async function () {

        await window.gallerydbpromise;

        (function (db, queryManager) {

            const filter = {
                refreshing: false,
                state: {
                    text: null,
                    category: null,
                    telescope: null,
                    sort: 'lastCapture',
                    sortAscending: false,
                    signature: false,
                    print: false,
                    archive: false,
                    filterExpanded: false
                },
                lastText: null,
                resetBtn: document.getElementById('reset'),
                sort: document.getElementById('sortBy'),
                telescope: document.getElementById('telescope'),
                category: document.getElementById('categoryButtons'),
                categoryBtn: null,
                categoryButtons: {},
                text: document.getElementById('text'),
                signature: document.getElementById('signature'),
                print: document.getElementById('print'),
                archive: document.getElementById('archive'),
                expander: document.getElementById('filterExpand'),
                collapser: document.getElementById('filterCollapse'),
                filterExpanded: document.getElementById('filterExpanded'),
                sortToggle: document.getElementById('sortDir'),
                filterRefresh: document.getElementById('filterRefresh'),

                textChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    if (filter.lastText) {
                        clearTimeout(filter.lastText);                        
                    }
                    filter.lastText = setTimeout(() => filter.textChangedHook(), 300);
                },

                textChangedHook: function () {
                    filter.lastText = null;
                    if (filter.refreshing) {
                        return;
                    }
                    
                    let compare = filter.text.value.toLowerCase();
                    if (compare.length < 3) {
                        compare = null;
                    }
                    
                    if (compare !== filter.state.text) {
                        filter.state.text = compare;
                        queryManager.set("text", filter.state.text ?? '');
                        queryManager.update("Gallery Search");
                        app.refresh();                        
                    }
                },

                telescopeChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.telescope = filter.telescope.value === 'all' 
                        ? null 
                        : filter.telescope.value;                    
                    queryManager.set("telescope", filter.state.telescope ?? 'all');
                    queryManager.update("Gallery Search");
                    app.refresh();
                },

                categoryChanged: function (val) {
                    if (filter.refreshing) {
                        return;
                    }
                    if (val === "all") {
                        if (filter.categoryBtn) {
                            filter.categoryBtn.classList.remove('btn-success');
                            filter.categoryBtn.classList.add('btn-primary');
                            filter.categoryBtn = null;
                        }

                        filter.state.category = null
                    }
                    else if (filter.categoryBtn && filter.categoryBtn.innerText === val) {
                        filter.categoryBtn.classList.remove('btn-success');
                        filter.categoryBtn.classList.add('btn-primary');
                        filter.categoryBtn = null;
                        filter.state.category = null;
                    } else {
                        if (filter.categoryBtn) {
                            filter.categoryBtn.classList.remove('btn-success');
                            filter.categoryBtn.classList.add('btn-primary');
                        }
                        const button = filter.categoryButtons[val];
                        if (button) {
                            filter.state.category = val;
                            button.classList.remove('btn-primary');
                            button.classList.add('btn-success');
                            filter.categoryBtn = button;
                        }
                    }

                    queryManager.set("category", filter.state.category ?? 'all');
                    queryManager.update("Gallery Search");
                    app.refresh();
                },

                sortChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.sort = filter.sort.value;
                    queryManager.set("sortBy", filter.state.sort);
                    queryManager.update("Gallery Search");
                    app.refresh();
                },

                sortToggled: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.sortAscending = !filter.state.sortAscending;
                    filter.sortToggle.innerText = filter.state.sortAscending ? 'Asc' : 'Desc';
                    queryManager.set("sortAscending", filter.state.sortAscending);
                    queryManager.update("Gallery Search");
                    app.refresh();
                },

                signatureChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.signature = filter.signature.checked;
                    queryManager.set("signature", filter.state.signature);
                    queryManager.update("Gallery Search");
                    app.refresh();
                },

                printChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.print = filter.print.checked;
                    queryManager.set("print", filter.state.print);
                    queryManager.update("Gallery Search");
                    app.refresh();
                },

                archiveChanged: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.state.archive = filter.archive.checked;
                    queryManager.set("archive", filter.state.archive);
                    queryManager.update("Gallery Search");
                    app.refresh();
                },

                expand: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.filterExpanded.classList.remove('d-none');
                    filter.expander.classList.add('d-none');
                    filter.state.filterExpanded = true;
                },

                collapse: function () {
                    if (filter.refreshing) {
                        return;
                    }
                    filter.filterExpanded.classList.add('d-none');
                    filter.expander.classList.remove('d-none');
                    filter.state.filterExpanded = false;
                },

                reset: function () {
                    filter.state.text = null;
                    filter.state.category = null;
                    filter.state.telescope = null;
                    filter.state.sort = 'lastCapture';
                    filter.state.sortAscending = false;
                    filter.state.signature = false;
                    filter.state.print = false;
                    filter.state.archive = false;
                    filter.refresh();
                    window.location.reload();
                },

                refresh: function () {
                    queryManager.set("text", filter.state.text ?? '');
                    queryManager.set("sortBy", filter.state.sort);
                    queryManager.set("telescope", filter.state.telescope ?? 'all');
                    queryManager.set("sortAscending", filter.state.sortAscending);
                    queryManager.set("category", filter.state.category ?? 'all');
                    queryManager.set("signature", filter.state.signature);
                    queryManager.set("print", filter.state.print);
                    queryManager.set("archive", filter.state.archive);
                    queryManager.update("Gallery Search");
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

                    const sortByQuery = queryManager.get("sortBy");
                    if (sortByQuery && sortByQuery.length && sorts.includes(sortByQuery)) {
                        filter.state.sort = sortByQuery;
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

                    const sortAscendingQuery = queryManager.get("sortAscending");
                    if (sortAscendingQuery && sortAscendingQuery.length) {
                        filter.state.sortAscending = sortAscendingQuery === 'true';
                        filter.sortToggle.innerText = filter.state.sortAscending ? 'Asc' : 'Desc';
                    }

                    for (let idx = 0; idx < sorts.length; idx++) {
                        const sort = sorts[idx];
                        const option = document.createElement("option");
                        option.setAttribute("value", sort);
                        if (sort === filter.state.sort) {
                            option.setAttribute("selected", "selected");
                        }
                        option.innerText = sort;
                        filter.sort.appendChild(option);
                    }

                    const scopeAll = document.createElement("option");
                    scopeAll.setAttribute("value", "all");
                    scopeAll.innerText = "All";
                    if (filter.state.telescope === null) {
                        scopeAll.setAttribute("selected", "selected");
                    }
                    filter.telescope.appendChild(scopeAll);
                    for (let idx = 0; idx < telescopes.length; idx++) {
                        const telescope = telescopes[idx];
                        if (telescope && telescope.length) {
                            const option = document.createElement("option");
                            option.setAttribute("value", telescope);
                            if (telescope === filter.state.telescope) {
                                option.setAttribute("selected", "selected");
                            }
                            option.innerText = telescope;
                            filter.telescope.appendChild(option);
                        }
                    }

                    const all = document.createElement("button");
                    all.classList.add("btn");
                    all.classList.add("btn-sm");
                    all.classList.add("mr-1");
                    all.classList.add("mb-1");
                    all.classList.add(filter.state.category === "all" ? "btn-success" : "btn-primary");
                    if (filter.state.category === "all") {
                        filter.categoryBtn = all;
                    }
                    all.addEventListener("click", () => filter.categoryChanged("all"));
                    all.innerText = "All";
                    filter.category.appendChild(all);
                    filter.categoryButtons["all"] = all;
                    for (let idx = 0; idx < categories.length; idx++) {
                        const category = categories[idx];
                        if (category && category.length) {
                            const option = document.createElement("button");
                            option.innerText = category;
                            option.classList.add("btn");
                            option.classList.add("btn-sm");
                            option.classList.add("mr-1");
                            if (category === filter.state.category) {
                                filter.categoryBtn = option;
                                option.classList.add("btn-success");
                            } else {
                                option.classList.add("btn-primary");
                            }
                            option.addEventListener("click", () => filter.categoryChanged(category));
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
                    filter.sort.addEventListener("change", () => filter.sortChanged());
                    filter.category.addEventListener("change", () => filter.categoryChanged());
                    filter.sortToggle.addEventListener("click", () => filter.sortToggled());
                    filter.expander.addEventListener("click", () => filter.expand());
                    filter.collapser.addEventListener("click", () => filter.collapse());
                    filter.filterExpanded.classList.add('d-none');
                    filter.filterRefresh.classList.add('d-none');
                    filter.refresh();                    
                }
            };

            const app = {
                lucky: document.getElementById('lucky'),
                mainDiv: document.getElementById('galleryMain'),
                results: document.getElementsByClassName('card-deck')[0],
                template: document.getElementById('image-template').innerHTML,
                printUrl: document.getElementById('basePrintUrl').innerText,
                status: document.getElementById('status'),
                imageCache: {},

                refresh: function () {

                    const filterExpandedState = filter.state.filterExpanded;
                    filter.collapse();
                    filter.filterRefresh.classList.remove('d-none');
                    app.results.innerHTML = '';

                    filter.refreshing = true;

                    setTimeout(() => {

                        db.setSort(filter.state.sort, filter.state.sortAscending);
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

                        if  (filter.state.text && filter.state.text.length > 2) {
                            db.addPredicate("text", "contains", filter.state.text);
                        }

                        db.addPredicate("archive", "eq", filter.state.archive);

                        const images = db.getItems(9999);

                        filter.refreshing = false;

                        for (let idx = 0; idx < images.length; idx++) {
                            const image = images[idx];
                            const date = image.converted.firstCapture === image.converted.lastCapture ?
                                image.firstCapture : `${image.firstCapture} - ${image.lastCapture}`;
                            if (!app.imageCache[image.folder]) {
                                const html = app.template
                                    .replace('%div_id%', `div_${image.folder}`)
                                    .replace('%img_id%', `img_${image.folder}`)
                                    .replace('%title_id%', `ttl_${image.folder}`)
                                    .replace('%type_id%', `type_${image.folder}`)
                                    .replace('%content_id%', `con_${image.folder}`)
                                    .replace('%title%', image.title)
                                    .replace('%desc%', image.description)
                                    .replace('%date%', date)
                                    .replace('%content%', 'stuff');
                                app.results.innerHTML += html;
                            } else {
                                app.results.innerHTML += `<span id="_${image.folder}">{{image.title}}</span>`;
                            }
                            setTimeout(() => app.loadImage(image));
                        }

                        app.status.innerText = db.lastOp;

                        filter.filterRefresh.classList.add('d-none');
                        if (filterExpandedState) {
                            filter.expand();
                        } else {
                            filter.collapse();
                        }
                    });
                },

                loadImage: function (image) {

                    const placeholder = document.getElementById(`_${image.folder}`);

                    if (placeholder) {
                        placeholder.replaceWith(app.imageCache[image.folder]);
                        return;
                    }

                    const makeSpan = (text, action) => {
                        const span = document.createElement("span");
                        span.innerHTML = text;
                        if (action) {
                            span.classList.add("clickable");
                            span.classList.add("gallery-link");
                            span.addEventListener("click", action);
                            span.attributes["title"] = "Click to filter by this category";
                        }
                        return span;
                    };

                    const makeBreak = () => document.createElement("br");

                    const fullUrl = `${window.location.origin}/gallery/${image.folder}`;
                    const title = document.getElementById(`ttl_${image.folder}`);

                    title.addEventListener("click", () => window.location.href = fullUrl);

                    const img = document.getElementById(`img_${image.folder}`);
                    db.bindToItem(img, image.folder);
                    img.addEventListener("click", () => window.location.href = fullUrl);

                    const type = document.getElementById(`type_${image.folder}`);
                    type.innerHTML = '';

                    if (image.type && image.type.length) {
                        type.appendChild(
                            makeSpan(
                                `Category: ${image.type}`,
                                () => filter.categoryChanged(image.type)));
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
                        type.appendChild(
                            makeSpan(`&nbsp;<i class="fas fa-binoculars" title="Telescope"></i> ${image.telescope}`));
                    }                                               

                    const content = document.getElementById(`con_${image.folder}`);

                    const spacer = () => {
                        const span = document.createElement("span");
                        span.innerHTML = '&nbsp;|&nbsp;';
                        return span;
                    };

                    content.innerHTML = '';

                    if (image.signature === true) {
                        const span = document.createElement("span");
                        span.setAttribute("class", "badge badge-pill badge-success");
                        span.innerHTML = 'Signature';
                        content.appendChild(span);
                        content.appendChild(spacer());
                    }

                    if (image.archive === true) {
                        const span = document.createElement("span");
                        span.setAttribute("class", "badge badge-pill badge-warning");
                        span.innerHTML = 'Archived';
                        content.appendChild(span);
                        content.appendChild(spacer());
                    }

                    if (image.printUrl) {
                        const a = document.createElement("a");
                        a.setAttribute("href", `${this.printUrl}${image.printUrl}`);
                        a.setAttribute("target", "_blank");
                        a.setAttribute("title", "Print");
                        a.innerHTML = '<i class="fas fa-print"></i> Order Print';
                        content.appendChild(a);
                        content.appendChild(spacer());
                    }

                    if (image.wwt) {
                        const a = document.createElement("a");
                        a.setAttribute("href", image.wwt);
                        a.setAttribute("target", "_blank");
                        a.setAttribute("title", "View in WorldWide Telescope");
                        a.innerHTML = `<i class="fas fa-globe"></i> View in WorldWide Telescope`;
                        content.appendChild(a);
                        content.appendChild(spacer());
                    }

                    const sortedTags = image.tags.sort((a, b) => b.length - a.length);
                    for (let idx = 0; idx < sortedTags.length && idx < 3; idx++) {
                        const tag = image.tags[idx];
                        const tagLink = tag.replace(/ /g, '-').replace(/\)/g, '').replace(/\(/g, '').toLowerCase();
                        const a = document.createElement("a");
                        a.setAttribute("href", `${window.location.origin}/tag/${tagLink}`);
                        a.setAttribute("title", `View items related to tag '${tag}'`);
                        a.innerHTML = `<i class="fas fa-tag"></i> ${tag}`;
                        content.appendChild(a);
                        content.appendChild(spacer());
                    }

                    const imgRef = document.getElementById(`img_${image.folder}`);
                    if (imgRef.naturalWidth > imgRef.naturalHeight) {
                        imgRef.style.maxWidth = '300px';
                        imgRef.style.maxHeight = 'auto';
                    } else {
                        imgRef.style.maxWidth = 'auto';
                        imgRef.style.maxHeight = '300px';
                    }

                    const a = document.createElement("a");
                    a.setAttribute("href", "#top");
                    a.setAttribute("title", "Back to top");
                    a.innerHTML = '<i class="fas fa-arrow-up"></i> Back to top';
                    content.appendChild(a);
                    setTimeout(() =>
                        app.imageCache[image.folder] = document.getElementById(`div_${image.folder}`));
                }
            };

            app.lucky.addEventListener("click", () => {
                const image = db.getRandom();
                window.location.href = `${window.location.origin}/gallery/${image.folder}`;
            });
            
            filter.init();
            setTimeout(app.refresh);

        })(window.gallerydb, window.deepSkyRouter);
    })();