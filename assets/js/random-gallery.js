---
layout: null
sitemap: false
---

const RSS_URL = "{{baseurl}}/gallery.xml";

const processQueue = () => {
    const section = document.getElementById("random-gallery");
    const numPics = Math.floor(section.offsetWidth / 262);
    section.innerText = '';
    console.log(numPics);
    if (numPics < 0) {
        numPics = 1;
    }
    for (let idx = 0; idx < numPics; idx++) {
        const random = Math.floor(Math.random() * window.gallery.queue.length);
        const picture = window.gallery.queue.splice(random, 1)[0];
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
    }
}

const processData = () => {
    const data = window.gallery.data;
    const items = data.querySelectorAll("entry");
    items.forEach(el => {
        const picture = {
            title: el.getElementsByTagName("title")[0].innerHTML,
            link: decodeURI(el.getElementsByTagName("link")[0].getAttribute("href")),
            url: decodeURI(el.getElementsByTagName("media:content")[0].getAttribute("url"))
        };
        window.gallery.queue.push(picture);
    });
    processQueue();
};

const load = () => {

    window.gallery = window.gallery ?? {
        queue: [],
        data: null
    };

    if (window.gallery.data !== null) {
        processQueue();
        return;
    }

    fetch(RSS_URL)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            window.gallery.data = data;
            processData();
        });
};

setTimeout(load);        