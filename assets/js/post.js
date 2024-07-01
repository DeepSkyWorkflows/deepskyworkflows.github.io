const post = (domHelper, pubsub) => {
    
    const article = {
        main: domHelper.class("main-article")[0],
        share: domHelper.class("share")[0],
    };
    
    const tables = document.getElementsByTagName("table");
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const parent  = table.parentNode;
        const sibling = table.nextSibling;

        const newTable = domHelper.elem("div", {
            class: "table-wrapper"
        }, [ table ]);
        
        if (sibling) {
            parent.insertBefore(newTable, sibling);
        } else {
            parent.appendChild(newTable);
        }
    }

    article.share.addEventListener("click", async () => {
        if (navigator && navigator.share) {
            await navigator.share({
                title: document.title,
                text: document.title,
                url: window.location.href
            });
        }
    });

    const images = [...domHelper.class("feature-image"), ...domHelper.class("post-image")];
    pubsub.publish("imageContext", images.map(img => img.src));

    domHelper.show(article.main);
};

window.dsw.loader.bootstrap(["domHelper", "pubsub"], ctx => post(ctx.domHelper, ctx.pubsub));