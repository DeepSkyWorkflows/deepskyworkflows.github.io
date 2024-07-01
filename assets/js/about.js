const about = (domHelper, pubsub) => {
    const aboutImages = [
    "/assets/images/about/jeremy-celestron.jpeg",
    "/assets/images/about/jeremy-eclipse.jpg",
    "/assets/images/about/jeremy-redmond-2024.jpeg",
    "/assets/images/about/jeremy-shot.jpeg"];
    domHelper.runNext(() => {
        pubsub.publish("imageContext", aboutImages);
    });
};

window.dsw.loader.bootstrap(["domHelper", "pubsub"], 
    ctx => about(ctx.domHelper, ctx.pubsub));