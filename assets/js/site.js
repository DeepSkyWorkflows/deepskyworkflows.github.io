console.log("site.js loaded.");

const rotator = (domHelper, gallerydb, pubsub) => {

    console.log("site.js -> rotator invoked.");

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
    
    console.log("site.js -> header invoked.");

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

window.dsw.loader.bootstrap(["domHelper", "gallerydb", "pubsub"], (ctx) => {
    rotator(ctx.domHelper, ctx.gallerydb, ctx.pubsub);
    header(ctx.domHelper);
});