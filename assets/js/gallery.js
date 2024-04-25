$(document).ready(function () {
    const dom = window.ds_dom_helper;
    const query = window.deepSkyRouter;

    const galleryItem = {
        
        state: {
            version: "main",
            delay: 10
        },
        
        image: dom.id("mainImage"),
        title: document.title,
        folder: null,
        loadQueue: [],
        shareImage: dom.id("shareImage"),
        loaded: dom.id("loaded"),
        related: dom.id("related"),
        mainImage: null,    
        mainImageLink: dom.id("mainBtn"),
        fullsize: dom.id("fullsize"),
        fullsizeLink: dom.id("fullsizeBtn"),
        annotated: dom.id("annotated"),
        annotatedLink: dom.id("annotatedBtn"),
        grid: dom.id("grid"),
        gridLink: dom.id("gridBtn"),
        nostars: dom.id("nostars"),
        nostarsLink: dom.id("nostarsBtn"),
        mainHeading: document.querySelectorAll(".mainheading")[0],        
        
        loadAsync: async () => {

            await window.gallerydbpromise;

            const path = $(galleryItem.image).data("src2");
            galleryItem.image.src = path;
            const parts = path.split("/");
            galleryItem.folder = parts[parts.length - 2];
            const imageContext = window.gallerydb.getPosition(galleryItem.folder);

            const xForm = (anchor, item) => {
                anchor.href = item.img.dataset.url;
                anchor.title = item.description;
                anchor.innerHTML = item.title;        
            };

            if (imageContext) {
                if (imageContext.previous) {
                    const prevLinks = document.getElementsByClassName("prevUrl");
                    for (let i = 0; i < prevLinks.length; i++) {
                        xForm(prevLinks[i], imageContext.previous);
                    }
                }

                if (imageContext.next) {
                    const nextLinks = document.getElementsByClassName("nextUrl");
                    for (let i = 0; i < nextLinks.length; i++) {
                        xForm(nextLinks[i], imageContext.next);
                    }
                }
            }
            
            galleryItem.loadQueue.push(galleryItem.image);            

            if (galleryItem.fullsize) {
                galleryItem.fullsize.src = $(galleryItem.fullsize).data("src2");
                galleryItem.loadQueue.push(galleryItem.fullsize);   
            }
            
            if (galleryItem.annotated) {
                galleryItem.annotated.src = $(galleryItem.annotated).data("src2");
                galleryItem.loadQueue.push(galleryItem.annotated);
            }
            
            if (galleryItem.grid) {
                galleryItem.grid.src = $(galleryItem.grid).data("src2");
                galleryItem.loadQueue.push(galleryItem.grid);
            }
            
            if (galleryItem.nostars) {
                galleryItem.nostars.src = $(galleryItem.nostars).data("src2");                    
                galleryItem.loadQueue.push(galleryItem.nostars);
            }
            
            if (navigator && navigator.share) {
                galleryItem.shareImage.innerHTML = "";
                const shareBtn = dom.elem("button", {
                    class: "btn btn-primary btn-sm",
                    innerHTML: "<i class='fas fa-share'></i> Share this image",
                    onclick: function () {
                        navigator.share({
                            title: document.title,
                            text: `DeepSkyWorkflows.com is a site focused on astrophotography by Jeremy Likness. Here is an interesting image from his gallery, called '${document.title}'`,
                            url: window.location.href
                        });
                    }
                });
                galleryItem.shareImage.appendChild(shareBtn);
            }

            dom.runAfterMs(galleryItem.loadCompleteAsync, galleryItem.state.delay);            
        },

        loadCompleteAsync: function () {
            
            galleryItem.state.delay *= 2;
          
            const replacementQueue = [];
          
            while (galleryItem.loadQueue.length > 0) {
                const img = galleryItem.loadQueue.shift();
                if (!img.complete || img.src.indexOf("loading.gif") >= 0) {
                    replacementQueue.push(img);                    
                } 
                else if (img === galleryItem.image) {
                    galleryItem.mainImage = img.src;                 
                }
            }
          
            if (replacementQueue.length > 0) {
                galleryItem.loadQueue = replacementQueue;
                dom.runAfterMs(galleryItem.loadCompleteAsync, galleryItem.state.delay);
            } else {
                dom.runNext(galleryItem.init);
            }
        },
    
        init: function () {
            
            dom.hide(galleryItem.mainHeading);
                        
            if (galleryItem.fullsize) { 
                galleryItem.fullsizeLink.onclick = function () {
                    galleryItem.toggleVersion("fullsize");
                };               
                dom.hide(galleryItem.fullsize);
                
                galleryItem.annotatedLink.onclick = function () {
                    galleryItem.toggleVersion("annotated");
                };
                dom.hide(galleryItem.annotated);

                galleryItem.gridLink.onclick = function () {
                    galleryItem.toggleVersion("grid");
                };
                dom.hide(galleryItem.grid);
            }

            if (galleryItem.nostars) {
                galleryItem.nostarsLink.onclick = function () {
                    galleryItem.toggleVersion("nostars");
                };
                dom.hide(galleryItem.nostars);
            }

            if (galleryItem.mainImageLink) {
                galleryItem.mainImageLink.onclick = function () {
                    galleryItem.toggleVersion("main");
                };
            }

            galleryItem.image.scrollIntoView();
            dom.runNext(galleryItem.checkIncoming);            
        },

        checkIncoming: function () {
            const version = query.get("version");
            if (version && version !== "main" && version.length > 0) {
                galleryItem.toggleVersion(version);
            }            
        },

        toggleVersion: function (version) {
            
            query.reset("version");
            galleryItem.state.version = "main";
            
            if (galleryItem.mainImageLink) {
                dom.modifyClasses(galleryItem.mainImageLink, "-btn-success +btn-primary");
                $(galleryItem.mainImageLink).removeAttr("disabled");
            }

            if (galleryItem.fullsize) {
                dom.modifyClasses(galleryItem.fullsizeLink, "-btn-success +btn-primary");
                $(galleryItem.fullsizeLink).removeAttr("disabled");
                dom.modifyClasses(galleryItem.annotatedLink, "-btn-success +btn-primary");
                $(galleryItem.annotatedLink).removeAttr("disabled");
                dom.modifyClasses(galleryItem.gridLink, "-btn-success +btn-primary");
                $(galleryItem.gridLink).removeAttr("disabled");
            }
            
            if  (galleryItem.nostars) {
                dom.modifyClasses(galleryItem.nostarsLink, "-btn-success +btn-primary");
                $(galleryItem.nostarsLink).removeAttr("disabled");
            }

            switch (version) {
                case "fullsize":
                    if (galleryItem.fullsize) {
                        galleryItem.image.src = galleryItem.fullsize.src;
                        galleryItem.state.version = "fullsize";
                        query.set("version", "fullsize");                    
                        dom.modifyClasses(galleryItem.fullsizeLink, "+btn-success -btn-primary");
                        $(galleryItem.fullsizeLink).attr("disabled", "disabled");
                    }
                    break;
                case "annotated":
                    if (galleryItem.annotated) {
                        galleryItem.image.src = galleryItem.annotated.src;
                        galleryItem.state.version = "annotated";
                        query.set("version", "annotated");
                        dom.modifyClasses(galleryItem.annotatedLink, "+btn-success -btn-primary");
                        $(galleryItem.annotatedLink).attr("disabled", "disabled");
                    }                    
                    break;
                case "grid":
                    if (galleryItem.grid) {
                        galleryItem.image.src = galleryItem.grid.src;
                        galleryItem.state.version = "grid";
                        query.set("version", "grid");
                        dom.modifyClasses(galleryItem.gridLink, "+btn-success -btn-primary");
                        $(galleryItem.gridLink).attr("disabled", "disabled");
                    }                    
                    break;
                case "nostars":
                    if (galleryItem.nostars) {
                        galleryItem.image.src = galleryItem.nostars.src;
                        galleryItem.state.version = "nostars";
                        query.set("version", "nostars");
                        dom.modifyClasses(galleryItem.nostarsLink, "+btn-success -btn-primary");
                        $(galleryItem.nostarsLink).attr("disabled", "disabled");
                    }                    
                    break;
                default:
                    galleryItem.image.src = galleryItem.mainImage;
                    galleryItem.state.version = "main";
                    query.reset("version");
                    dom.modifyClasses(galleryItem.mainImageLink, "+btn-success -btn-primary");
                    $(galleryItem.mainImageLink).attr("disabled", "disabled");
                    break;
            }

            galleryItem.image.parentElement.href = galleryItem.image.src;            
            query.update(document.title);
        }        
    };

    dom.runNext(galleryItem.loadAsync);
});