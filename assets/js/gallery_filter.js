const pageScript = (domHelper, db, router, pubsub) => {

    const resultLimits = [10, 20, 50, 100, 250, 500, 1000, 10000];

    const nextLimit = limit => {
        for (let idx = 0; idx < resultLimits.length; idx++) {
            if (resultLimits[idx] > limit) {
                return resultLimits[idx];
            }
        }
        return 10000;
    }

    const galleryState = {
        sort: null,
        sortAscending: false,
        signatureOnly: false,
        showMore: false,
        lastText: null,
        telescope: null,
        category: null,
        printOnly: false,
        includeArchived: false,
        simplify: false,
        images: null,
        resultsLimit: 10,
        printUrl: window.dsw.galleryhome,
        sortList: []
    };

    const galleryDom = {
        sigCheck: domHelper.id("signatureOnly"),
        sigText: domHelper.id("signatureCbState"),
        printCheck: domHelper.id("printOnly"),
        printText: domHelper.id("printCbState"),
        archiveCheck: domHelper.id("includeArchived"),
        archiveText: domHelper.id("archiveCbState"),
        simplifyCheck: domHelper.id("simplifyToggle"),
        simplifyText: domHelper.id("simplifyCbState"),
        filters: domHelper.class("filterWrapper")[0],
        sortDirection: domHelper.class("sortDirection")[0],
        category: domHelper.id("category"),
        telescope: domHelper.id("telescope"),
        searchText: domHelper.id("searchText"),
        results: domHelper.class("results")[0],
        lucky: domHelper.id("btnLucky"),
        refresh: domHelper.id("btnRefresh"),
        sortSelector: domHelper.id("sort"),
        reset: domHelper.id("btnReset"),
        slideshow: domHelper.id("btnSlideshow"),
        specialSelect: domHelper.id("selectSpecial"),
        spinner: domHelper.class("init")[0],
        domCache: {}
    };

    galleryDom.shareData = item => {
        return {
            title: item.title,
            url: `/gallery/${item.folder}`,
            text: item.description
        };
    };

    galleryDom.share = async item => {
        if (navigator && navigator.share) {
            await navigator.share(galleryDom.shareData(item));
        }
    };

    galleryDom.createFlags = item => {

        const result = [];

        if (item.signature === true) {
            result.push(domHelper.elem("a", {
                href: "?signature=true",
                title: "Part of the signature series. Tap to filter by signature."
            }, [domHelper.elem("span", {
                class: "badge badge-success",
                innerText: "Signature",
                title: "This image is part of our signature series."
            })]));
        }

        if (item.archive === true) {
            result.push(domHelper.elem("a", {
                href: "?archive=true",
                title: "Archived item."
            }, [domHelper.elem("span", {
                class: "badge badge-warning",
                innerText: "Archived",
                title: "This image is archived."
            })]));
        }

        if (item.printUrl && item.printUrl.length > 0 && galleryState.printUrl) {
            result.push(domHelper.elem("a", {
                href: `${galleryState.printUrl}${item.printUrl}`,
                title: "View details about the physical print of this image"
            }, [domHelper.elem("span", {
                class: "badge badge-primary",
                innerText: "Print",
                title: "This image is available as a physical print."
            })]));
        }

        if (item.converted && item.converted.focalLength > 0) {
            result.push(domHelper.elem("span", {
                innerHTML:
                    `<i class='fa fa-eye'></i>Focal length: ${item.converted.focalLength}mm`,
                title: "Focal length"
            }));
        }

        if (item.exposure && item.exposure.length) {
            const lights = item.lights && item.lights.length ? parseInt(item.lights) : 1;
            const exposure = lights * parseFloat(item.exposure);
            const icon = "<i class='fa fa-clock-o' title='Exposure'></i>";
            if (exposure < 60) {
                result.push(domHelper.elem("span", {
                    innerHTML: `${icon} Exposure: ${Math.round(exposure)}s`
                }));
            } else if (exposure < 3600) {
                result.push(domHelper.elem("span", {
                    innerHTML: `${icon} Exposure: ${Math.round(exposure / 60)}m`
                }));
            } else {
                let hours = Math.round(exposure / 3600);
                let minutes = Math.round((exposure % 3600) / 60);
                let seconds = Math.round(exposure % 60);
                result.push(domHelper.elem("span", {
                    innerHTML: `${icon} Exposure: ${hours}h ${minutes}m ${seconds}s`
                }));
            }
        }

        if (item.wwt && item.wwt.length) {
            result.push(domHelper.elem("a", {
                href: item.wwt,
                title: "View this image in the World Wide Telescope"
            }, [
                domHelper.elem("i", {
                    class: "fa fa-globe",
                    title: "View this image in the World Wide Telescope"
                }),
                domHelper.elem("span", {
                    innerText: "World Wide Telescope"
                })
            ]));
        }

        for (let idx = 0; idx < item.tags.length && idx < 6; idx++) {
            const tag = item.tags[idx];
            result.push(domHelper.elem("a", {
                href: `/tag/${tag}`,
                title: `Show content for tag: ${tag}`
            }, [domHelper.elem("span", {
                class: "badge badge-info",
                innerHTML: `<i class="fa fa-tag"></i>${tag}`
            })]));
        }

        return result;
    };

    galleryDom.createSimpleResult = item => domHelper.elem("li", {}, [
        domHelper.elem("img", {
            src: `/assets/images/gallery/${item.folder}/thumb.jpg`,
            alt: item.title
        }),
        domHelper.elem("div", { class: "overlay" }, [
            domHelper.elem("span", { innerText: item.title })
        ])
    ]);

    galleryDom.createResult = item => domHelper.elem("div", {
        class: "gallery-result"
    }, [
        domHelper.elem("h3", {
            innerText: item.title
        }, [
            domHelper.elem("a", {
                href: `/gallery/${item.folder}`,
                title: `View ${item.title} in the gallery`
            })
        ]),
        domHelper.elem("a", {
            href: `/gallery/${item.folder}`,
            title: `View ${item.title} in the gallery`
        }, [domHelper.elem("img", {
            "data-src": `/assets/images/gallery/${item.folder}/thumb.jpg`,
            src: "/assets/images/loading.gif",
            alt: item.title
        })]),
        domHelper.elem("small", { innerText: item.lastCapture }),

        domHelper.elem("p", {}, [
            domHelper.elem("span", { innerText: "Category: " }),
            domHelper.elem("a", {
                href: `?category=${item.type}`,
                title: `Filter by category: ${item.type}`,
                innerText: item.type
            }),
            domHelper.elem("span", {
                innerHTML: "&nbsp;",
                class: "fa fa-bincoluars"
            }),
            domHelper.elem("span", { innerText: "  Telescope: " }),
            domHelper.elem("a", {
                href: `?telescope=${item.telescope}`,
                title: `Filter by telescope: ${item.telescope}`,
                innerText: item.telescope
            })]),

        domHelper.elem("p", {
            class: "description",
            innerText: item.description
        }),

        domHelper.elem("p", { class: "flags" }, galleryDom.createFlags(item)),

        domHelper.elem("div", { class: "gallery-footer" },
            [
                domHelper.elem("a", {
                    href: "#dsw-top",
                    innerHTML: "<i class='fa fa-chevron-up'></i>Back to top"
                }),
                domHelper.elem("p", {
                    class: "share",
                    innerHTML: "<i class='fa fa-share'></i> Share"
                })
            ])
    ]);

    galleryDom.generateResult = item => {
        if (galleryDom.domCache[item.folder]) {
            return galleryDom.domCache[item.folder];
        }
        const result = galleryDom.createResult(item);
        galleryDom.domCache[item.folder] = result;
        return result;
    }

    domHelper.show(galleryDom.filters);
    domHelper.message(galleryDom.spinner, "success", "Waiting for query.");

    galleryDom.lucky.removeAttribute("disabled");

    galleryDom.lucky.addEventListener("click", () => {
        const item = db.getRandom();
        const url = `/gallery/${item.folder}`;
        location.href = url;
    });

    galleryDom.refresh.addEventListener("click", () => {
        galleryState.search(false);
    });

    galleryDom.reset.addEventListener("click", () => {
        location.href = "/gallery";
    });

    galleryDom.slideshow.addEventListener("click", () => {
        const images = 
            galleryState.images.map(i => `/assets/images/gallery/${i.folder}/${i.folder}.jpg`);
        if (localStorage && localStorage.setItem) {
            localStorage.setItem("slideshow", JSON.stringify(images));
        }
        location.href = "/gallery/slideshow";
    });

    galleryState.search = (refresh = true) => {

        if (refresh) {

            db.setSort(galleryState.sort, galleryState.sortAscending);
            db.setPredicate();

            const searchText = galleryDom.searchText.value.trim();

            if (searchText && searchText.length > 0) {
                db.addPredicate("text", "contains", searchText);
            }

            if (galleryState.signatureOnly) {
                db.addPredicate("signature", "eq", true);
            }

            if (galleryState.printOnly) {
                db.addPredicate("prints", "eq", true);
            }

            if (galleryState.category && galleryState.category.length > 0
                && galleryState.category !== "All") {
                db.addPredicate("type", "eq", galleryState.category);
            }

            if (galleryState.telescope && galleryState.telescope.length > 0
                && galleryState.telescope !== "All"
            ) {
                db.addPredicate("telescope", "eq", galleryState.telescope);
            }

            db.addPredicate("archive", "eq", galleryState.includeArchived);

            galleryState.images = db.getItems(9999);
        }

        domHelper.message(galleryDom.spinner, "success", db.lastOp);
        galleryDom.results.innerHTML = "";

        if (galleryState.simplify) {
            galleryDom.results.appendChild(domHelper.elem("ul", {
                class: "image-gallery"
            }, galleryState.images.map(galleryDom.createSimpleResult)));
            const images = galleryDom.results.getElementsByTagName("div");
            for (let idx = 0; idx < images.length; idx++) {
                const image = images[idx];
                image.addEventListener("click", () => {
                    const folder = galleryState.images[idx].folder;
                    location.href = `/gallery/${folder}`;
                });
            }
        }

        const queue = [];

        let lastTile = null;

        for (let idx = 0; idx < galleryState.images.length
            && idx < galleryState.resultsLimit; idx++) {
            const dbImage = galleryState.images[idx];
            if (!galleryState.simplify) {
                const imageTile = galleryDom.createResult(dbImage);
                lastTile = imageTile;
                const imageInTile = imageTile.getElementsByTagName("img")[0];
                const share = imageTile.getElementsByClassName("share")[0];
                const h3 = imageTile.getElementsByTagName("h3")[0];
                galleryDom.results.appendChild(imageTile);
                (function (f) {
                    domHelper.runNext(() => db.bindToItem(imageInTile, f.folder));
                    share.addEventListener("click", () => galleryDom.share(f));
                    h3.addEventListener("click", () => location.href = `/gallery/${f.folder}`);
                })(dbImage);
            }
            queue.push(`/assets/images/gallery/${dbImage.folder}/${dbImage.folder}.jpg`);
        }

        if (galleryState.resultsLimit < galleryState.images.length) {
            const more = domHelper.elem("button", {
                class: "btn btn-primary",
                type: "button",
                innerText: "Show more",
                onclick: () => {
                    const next = nextLimit(galleryState.resultsLimit);
                    galleryState.resultsLimit = next;
                    router.set("limit", galleryState.resultsLimit);
                    router.update();
                    galleryState.search(false);
                    setTimeout(() => lastTile.scrollIntoView());
                }
            });
            galleryDom.results.appendChild(more);
        }

        pubsub.publish("imageContext", queue);
    };

    const sortHtml = () => galleryState.sortAscending ?
        "<span class='fa fa-arrow-up' title='Sorted ascending. Click to toggle.'></span>" :
        "<span class='fa fa-arrow-down' title='Sorted descending. Click to toggle.'></span>";

    galleryState.images = db.getItem(20);
    galleryState.sortList = db.getSorts();
    galleryState.sort = router.get("sortBy") || "weighted";
    galleryState.sortAscending = router.get("sortAscending") === "true";
    galleryState.lastText = router.get("text");
    galleryState.signatureOnly = router.get("signature") === "true";
    galleryState.printOnly = router.get("print") === "true";
    galleryState.includeArchived = router.get("archive") === "true";
    galleryState.simplify = router.get("simplify") === "true";
    galleryState.resultsLimit = router.get("limit") || 10;
    galleryState.telescope = router.get("telescope") || "All";
    galleryState.category = router.get("category") || "All";

    galleryDom.sortDirection.innerHTML = sortHtml();
    galleryDom.sortSelector.innerHTML = '';

    const sortToggle = () => {
        galleryState.sortAscending = !galleryState.sortAscending;
        router.set("sortAscending", galleryState.sortAscending);
        galleryDom.sortDirection.innerHTML = sortHtml();
        router.update();
        galleryState.search();
    }

    galleryDom.sortDirection.addEventListener("click", sortToggle);
    const sortOptions =
        domHelper.arrayToOptions(galleryState.sortList, { selectedValue: galleryState.sort });
    domHelper.appendChildren(galleryDom.sortSelector, sortOptions);

    galleryDom.sortSelector.addEventListener("change", () => {
        const sort = galleryDom.sortSelector.value.split("-");
        router.set("sortBy", sort[0]);
        router.set("sortAscending", sort[1] === "asc");
        galleryState.sort = sort;
        router.update();
        galleryState.search();
    });

    galleryDom.specialSelect.addEventListener("change",
        () => location.href = galleryDom.specialSelect.value === "0" ?
            "#" : galleryDom.specialSelect.value);

    const categories = db.getTypes();
    const categoryOptions =
        domHelper.arrayToOptions(categories, { selectedValue: galleryState.category });
    domHelper.appendChildren(galleryDom.category, categoryOptions);

    galleryDom.category.addEventListener("change", () => {
        const newCategory = galleryDom.category.value;
        if (newCategory === "All") {
            router.reset("category");
        }
        else {
            router.set("category", newCategory);
        }
        galleryState.category = newCategory;
        router.update();
        galleryState.search();
    });

    const telescopes = db.getTelescopes();
    const telescopeOptions =
        domHelper.arrayToOptions(telescopes, { selectedValue: galleryState.telescope });
    domHelper.appendChildren(galleryDom.telescope, telescopeOptions);

    galleryDom.telescope.addEventListener("change", () => {
        const newTelescope = galleryDom.telescope.value;
        if (newTelescope === "All") {
            router.reset("telescope");
        }
        else {
            router.set("telescope", newTelescope);
        }
        galleryState.telescope = newTelescope;
        router.update();
        galleryState.search();
    });

    galleryDom.searchText.addEventListener("focus", () => {
        galleryDom.searchText.select();
    });

    galleryDom.searchText.addEventListener("blur", () => {
        if (galleryDom.searchText.value !== galleryState.lastText) {
            const search = galleryDom.searchText.value.trim().toLowerCase();
            if (search.length > 2) {
                router.set("text", search);
                router.update();
                galleryState.search();
            }
        }
    });

    if (galleryState.lastText && galleryState.lastText.length > 0) {
        galleryDom.searchText.value = galleryState.lastText;
    }

    const sigText = sig => sig ? "Uncheck to include images that are not part of the signature series." :
        "Check to include only images that are part of the signature series.";

    galleryDom.sigCheck.checked = galleryState.signatureOnly;
    galleryDom.sigText.innerText = sigText(galleryState.signatureOnly);

    galleryDom.sigCheck.addEventListener("change", () => {
        galleryState.signatureOnly = galleryDom.sigCheck.checked;
        galleryDom.sigText.innerText = sigText(galleryState.signatureOnly);
        if (galleryState.signatureOnly) {
            router.set("signature", galleryState.signatureOnly);
        } else {
            router.reset("signature");
        }
        router.update();
        galleryState.search();
    });

    const printText = print => print ? "Uncheck to include images that don't have a physical print available." :
        "Check to include only images that have a physical print available.";

    galleryDom.printCheck.checked = galleryState.printOnly;
    galleryDom.printText.innerText = printText(galleryState.printOnly);

    galleryDom.printCheck.addEventListener("change", () => {
        galleryState.printOnly = galleryDom.printCheck.checked;
        galleryDom.printText.innerText = printText(galleryState.printOnly);
        if (galleryState.printOnly) {
            router.set("print", galleryState.printOnly);
        }
        else {
            router.reset("print");
        }
        router.update();
        galleryState.search();
    });

    const archiveText = archive => archive ? "Uncheck to no longer include archived images." :
        "Check to include images marked as archived.";

    galleryDom.archiveCheck.checked = galleryState.includeArchived;
    galleryDom.archiveText.innerText = archiveText(galleryState.includeArchived);

    galleryDom.archiveCheck.addEventListener("change", () => {
        galleryState.includeArchived = galleryDom.archiveCheck.checked;
        galleryDom.archiveText.innerText = archiveText(galleryState.includeArchived);
        if (galleryState.includeArchived) {
            router.set("archive", galleryState.includeArchived);
        }
        else {
            router.reset("archive");
        }
        router.update();
        galleryState.search();
    });

    const simplifyText = simplify => simplify ? "Uncheck to show detailed results." :
        "Check to switch to a simplified gallery tile view.";

    galleryDom.simplifyCheck.checked = galleryState.simplify;
    galleryDom.simplifyText.innerText = simplifyText(galleryState.simplify);

    galleryDom.simplifyCheck.addEventListener("change", () => {
        galleryState.simplify = galleryDom.simplifyCheck.checked;
        galleryDom.simplifyText.innerText = simplifyText(galleryState.simplify);
        if (galleryState.simplify) {
            router.set("simplify", galleryState.simplify);
        }
        else {
            router.reset("simplify");
        }
        router.update();
        galleryState.search();
    });



    domHelper.runNext(() => galleryDom.searchText.focus());

    domHelper.runNext(galleryState.search, 10000);
};

window.dsw.loader.bootstrap(["domHelper", "gallerydb", "router", "pubsub"],
    (ctx) => pageScript(ctx.domHelper, ctx.gallerydb, ctx.router, ctx.pubsub));


