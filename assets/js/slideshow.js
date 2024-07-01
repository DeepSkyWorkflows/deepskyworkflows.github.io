const slideshow = (domHelper, pubsub, db) => {
    const currentImage = { url: "/gallery" };
    const header = domHelper.class("main-header")[0];
    header.innerHTML = '&nbsp;';
    domHelper.class("bg-image-top")[0]
    .addEventListener("click", () => window.location.href = currentImage.url);

    domHelper.hide(domHelper.class("footer")[0]);
    const title = domHelper.class("slideTitle")[0]; 
    pubsub.subscribe("imageBegin", image => {
        const end = image.lastIndexOf(".");
        const start = image.lastIndexOf("/", end) + 1;  
        const key = image.substring(start, end);
        currentImage.url = `/gallery/${key}`;
        const imageItem = db.getItem(key);
        title.innerText = imageItem.title;
        title.classList.add("disabled");
        domHelper.runAfterMs(() => title.classList.remove("disabled"), 500);
        domHelper.runAfterMs(() => title.classList.add("disabled"), 5500);
    });
    
    if (localStorage) {
        const imageList = localStorage.getItem("slideshow");
        if (imageList && imageList.length) {
            const images = JSON.parse(imageList);
            pubsub.publish("imageContext", images);
            localStorage.removeItem("slideshow");
        }
    }        
};

window.dsw.loader.bootstrap(['domHelper', 'pubsub', 'gallerydb'], ctx => 
    slideshow(ctx.domHelper, ctx.pubsub, ctx.gallerydb));