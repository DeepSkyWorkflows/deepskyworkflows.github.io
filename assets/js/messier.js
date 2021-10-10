(function () {
    
    $(document).ready(function () {
    
        const init = {
            sortby: "target",
            ascending: true,
            filter: "",
            constellation: "",        
            type: "",
            season: "",
            difficulty: ""
        };

        const filterableColumns = {
            type: true,
            constellation: true,
            season: true,
            difficulty: true
        };

        const sortableColumns = {};

        const quickFilters = {
            filters: ["type", "constellation", "season", "difficulty"],
            filterElems: [],
            currentFilter: 0,
            textFilter: '',
            constellation: [],
            season: ["Spring", "Summer", "Autumn", "Winter"],
            seasonDisplay: ["🌼 Spring", "☀ Summer", "🍂 Autumn", "❄ Winter"],
            type: [],
            difficulty: ["Very Easy", "Easy", "Moderate", "Hard", "Very Hard"],
            difficultyDisplay: ["✅ Very Easy", "🟢 Easy", "🟡 Moderate", "🔴 Hard", "⛔ Very Hard"]
        };

        let idx = 0;
        $("thead tr th").each(function () {
            const sort = $(this).attr("data-sort");
            if (sort) {
                sortableColumns[sort] = idx;
                sortableColumns[idx] = sort;
                if (filterableColumns[sort] === true) {
                    filterableColumns[sort] = idx;
                }
                $(this).addClass("messier-sort");
                var header = $(this).text();
                $(this).html(`${header}&nbsp;<span id="sortDir${sort}"></span>`);
                const _this = $(this);
                (function (srt, _this) {
                    $(_this).on("click", function () {
                        grid.sortClick(srt);
                    });
                })(sort, _this);
            }
            idx++;
        });

        const cloneInit = function (sortby, ascending) {
            const result = {};
            for (var prop in init) {
                if (init.hasOwnProperty(prop)) {
                    result[prop] = init[prop];
                }
            }
            result.sortby = sortby;
            result.ascending = ascending;
            return result;
        };

        const grid = {

            captures: {
                total: 0,
                captured: 0
            },

            filters: cloneInit("target", true),

            showGrid: true,

            toggleDescription: function () {
                const state = $("#expando").attr("data-value");
                if (state === "open") {
                    $("#expando").attr("data-value", "closed").text("▶");                    
                    $("#expando-target").hide();
                }
                else {
                    $("#expando").attr("data-value", "open").text("🔽");                    
                    $("#expando-target").show();
                }
            },

            toggleView: function () {
                if (grid.showGrid === true) {
                    grid.showGrid = false;
                    $("#btnGrid").prop("disabled", false);
                    $("#btnTile").prop("disabled", true);
                    $("#grid").hide();
                    $("#tiles").show();                    
                } 
                else {
                    grid.showGrid = true;
                    $("#btnGrid").prop("disabled", true);
                    $("#btnTile").prop("disabled", false);
                    $("#grid").show();
                    $("#tiles").hide();      
                    $("#textFilter").focus();              
                }
            },

            textFilter: function () {
                let filter = $("#textFilter").val().trim().toLowerCase();
                if (filter !== quickFilters.textFilter) {
                    quickFilters.textFilter = filter;
                    grid.refresh();
                }                
            },

            clearText: function () {
                $("#textFilter").val('');
                if (quickFilters.textFilter.length) {
                    quickFilters.textFilter = '';
                    grid.refresh();
                }
                $("#textFilter").focus();
            },

            filterToggle: function () {
                
                let filterIdx = quickFilters.currentFilter;                
                $(quickFilters.filterElems[filterIdx]).hide();
                
                filterIdx = (filterIdx + 1) % quickFilters.filters.length;
                nextFilterIdx = (filterIdx + 1) % quickFilters.filters.length;

                quickFilters.currentFilter = filterIdx;
                $(quickFilters.filterElems[filterIdx]).show();                
                $("#currentFilter").text(quickFilters.filters[filterIdx]);
                $("#filterToggle").text(quickFilters.filters[nextFilterIdx]);
            },
            
            updateSort: function () {

                const direction = grid.filters.ascending;
                
                $("thead tr th").each(function() {
                    const sort = $(this).attr("data-sort");
                    if (sort) {
                        const indicator = $(this).find("span").first();                        
                        if (grid.filters.sortby === sort) {
                            $(indicator).text(direction ? "🔼" : "🔽");
                        }
                        else {
                            $(indicator).text('');
                        }
                    }
                });
                
                var rows = [];
                
                $("tbody tr").each(function () {
                    const row = {
                        elem: $(this)                        
                    };
                    
                    const target = Number($($(this).find("th")[0]).attr("data-value").substr(1));                    
                
                    let sort = target;
                
                    if (grid.filters.sortby !== "target") {
                        sort = $($(this).find("td")[sortableColumns[grid.filters.sortby]-1]).attr("data-value");
                    }
                
                    switch (grid.filters.sortby) {
                        case "ra":
                            let parts = sort.split("h");
                            let minuteparts = parts[1].split("m");
                            sort = parseFloat(parts[0])*60 + parseFloat(minuteparts[0]);
                            break;
                        case "dec":
                            let dec_parts = sort.split('°');
                            sort = parseFloat(dec_parts[0])*360+parseFloat(dec_parts[1]);
                            break;
                        case "magnitude":
                            sort = parseFloat(sort);
                            break;
                        case "size":
                            let size_parts = sort.split("x");
                            sort = 
                                parseFloat(size_parts[0])
                                * parseFloat(size_parts[size_parts.length-1]);
                            break;
                        case "distanceLy":
                            sort = parseFloat(sort.replace(/,/g, ''));
                            break;
                        case "season":                            
                            sort = quickFilters.season.indexOf(sort);
                            break;
                        case "difficulty":
                            sort = quickFilters.difficulty.indexOf(sort);
                            break;
                    }
                
                    row.sort = sort;
                    row.target = target;
                    rows.push(row);                    
                });

                $($("tbody")[0]).empty();

                rows.sort(function (a, b) {
                    let comparea = a.sort;
                    let compareb = b.sort;
                    if (comparea === compareb) {
                        comparea = a.target;
                        compareb = b.target;
                    }  
                    if (typeof compara === "number") {
                        return direction ? comparea - compareb : compareb - comparea;
                    }
                    if (comparea < compareb) {
                        return direction ? -1 : 1;
                    }
                    return comparea == compareb ? 0 : (direction ? 1 : -1);
                });

                for (var idx = 0; idx < rows.length; idx += 1) {
                    $($("tbody")[0]).append(rows[idx].elem);
                }
            },
            
            refresh: function () {
                
                grid.filters = cloneInit(grid.filters.sortby, grid.filters.ascending);
                
                $("#filters").text("none");
                $("#btnClearFilter").hide();

                if (window.location.hash.length > 1) {                
                    const filter = window.location.hash.substr(1);
                    const parts = filter.split("-");
                    if (parts.length === 2) {
                        grid.filters[parts[0]] = decodeURI(parts[1]);
                        $("#filters").text(`${parts[0]}=${grid.filters[parts[0]]}`); 
                        $("#btnClearFilter").show();
                    }                
                } 

                grid.updateSort();
                
                $("table tbody tr").each (function () {                
                    
                    var show = true;
                    
                    for (var filter in filterableColumns) {
                        if (grid.filters[filter].length) {
                            const match = $(this).find(`td[data-filter='${filter}']`).first().attr("data-value");
                            if (match !== grid.filters[filter]) {                    
                                show = false;                                
                            }
                        }                        
                    }

                    if (show && quickFilters.textFilter.trim().length) {
                        const searchable = $(this).html().toLowerCase();
                        show = searchable.indexOf(quickFilters.textFilter) >= 0;
                    }
                    
                    if (show) {
                        $(this).show();
                    }
                    else {
                        $(this).hide();
                    }
                });
            },

            sortClick: function (sort) {
                if (grid.filters.sortby === sort) {
                    grid.filters.ascending = !grid.filters.ascending; 
                }
                else {
                    grid.filters.sortby = sort;
                }
                grid.refresh();
            }        
        };

        const links = [];

        $("table tbody tr").each(function () {
            
            grid.captures.total += 1;

            $(this).find("td").each(function (idx) {
                
                const val = $(this).attr("data-value");
                const captured = $(this).attr("data-captured");
                if (captured && captured.length) {
                    grid.captures.captured += 1;
                }

                const cellFilter = $(this).attr("data-filter");
                
                if (cellFilter === "type" && quickFilters.type.indexOf(val) < 0) {
                    quickFilters.type.push(val);
                }                            

                if (cellFilter === "constellation" && quickFilters.constellation.indexOf(val) < 0) {
                    quickFilters.constellation.push(val);
                }

                if ($(this).find(".card").length) {
                    card = $(this).html();
                }
                
                for (var filter in filterableColumns) {
                    if (cellFilter == filter) {
                        const key = `#${filter}-${val}`;
                        if (links.indexOf(key) < 0) {
                            links.push(key);
                            $(this).attr("id", key.substr(1));
                        }
                        const anchor = document.createElement("button");
                        anchor.title = `Toggle filter to ${filter} ${val}`;
                        anchor.innerHTML = $(this).html().trim();
                        anchor.classList.add("btn");
                        anchor.classList.add("btn-link");
                        anchor.onclick = function () {
                            if (decodeURI(window.location.hash) === key) {
                                window.location.hash = "#";
                            } 
                            else {
                                window.location.hash = key;
                            }
                        }
                        $(this).empty();
                        $(this).append(anchor);
                    }
                }            
            });        
        });

        quickFilters.type.sort();
        quickFilters.constellation.sort();

        for (let idx = 0; idx < quickFilters.filters.length; idx++) {
            let filterList = $(`#filter-${quickFilters.filters[idx]}`);
            quickFilters.filterElems[idx] = filterList;
            let currentFilter = quickFilters.filters[idx];
            for (let filterIdx = 0; filterIdx < quickFilters[currentFilter].length; filterIdx++) {
                let val = quickFilters[currentFilter][filterIdx];
                let valDisplay = val;
                if (currentFilter === "season") {
                    valDisplay = quickFilters.seasonDisplay[filterIdx];
                }
                else if (currentFilter === "difficulty") {
                    valDisplay = quickFilters.difficultyDisplay[filterIdx];
                }
                const anchor = document.createElement("button");
                anchor.title = `Toggle filter to ${currentFilter} ${val}`;
                anchor.innerHTML = valDisplay;
                anchor.classList.add("btn");
                anchor.classList.add("btn-link");
                anchor.classList.add("btn-sm");
                let key = `#${currentFilter}-${val}`;
                (function (key_) {
                    anchor.onclick = function () {
                        if (decodeURI(window.location.hash) === key_) {
                            window.location.hash = "#";
                        } 
                         else {
                            window.location.hash = key;
                        }
                    };
                })(key);
                const span = document.createElement("span");
                span.innerHTML = "&nbsp;";
                $(filterList).append(anchor);
                $(filterList).append(span);                
            }

            if (idx > 0) {
                $(filterList).hide();
            }
        }

        $("#currentFilter").text(quickFilters.filters[0]);
        $("#filterToggle").text(quickFilters.filters[1]);
        $("#filterToggle").on("click", grid.filterToggle);
        $("#btnClearText").on("click", grid.clearText);
        $("#expando").on("click", grid.toggleDescription);
        $("#tiles").hide();
        $("#btnGrid").prop("disabled", true);
        $("#btnGrid").on("click", grid.toggleView);
        $("#btnTile").on("click", grid.toggleView);
        const pct = Math.round(grid.captures.captured * 100 / grid.captures.total);
        $("#report").text(`Captured ${grid.captures.captured} / ${grid.captures.total} (${pct}%)`);

        $("#textFilter").on("keyup", grid.textFilter);
        $(window).on("hashchange", grid.refresh);

        grid.refresh();

        $("#textFilter").focus();
    });
})();