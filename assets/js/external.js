const redirect = (domHelper, router) => {

    const validHosts = ["deepskyworkflows.com", "www.deepskyworkflows.com", "dswgalleries.com", "www.dswgalleries.com", "localhost"];

    const referrerParts = document.referrer.split("/");

    if (referrerParts.length < 2) {
        location.href = "/404.html";
        return;
    }

    let host = referrerParts[2].trim().toLowerCase();
    if (host.indexOf(":") > 0) {
        host = host.split(":")[0];
    }
    
    let valid = false;
    for (let idx = 0; !valid && idx < validHosts.length; idx++) {
        valid = validHosts[idx].indexOf(host) === 0;
        console.log(`${host} => ${validHosts[idx]}`);
    }

    if (!valid)  {
        //location.href = "/404.html";
        return;
    }

    const timer = {
        link: "https://dswgalleries.com/",
        linkUi: domHelper.id("redirectUrl"),
        countdown: domHelper.id("countdown"),
        seconds: 10
    };

    const tick = () => {
        timer.seconds--;
        timer.countdown.innerText = timer.seconds;
        if (timer.seconds === 0) {
            location.href = timer.link;
            return;
        }
        setTimeout(tick, 1000);
    };

    router.parseIncoming();
    const seconds = router.get("s");    
    if (seconds && parseInt(seconds) > 0) {
        timer.seconds = parseInt(parseInt(seconds));
    }

    timer.link = router.get("t") || timer.link;
    timer.linkUi.href = timer.link;
    timer.linkUi.innerText = `Redirecting to ${timer.link}`;

    tick();
}

window.dsw.loader.bootstrap(["domHelper", "router"], 
    ctx => redirect(ctx.domHelper, ctx.router));