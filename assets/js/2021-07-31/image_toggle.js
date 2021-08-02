$(document).ready(function () {

    const toggleTarget = {
        src: null,
        tgt: null,
        btn: null
    };

    toggleTarget.toggle = function () {
        let srcUrl = $(toggleTarget.src).attr("src");
        let tgtUrl = $(toggleTarget.tgt).attr("src");
        $(toggleTarget.src).attr("src", tgtUrl);
        $(toggleTarget.tgt).attr("src", srcUrl);
    };

    $("img").each( function () {
        let imgUrl = $(this).attr("src");
        if (imgUrl.indexOf("preview.jpg") > 0) {
            toggleTarget.src = $(this);
        }
        else if (imgUrl.indexOf("previewtgv.jpg") > 0) {
            toggleTarget.tgt = $(this);
        }
    });

    $("#toggleImage").on("click", toggleTarget.toggle);

});