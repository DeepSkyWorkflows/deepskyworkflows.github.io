const detail = (domHelper, pubsub) => {

    const imagesToLoad = document.getElementsByTagName("img");
    const imageQueue = [];

    for (let idx = 0; idx < imagesToLoad.length; idx++) {
        const img = imagesToLoad[idx];
        const dataSrc = img.getAttribute("data-src");
        if (dataSrc) {
            img.setAttribute("src", dataSrc);
            imageQueue.push(dataSrc);
        }
        else if (img.classList.contains("preloader")) {
            img.addEventListener("load", () => img.classList.add("d-none"));
        }
    }

    const dom = {
        mainImage: domHelper.class("gallery-main-image")[0],
        mainImageLink: domHelper.class("gallery-main-image-link")[0],
        shareLink: domHelper.class("share")[0],
        imageChanger: domHelper.id("imageVariation"),
    };

    if (dom.imageChanger) {
        dom.imageChanger.addEventListener("change", 
            e => dom.mainImage.src = dom.mainImageLink.href = e.target.value);        
    }

    dom.shareLink.addEventListener("click", async e => {
        e.preventDefault();
        if (navigator && navigator.share) {
            await navigator.share({
                title: dom.shareLink.dataset.title,
                text: dom.shareLink.dataset.title,
                url: `/gallery/${dom.shareLink.dataset.folder}`});
            }
        });  
        
    pubsub.publish("imageContext", window.dsw.category);
};

window.dsw.loader.bootstrap(["domHelper", "pubsub"],
    (ctx) => detail(ctx.domHelper, ctx.pubsub));