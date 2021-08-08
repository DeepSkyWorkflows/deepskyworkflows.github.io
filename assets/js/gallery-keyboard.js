$(document).ready(function () {

    const TAB = 9;

    setTimeout(function () {

        $("#myTab .nav-link,.active").focus();

        const tabState = {
            tabs: [],
            tabIdx: 0
        };

        let idx = 0;
        $("#myTab .nav-link").each(function () {
            tabState.tabs.push($(this));
            if ($(this).hasClass("active")) {
                tabState.tabIdx = idx;
            }
            else {
                idx++;
            }
        });

        $(document).keydown(function (e) {
            if ($(document.activeElement).parent().parent().attr("id") === "myTab") {
                if (e.keyCode === TAB) {
                    let preventDefault = false;
                    if (e.shiftKey) {
                        if (tabState.tabIdx > 0) {
                            tabState.tabIdx--;
                            $(tabState.tabs[tabState.tabIdx]).trigger("click");
                            preventDefault = true;
                        }
                    }
                    else {
                        if (tabState.tabIdx < (tabState.tabs.length - 1)) {
                            tabState.tabIdx++;
                            $(tabState.tabs[tabState.tabIdx]).trigger("click");
                            preventDefault = true;
                        }
                    }
                    if (preventDefault) {
                        e.preventDefault();
                    }
                }
            }
        });

    }, 0);

});