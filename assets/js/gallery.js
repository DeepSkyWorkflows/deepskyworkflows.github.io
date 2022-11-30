$(document).ready(function () {

    const active = {
        link: null,
        target: null,
        nostars: false,
        queue: 0,
        total: 0
    }

    let progress = function () {
        return "Loading: " + active.queue + " remaining of " + active.total + " images.";
    }

    $('#starToggle').attr("disabled", true);

    $("img[data-src]").each(function () {
        let target = $(this);
        let targetName = $(this).attr('data-src');
        active.queue++;
        active.total++;
        $("#loadingStatus").innerText = progress();
        let loader = new Image();
        loader.onload = function () {
            target.src = loader.src;
            active.queue--;
            $("#loadingStatus").innerText = progress();
            if (active.queue === 0) {
                setTimeout(function () {
                    if (active.queue === 0) {
                        $('#loading').addClass('d-none');
                        $('#mainImgNoStars').addClass('d-none');
                        $('#wrapper').removeClass('d-none');
                        $('#starToggle').removeAttr('disabled');
                        $('#starToggle').click(() => {
                            if (active.nostars === true) {
                                active.nostars = false;
                                $('#mainImgNoStars').addClass('d-none');
                                $('#mainImg').removeClass('d-none');
                                $('#starToggle').text('Remove stars');
                            } 
                            else {
                                active.nostars = true;
                                $('#mainImgNoStars').removeClass('d-none');
                                $('#mainImg').addClass('d-none');
                                $('#starToggle').text('Restore stars');
                            }
                        });
                    }
                });
            }
        };
        loader.src = targetName;
    });

    let hash = location.hash;
    let targets = [];
    let activeRef = null;

    $("a[data-toggle=tab]").each(function () {
        let targetId = '#' + $(this).attr('aria-controls');
        let target = $(targetId);

        let ref = { link: $(this), target: target };

        if (targetId == hash) {
            activeRef = ref;
        }
        else {
            targets.push(ref);
        }

        $(this).click(function () {
            if (active.link) {
                active.link.removeClass('active');
                active.target.removeClass('active');
                active.target.hide();
            }
            active.link = $(this);
            active.target = target;
            active.link.addClass('active');
            active.target.show();
            active.target.addClass('active');
            location.hash = targetId;
        });
    });

    activeRef = activeRef ?? targets.shift();
    if (activeRef) {
        active.link = activeRef.link;
        active.link.addClass('active')
        active.target = activeRef.target;
        while (activeRef = targets.shift()) {
            activeRef.target.hide();
        }
    }

});