const slider = (domHelper) => {

    const dom = {
        slider: domHelper.class("dsw-slider")[0],   
        slides: domHelper.class("dsw-slide"),
        breadcrumbs: domHelper.class("dsw-slides-breadcrumb"),
        currentSlide: 0,
        slideCount: 0,
        toSlide: slideIdx => {
            const curSlide = dom.slides[dom.currentSlide];
            const curCrumb = dom.breadcrumbs[dom.currentSlide];
            curSlide.classList.remove("active");
            curCrumb.classList.remove("active");
            dom.slides[slideIdx].classList.add("active");
            dom.breadcrumbs[slideIdx].classList.add("active");
            dom.currentSlide = slideIdx;
            const y = window.scrollY;
            dom.slides[slideIdx].scrollIntoView(true, { behavior: "smooth" });
            window.scrollTo(0, y);
            return false;
        },
        nextSlide: () => dom.toSlide((dom.currentSlide + 1) % dom.slideCount)
    };

    dom.slideCount = dom.slides.length;

    for (let idx = 0; idx < dom.breadcrumbs.length; idx++) {    
        (function (i) {
            dom.breadcrumbs[i].addEventListener("click", () => dom.toSlide(i));
        })(idx);
    }

    for (let idx = 0; idx < dom.slides.length; idx++) {
        const slide = dom.slides[idx];
        const url = slide.getAttribute("data-target");
        const children = slide.childNodes;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.tagName !== "A") {
                child.addEventListener("click", () => location.href = url);                
            }
        }
    }
    
    const tick = () => {
        dom.nextSlide();
        domHelper.runAfterMs(tick, 10000, "tick");
    };

    dom.slider.addEventListener("click", () => {
        domHelper.resetRun("tick");
        domHelper.runAfterMs(tick, 20000, "tick");
        return false;
    });

    tick();
};

const init = () => window.dsw.loader.resolveApi("domHelper")
.then(domHelper => slider(domHelper));

setTimeout(init);