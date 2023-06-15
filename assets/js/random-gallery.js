---
layout: null
sitemap: false
---

const processQueue = () => {
    
    const section = document.getElementById("random-gallery");
    const numPics = Math.floor(section.offsetWidth / 262);
    
    section.innerText = '';
    
    if (numPics < 0) {
        numPics = 1;
    }
    
    const insertImage = (pic) => {
        const random = Math.floor(Math.random() * window.gallery.queue.length);
        const picture = pic || window.gallery.queue.splice(random, 1)[0];
        const innerHtml = `<a href="${picture.link}" title="${picture.title}">
        <img class="card-img-top gallery-img messier" src="${picture.url}" alt="${picture.title}">
        </a>
        <div class="card-header bg-dark text-center">
            <a href="${picture.link}" target="_blank" title="${picture.title}">${picture.title}</a>
        </div>`;
        const div = document.createElement('div');
        div.class = "col card gallery-card";
        div.style = "margin-right: 2px; width: 260px;";
        div.innerHTML = innerHtml;
        section.appendChild(div);
        return div;
    };
    
    const divs = {
        lastDiv: [],
        offset: 280
    };
    
    const queue = [...window.gallery.queue];        
    
    for (let idx = 0; idx < numPics; idx++) {        
        divs.lastDiv.push(insertImage(queue[idx]));
    }

    const transition = () => {
        if (divs.offset <= 0) {
            const gone = divs.lastDiv.shift();
            section.removeChild(gone);
            divs.lastDiv[divs.lastDiv.length-1]
                .style.width="280px";
            divs.offset = 280;
            heartbeat();
            return;
        }
        divs.offset-=15;
        divs.lastDiv[0].style.width=`${divs.offset}px`;
        divs.lastDiv[divs.lastDiv.length-1]
            .style.width=`${280-divs.offset}px`;
        setTimeout(transition, 80);
    };

    const heartbeat = () => {
        setTimeout(() => {
            const newImg = insertImage();
            newImg.style.width = "0px";
            divs.lastDiv.push(newImg);
            transition();
        }, 10000);
    };

    heartbeat();
}

const processData = () => {
    window.gallerydb.setPredicate("signature", "eq", true);
    window.gallerydb.setSort("lastCapture", false);    
    const db = window.gallerydb.getItems(9999);
    db.forEach(item => {
        const picture = {
            updated: item.lastCapture,        
            title: item.title,
            link: `gallery/${item.folder}`,
            url: `${item.thumbnailUrl}`
        };
        window.gallery.queue.push(picture);        
    });
    processQueue();
}

const load = () => {

    window.gallery = window.gallery ?? {
        queue: [],
        data: null
    };

    if (window.gallery.data !== null) {
        processQueue();
        return;
    }

    window.gallerydbpromise.then(processData);
};

setTimeout(load);        