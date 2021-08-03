$(document).ready(function () {

    const c = document.getElementById("dwitter");
    const x = c.getContext('2d');
    const S = Math.sin;
    const C = Math.cos;
    const T = Math.tan;
    
    const R = function (r,g,b,a) {
        return `rgba(${r},${g},${b},${a})`;
    }

    const timer = {
        start: new Date()
    };
    
    const u = function u(t) {
        c.width |= 0;
        for (let i = 120; i--;) {
            let p = 1;
            let q = 1;
            for (let j = 30; j--;) {
                p+=q,
                q=t/3,
                x.fillStyle=R(S(j) * 255, C(j)*255, j*16, 0.1),
                x.fillRect((j*p*10+i)%2e3, i + 200, 5, 600);
            }
        }
    };
    
    timer.interval = setInterval(function () {
        timer.end = new Date();
        let t = (timer.end.getTime() - timer.start.getTime())/1000;
        u(t);
    },16);
    
    const slides = $("#astrodeck").html();
    const container = $("<div/>");
    $(container).html(slides);

    const tracker = {
        deck: []
    };

    $(container).find(".carousel-item").each(function () {
        tracker.deck.push($(this));
    });

    tracker.total = tracker.remaining = tracker.deck.length;

    $("#astroheader").text(`Loading ${tracker.deck.length} slides...`);

    let first = true;

    while (tracker.deck.length) {
        let slide = Math.floor(Math.random() * tracker.deck.length);
        let card = tracker.deck.splice(slide, 1)[0];
        let img = $(card).find('img').first();
        $(img).on('load', function () {
            tracker.remaining--;
            $("#astroheader").text(`${tracker.remaining} remaining of ${tracker.total} slides...`);
            $(card).remove();
            $("#astroturf").append(card);
            if (tracker.remaining < 1) {
                clearInterval(tracker.interval);
                $("#astroturf").children().first().remove();  
                $("#astroturf").children().first().addClass("active");
            }
        });                
    }
});