const rotator = (domHelper, gallerydb, pubsub) => {

    const dom = {
        imageContainer: domHelper.class("bg-image-back")[0],
        imageQueue: []
    };

    pubsub.subscribe("imageContext", (data) => {
        if (typeof data === "string") {
            gallerydb.setSort("weighted", false);
            gallerydb.setPredicate();
            gallerydb.addPredicate("type", "eq", data);
            dom.imageQueue = gallerydb.getItems(99)
             .map(item => `/assets/images/gallery/${item.folder}/${item.folder}.jpg`);
        }
        else if (data && data.length > 0) {
            dom.imageQueue = [...data];
        } else if (dom.imageQueue.length === 0) {
            loadDomImageQueue();
        }
    });

    const loadDomImageQueue = () => {
        gallerydb.setSort("weighted", false);    
        gallerydb.setPredicate();

        dom.imageQueue = gallerydb.getItems(99)
            .map(item => `/assets/images/gallery/${item.folder}/${item.folder}.jpg`);
    };

    loadDomImageQueue();

    const tock = () => {
        dom.imageContainer.classList.remove("triggerAnimation");
        dom.imageContainer.classList.add("fadeOut");
        domHelper.runAfterMs(tick, 2000);
    };

    const tick = () => {
        const image = dom.imageQueue[Math.floor(Math.random() * dom.imageQueue.length)];
        dom.imageContainer.style.backgroundImage = `url('${image}')`;
        pubsub.publish("imageBegin", image);
        domHelper.runAfterMs(() => {
            dom.imageContainer.classList.remove("fadeOut");
            dom.imageContainer.classList.add("triggerAnimation");
            pubsub.publish("imageEnd", image);
            domHelper.runAfterMs(tock, 10000);
        });
    };        

    domHelper.runNext(tick);
}

const header = (domHelper) => {

    const dom = {
        content: domHelper.class("main-content")[0],
        image: domHelper.class("bg-image-container")[0]
    };
    
    const bind = () => {
        dom.image.style.width = `${dom.content.clientWidth}px`;
        dom.image.style.left = `${dom.content.offsetLeft}px`;
    };
        
    window.addEventListener("resize", bind);
    
    bind();
};

const footer = (domHelper) => {

    const dom = {
        p: document.querySelector(".footer-rotator p"),
        a: document.querySelector(".footer-rotator p a"),
        data: {}
    };

    dom.p.parentElement.style.backgroundSize = "cover";
    dom.p.parentElement.style.backgroundPosition = "center top";
    dom.p.parentElement.style.backgroundRepeat = "no-repeat";

    fetch("/search-index.json").then(response => response.json()).then(data => {
        dom.data = data.search;
        const rotate = () => {
            const item = dom.data[Math.floor(Math.random() * dom.data.length)];
            dom.a.href = item.url;
            dom.a.innerText = item.title;
            dom.a.title = item.title;
            dom.p.parentElement.style.backgroundImage = "";
            if (item.thumb)
            {
                dom.p.parentElement.style.backgroundImage = `url('${item.thumb.substring(1)}')`;    
            }
            else if (item.image)
            {
                dom.p.parentElement.style.backgroundImage = `url('${item.image.substring(1)}')`;    
            }
            dom.p.classList.remove("fadeOut");
            dom.p.classList.add("fadeIn");
            domHelper.runAfterMs(retire, 5000);
        };
        const retire = () => {
            dom.p.classList.add("fadeOut");
            dom.p.classList.remove("fadeIn");
            domHelper.runAfterMs(rotate, 3000);
        };
        domHelper.runNext(rotate);
    });
};

window.dsw.loader.bootstrap(["domHelper", "gallerydb", "pubsub"], (ctx) => {
    rotator(ctx.domHelper, ctx.gallerydb, ctx.pubsub);
    header(ctx.domHelper);
    footer(ctx.domHelper);
});