$(document).ready(function () {
    const processAction = val => {
        $(`#${val}`).removeClass('d-none');
    };
    if (window.location.search) {
        const incoming = decodeURI(window.location.search.substring(1)).split("&");
        for (let i = 0; i < incoming.length; i++) {
            const keyValue = incoming[i].split("=");
            if (keyValue[0] === 'action') {
                processAction(keyValue[1]);
            }
        }
    }
});