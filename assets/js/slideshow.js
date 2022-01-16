const LEFT = 37;
const RIGHT = 39;
const SPACEBAR = 32;

const slideShowKeyboard = function () {
    $(document).keydown(function (e) {
        let preventDefault = false;
        if (e.keyCode === LEFT) {
            $(".carousel").carousel("prev");                    
            preventDefault = true;
        }
        else if (e.keyCode == RIGHT ) {
            $(".carousel").carousel("next");                    
            preventDefault = true;
        }
        else if (e.keyCode == SPACEBAR) {
            $("#btnPause").trigger("click");
            preventDefault = true;
        }
        if (preventDefault) {
            e.preventDefault();
        }
    });
};

$(document).ready(function () {

    // fun little algorithm that shows colorful animated rectangles
    // based on my "dwitter" entry

    const c = document.getElementById("dwitter");
    const x = c.getContext('2d');
    const S = Math.sin;
    const C = Math.cos;
    const T = Math.tan;

    const R = function (r, g, b, a) {
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
                p += q,
                    q = t / 3,
                    x.fillStyle = R(S(j) * 255, C(j) * 255, j * 16, 0.1),
                    x.fillRect((j * p * 10 + i) % 2e3, i + 200, 5, 600);
            }
        }
    };

    timer.interval = setInterval(function () {
        timer.end = new Date();
        let t = (timer.end.getTime() - timer.start.getTime()) / 1000;
        u(t);
    }, 16);

    const slides = $("#astrodeck").html();

    const container = $("<div/>");

    $(container).html(slides);

    const tracker = {
        deck: [],
        paused: false
    };

    // grab the slides from the template and move them into a hidden div
    $(container).find(".carousel-item").each(function () {
        tracker.deck.push($(this));
    });

    tracker.total = tracker.remaining = tracker.deck.length;

    $("#astroheader").text(`Loading ${tracker.deck.length} slides...`);

    // iterate the deck in a random order
    while (tracker.deck.length) {

        let slideNo = Math.floor(Math.random() * tracker.deck.length);
        let card = tracker.deck.splice(slideNo, 1)[0];
        let img = $(card).find('img').first();

        // wait for the image to actually load
        $(img).on('load', function () {

            tracker.remaining--;

            $("#astroheader").text(`${tracker.remaining} remaining of ${tracker.total} slides...`);

            // move the deck from the hidden div to the live carousel
            $(card).remove();
            $("#astroturf").append(card);

            if (tracker.remaining < 1) {

                $(".carousel .active").removeClass("active");
                
                // turn off the show
                clearInterval(tracker.interval);

                // reveal the controls
                $("#carouselcontrols").removeClass("d-none");

                // start the show                
                $(".carousel").carousel({
                    interval: 8000
                });

                // wire up the pause/resume button
                $("#btnPause").on("click", function () {

                    if (tracker.paused) {
                        $(".carousel").carousel("cycle");
                        $("#btnPause").text("Pause (Playing)");
                        $("#carouselstatus").text("🟢");
                        tracker.paused = false;
                    }
                    else {
                        $(".carousel").carousel("pause");
                        $("#btnPause").text("Resume (Paused)");
                        $("#carouselstatus").text("🔴");
                        tracker.paused = true;
                    }
                });

                // wire up and show slide navigation
                $(".carousel-control-prev").on("click", function () {
                    $(".carousel").carousel("prev");
                    return true;
                });

                $(".carousel-control-next").on("click", function () {
                    $(".carousel").carousel("next");
                    return true;
                });

                $(".carousel-control-prev, .carousel-control-next").removeClass("d-none");

                slideShowKeyboard();

                // adjust text display
                const adjustCaption = function () {

                    const img = $(".carousel .active img").first();
                    const caption = $(".carousel .active .carousel-caption").first();

                    if ($(window).width() <= 768) {
                        $(".carousel .carousel-caption").addClass("d-none");
                    } else {
                        $(".carousel .carousel-caption").removeClass("d-none");
                    }

                    if ($(window).width() <= 1024) {
                        return;
                    }

                    $(caption).removeClass("d-none");

                    // center caption text 

                    const imgHeight = $(img).get(0).naturalHeight;
                    const imgWidth = $(img).get(0).naturalWidth;
                    const adjustedHeight = $(img).height();

                    const ratio = adjustedHeight / imgHeight;
                    const adjustedWidth = Math.floor(imgWidth * ratio);
                    $(caption).width(adjustedWidth);
                    let left = $(img).position().left;

                    // first guess
                    $(caption).css("margin-left", left);

                    // now fix the offset to align to the left edge of the image
                    const imgTrueLeft = $(img)[0].getBoundingClientRect().left;
                    const captionTrueLeft = $(caption)[0].getBoundingClientRect().left;
                    const diff = captionTrueLeft - imgTrueLeft;
                    left -= diff;
                    $(caption).css("margin-left", left);
                };

                // fire each time a new slide appears
                $(".carousel").on("slid.bs.carousel", adjustCaption);

                // remove the div with the intro animation
                $("#astroturf").children().first().remove();

                // set our first slide to "active"
                $("#astroturf").children().first().addClass("active");

                adjustCaption();                
            }
        });

        const loader = new Image();

        loader.onload = function () {
            $(img).attr("src", $(loader).attr("src"));
        };

        setTimeout(function () {
            loader.src = $(img).attr("data-src");
        }, 5);
    }
});