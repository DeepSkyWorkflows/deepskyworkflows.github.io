$(document).ready(function () {

    const notifier = {
        id: 1,
        opacity: 100,
        notifyDiv: document.getElementById("notifyDiv"),
        notify: msg => {
            notifier.id++;
            notifier.opacity = 100;
            notifier.notifyDiv.innerText = msg;
            notifier.notifyDiv.classList.remove("d-none");
            (function(chksum) {
                setTimeout(() => notifier.fade(chksum), 1500);
            })(notifier.id);            
        },
        fade: function (chksum) {
            if (chksum !== notifier.id) {
                return;
            }
            notifier.opacity -= 10;
            if (notifier.opacity <= 0) {
                notifier.notifyDiv.classList.add("d-none");
                notifier.notifyDiv.style.opacity = 1.0;
                return;
            }
            notifier.notifyDiv.style.opacity = notifier.opacity/100.0;
            (function(chksum) {
                setTimeout(() => notifier.fade(chksum), 50);
            })(chksum);            
        }
    };

    const controller = {
        started: false,
        delay: 5000,
        showTitle: true,
        showDescription: true,
        showController: false,
        playing: true,
        msgId: 1,
        setTimeout: (callback, delay) => {
            controller.msgId++;
            (function (chksum) {
                setTimeout(() => {
                    if (chksum !== controller.msgId) {
                        return;
                    }
                    callback();
                }, delay);
            })(controller.msgId);
        }
    };

    const newTransition = function (oldImg, newImg) {
        return {
            transitioning: true,
            phase: 1,
            opacity: 1,
            offset: -100,
            oldImg: oldImg,
            newImg: newImg
        };
    };

    controller.transition = newTransition(null, null);
    controller.transition.transitioning = false;

    controller.slideshow = () => {    

        if (controller.transition.transitioning) {
            
            const transition = controller.transition;
            
            if (transition.phase === 1) {
                transition.opacity -= 0.1;
                if (transition.opacity <= 0) {
                    transition.oldImg.style.opacity = 1.0;
                    transition.oldImg.classList.add("d-none");
                    transition.newImg.style.marginLeft = "-100vw";
                    transition.newImg.classList.remove("d-none");
                    transition.phase = 2;
                } else {
                    transition.oldImg.style.opacity = transition.opacity;                                        
                }
            } else {
                transition.offset += 10;
                if (transition.offset >= 0) {
                    transition.newImg.style.marginLeft = "";
                    transition.phase = 3;
                    transition.transitioning = false;
                }
                else {
                    transition.newImg.style.marginLeft = `${transition.offset}vw`;
                }
            }

            if (transition.phase !== 3) {
                controller.setTimeout(controller.slideshow, 20);
                return;
            }

            if (controller.showTitle) {
                $("#titleDiv").text(controller.currentImage.title);
                $("#titleDiv").removeClass("d-none");
            }

            if (controller.showDescription) {
                $("#descriptionDiv").text(controller.currentImage.description);
                $("#descriptionDiv").removeClass("d-none");
            }

            if (controller.playing === true) {
                controller.setTimeout(controller.slideshow, controller.delay);
            }
            return;
        }

        if  (controller.playing !== true) {
            return;
        }

        if (controller.images.length == 0) {
            controller.images = [...controller.queued];
            controller.queued.length = 0;
        }

        const oldImg = controller.transition.newImg;
        
        const idx = Math.floor(Math.random() * controller.images.length);
        const nextImage = controller.images[idx];
        controller.currentImage = nextImage;
        
        $("#titleDiv").addClass("d-none");
        $("#descriptionDiv").addClass("d-none");
        
        controller.queued.push(nextImage);
        const newTarget = document.getElementById(`id${nextImage.id}`);
        controller.transition = newTransition(oldImg, newTarget);
        
        if (oldImg === null) {
            controller.transition.phase = 2;
            newTarget.style.marginLeft = "-100vw";
            newTarget.classList.remove("d-none");
        }
        
        controller.setTimeout(controller.slideshow, 20);
    };

    controller.preview = () => {

        $("#preview").html("");
        $("#preview").hide();
        controller.images = [];
        controller.types = [];
        controller.scopes = [];
        const useSignature = $("#signature").prop("checked");
        $("#slides").children("img").each((_, img) => {
            const type = $(img).attr("data-type");
            if (controller.types.indexOf(type) < 0) {
                controller.types.push(type);
            }
            const telescope = $(img).attr("data-telescope");
            if (controller.scopes.indexOf(telescope) < 0) {
                controller.scopes.push(telescope);
            }
            const signature = $(img).attr("data-signature");
            if (useSignature && signature !== "true") {
                return;
            }
            if ($(`#${type}`).prop("checked") !== true) {
                return;
            }
            if ($(`#${telescope}`).prop("checked") !== true) {
                return;
            }

            const description = $(img).attr("data-description");
            const title = $(img).attr("data-title");
            const thumb = $(img).attr("data-thumb");
            const url = $(img).attr("data-url");

            controller.images.push({
                id: controller.images.length,
                type: type,
                telescope: telescope,
                signature: signature,
                title: title,
                description: description,
                thumb: thumb,
                url: url
            });            
        });
        const count = document.createElement("div");
        const strong = document.createElement("strong");
        strong.innerText = `Filtered to ${controller.images.length} items.`;
        count.appendChild(strong);
        $("#preview").append($(count));
        for (let i = 0; i < controller.images.length && i < 10; i++) {
            const thumb = document.createElement("img");
            thumb.alt = controller.images[i].description;
            thumb.title = controller.images[i].description;
            thumb.src = controller.images[i].thumb;
            thumb.classList.add("thumbnail");
            $("#preview").append($(thumb));
        }
        $("#preview").show();
    };

    controller.start = () => {

        $("#filter").hide();
        $("#preview").html("");
        $("#slideshow").html("");
        $("#controlSwitchDiv").removeClass("d-none");

        controller.pending = controller.images.length;

        controller.slideCountdown = (evt) => {
            const img = evt.target;
            if (img.naturalHeight > img.naturalWidth) {
                img.classList.add("tall");
            } else {
                img.classList.add("wide");
            }            
            $("#preview").html("");            
            const loadStat = document.createElement("p");
            controller.pending--;

            if (controller.pending < 1) {
                controller.queued = [];
                controller.started = true;
                notifier.notify("PRESS ? OR / FOR CONTROLS");
                controller.slideshow();
                return;
            }
            loadStat.innerText = `Loading ${controller.pending} images...`;
            const progress = document.createElement("div");
            progress.classList.add("outerprogress");
            const progressBar = document.createElement("div");
            progressBar.classList.add("innerprogress");
            progress.appendChild(progressBar);
            const width = Math.floor((1 - controller.pending / controller.images.length) * 90);
            progressBar.style.width = width + "vw";
            $("#preview").append($(loadStat));
            $("#preview").append($(progress));
        }

        for (let i = 0; i < controller.images.length; i++) {
            const slide = document.createElement("img");
            slide.id = `id${controller.images[i].id}`;
            slide.alt = controller.images[i].description;
            slide.title = controller.images[i].description;
            slide.src = controller.images[i].url;
            slide.classList.add("slide");
            slide.classList.add("d-none");
            $(slide).on("load", controller.slideCountdown);
            $("#slideshow").append($(slide));
        }
    };

    controller.preview();

    controller.toggleControl = () => {
        if (controller.playing) {
            $(".playing").removeClass("d-none");
            $(".stopped").addClass("d-none");        
        } else {
            $(".playing").addClass("d-none");
            $(".stopped").removeClass("d-none");                    
        }
        if (controller.showController) {
            notifier.notify("HIDE CONTROLS");
            controller.showController = false;
            $("#controlPanelDiv").addClass("d-none");                        
        } else {
            notifier.notify("SHOW CONTROLS");
            controller.showController = true;
            $("#controlPanelDiv").removeClass("d-none");
        }
    };

    controller.titleToggle = () => {
        if (controller.showTitle) {
            notifier.notify("HIDE TITLE");
            $("#titleDiv").addClass("d-none");
            controller.showTitle = false;
            $("label[for='titleBtn'").text("Show title");
        }
        else {
            notifier.notify("SHOW TITLE");
            $("#titleDiv").removeClass("d-none");
            controller.showTitle = true;
            $("label[for='titleBtn'").text("Hide title");
        }
    };

    controller.descriptionToggle = () => {
        if (controller.showDescription) {
            notifier.notify("HIDE DESCRIPTION");
            $("#descriptionDiv").addClass("d-none");
            controller.showDescription = false;
            $("label[for='descriptionBtn'").text("Show description");
        }
        else {
            notifier.notify("SHOW DESCRIPTION");
            $("#descriptionDiv").removeClass("d-none");
            controller.showDescription = true;
            $("label[for='descriptionBtn'").text("Hide description");
        }
    };     

    $("#controlSwitchDiv").click(_ => controller.toggleControl());
    $("#controlBtn").click(_ => controller.toggleControl());
    $("#spaceBtn").click(_ => controller.togglePlay());
    $("#leftBtn").click(_ => controller.changeTiming(true));
    $("#rightBtn").click(_ => controller.changeTiming(false));
    $("#titleBtn").click(_ => controller.titleToggle());
    $("#enterBtn").click(_ => {
        notifier.notify("SKIP SLIDE");
        controller.setTimeout(controller.slideshow, 0);
    });
    $("#descriptionBtn").click(_ => controller.descriptionToggle());
    $("#backBtn").click(_ => window.location.href=`/gallery/slideshow?t=${(new Date()).getTime()}`);
    $("#homeBtn").click(_ => window.location.href=`/gallery/?t=${(new Date()).getTime()}`);

    $("input").each((_, inp) => $(inp).change(() => controller.preview()));
    
    controller.toggleAll = (targets, checked) => {
        for (let idx = 0; idx < targets.length; idx++) {
            $(`#${targets[idx]}`).prop("checked", checked);
        }
        controller.preview();
    };

    $("#categoryAll").on("click", () => controller.toggleAll(controller.types, true));
    $("#categoryNone").on("click", () => controller.toggleAll(controller.types, false));
    $("#scopeAll").on("click", () => controller.toggleAll(controller.scopes, true));
    $("#scopeNone").on("click", () => controller.toggleAll(controller.scopes, false));

    $("#go").on("click", controller.start);

    const KEYCODES = {
        LEFT: 37,
        RIGHT: 39,
        SPACEBAR: 32,
        ENTER: 13,
        T: 84,
        D: 68,
        BACKSPACE: 8,
        HOME: 36,
        SLASH: 191
    };

    controller.changeTiming = slower => {
        if (slower) {
            if (controller.delay < 5000) {
                controller.delay += 100;                
            }
            else if (controller.delay < 30000) {
                controller.delay += 1000;
            }
            notifier.notify(`SLOWER: ${controller.delay}ms`);            
        }
        else {
            if (controller.delay > 5000) {
                controller.delay -= 1000;
            }
            else if  (controller.delay > 500) {
                controller.delay -= 100;
            }         
            notifier.notify(`FASTER: ${controller.delay}ms`);
        }
        controller.setTimeout(controller.slideshow, controller.delay);
    };

    controller.togglePlay = () => {
        $(".playing").addClass("d-none");
        $(".stopped").addClass("d-none")
        if (controller.playing === true) {
            notifier.notify("STOP");
            controller.playing = false;
            $(".stopped").removeClass("d-none");
        } else {
            notifier.notify("PLAY");
            controller.playing = true;
            controller.setTimeout(controller.slideshow, 0);
            $(".playing").removeClass("d-none");
        }        
    };

    $(document).keydown(function (e) {
        let preventDefault = false;
        switch(e.keyCode) {
            case KEYCODES.SLASH:          
                if (controller.started) {      
                    preventDefault = true;
                    controller.toggleControl();
                }
                break;
            case KEYCODES.SPACEBAR:
                if (controller.started) {
                    preventDefault = true;
                    controller.togglePlay();
                }
                break;
            case KEYCODES.T:
                if (controller.started) {
                    controller.titleToggle();
                }
                break;
            case KEYCODES.D:
                if (controller.started) {
                    controller.descriptionToggle();
                }
                break;
            case KEYCODES.LEFT:
                if (controller.started) {
                    controller.changeTiming(true);
                }
                break;
            case KEYCODES.BACKSPACE:
                if (controller.started) {
                    window.location.href=`/gallery/slideshow?t=${(new Date()).getTime()}`;
                }
                break;
            case KEYCODES.HOME:
                if (controller.started) {
                    window.location.href=`/gallery?t=${(new Date()).getTime()}`;
                }
                break;
            case KEYCODES.RIGHT:
                if (controller.started) {
                    controller.changeTiming(false);
                }
                break;
            
            case KEYCODES.ENTER: 
                if (controller.started) {
                    notifier.notify("SKIP SLIDE");
                    controller.setTimeout(controller.slideshow, 0);                    
                } else {
                    controller.start();
                }
                break;            
            default:
                break;
        }
        if (preventDefault) {
            e.preventDefault();
        }
    });    
});