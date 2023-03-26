(function () {
    setTimeout(() => {
        const playground = document.getElementById("playground");
        const db = {
            exp: [
                "1.0s", 
                "2.0s", 
                "4.0s", 
                "8.0s", 
                "16.0s", 
                "32.0s", 
                "64.0s", 
                "128.0s", 
                "256.0s",
                "512.0s"],
            iso: [100, 640, 3200, 51200],
            init: false,
            toload: 0,
            index: {
                iso: {

                },
                exposure: {

                }
            },
            photos: [],
            render: () => {
                $(playground).html('');
                $(playground).append('<h2 id=loading>Loading interactive images...</h2>');
                var wrapper = document.createElement('div');
                $(playground).append(wrapper);
                $(wrapper).attr('id', 'wrapper');
                $(wrapper).addClass("d-none");
                $(wrapper).append('<h2>Interactive</h2>');
                const template = $("script[type='template'").html();
                $(wrapper).append(template);
                $(wrapper).append("<h2>Linear</h2>");
                const linear = document.createElement("div");
                $(wrapper).append(linear);
                $(wrapper).append("<h2>Stretched</h2>");
                const stretch = document.createElement("div");
                $(wrapper).append(stretch);
                for (let mode = 0; mode < 2; mode++) {                
                    for (let idxe = 0; idxe < db.exp.length; idxe++) {
                        const exposure = db.exp[idxe];
                        let header = null, headerCell = null;
                        if (idxe === 0) {
                            header = document.createElement("div");
                            $(header).addClass("row");
                            $(header).html("<div class='col-2'>ISO/Exposure</div>");                        
                        }
                        const row = document.createElement("div");
                        $(row).addClass("row");
                        $(row).html(`<div class='col-2 text-right'>${exposure}</div>`);                        
                        for (let idxi = 0; idxi < db.iso.length; idxi++) {
                            const isoSetting = db.iso[idxi];
                            const photo = db.index.exposure[exposure][isoSetting];
                            if (idxe === 0) {
                                headerCell = document.createElement("div");
                                $(headerCell).addClass("col-2 text-center");
                                $(headerCell).html(`<strong>${isoSetting}</strong>`);
                                header.appendChild(headerCell);
                            }
                            const dir = mode === 0 ? "raw" : "normalized";
                            const img = `/assets/images/2023-03-18/${dir}/${photo.id}`;
                            const imgElem = document.createElement("img");
                            $(imgElem).attr("src", img);
                            db.toload++;
                            var loading = $("#loading").text();
                            loading = `${loading}.`;
                            $("#loading").text(loading);
                            $(imgElem).on("load", () => {
                                db.toload--;
                                if (db.init === true && db.toload === 0) {
                                    db.init = false;
                                    $("#loading").addClass("d-none");
                                    $("#wrapper").removeClass("d-none");
                                }
                            });
                            const a = document.createElement("a");
                            $(a).attr("href", img);
                            $(a).attr("_target", "_blank");
                            a.appendChild(imgElem);
                            const rowCell = document.createElement("div");
                            $(rowCell).addClass("col-2");
                            rowCell.appendChild(a);
                            row.appendChild(rowCell);
                            if (idxe === 0) {
                                header.appendChild(headerCell);
                            }
                        }                    
                        if (mode === 0) {
                            if (header) {
                                linear.appendChild(header);
                            }
                            linear.appendChild(row);
                            $(linear).append("<div class='row'><div class='col'>&nbsp;</div>");
                        }
                        else {
                            if (header) {
                                stretch.appendChild(header);
                            }
                            stretch.appendChild(row);
                            $(stretch).append("<div class='row'><div class='col'>&nbsp;</div>");
                        }
                    
                    }
                }
                setTimeout(() => db.init = true,0);
            }
        };

        for (let idxe = 0; idxe < db.exp.length; idxe++) {
            const exposure = db.exp[idxe];
            db.index.exposure[exposure] = {};
            for (let idxi = 0; idxi < db.iso.length; idxi++) {
                const isoSetting = db.iso[idxi];
                if (idxe === 0) {
                    db.index.iso[isoSetting] = {};
                }
                const img = `m31_50mm_f1.4_${exposure}_${isoSetting}_d.jpg`;
                const photo = {
                    id: img,
                    exposure: exposure,
                    iso: isoSetting
                };
                db.photos.push(photo);
                db.index.exposure[exposure][isoSetting] = photo;
                db.index.iso[isoSetting][exposure] = photo;
            }
        }

        setTimeout(() => {
            const interactiveState = {
                isoIdx: 0,
                expIdx: 0,
                mode: 0,
                cb: document.getElementById("cb"),
                iso: document.getElementById("iso"),
                exp: document.getElementById("exp"),
                img: document.getElementById("interactiveImg"),
                curIso: document.getElementById("currentIso"),
                curExp: document.getElementById("currentExp"),
                change: () => {
                    const iso = db.iso[interactiveState.isoIdx];
                    $(interactiveState.curIso).text(iso);
                    const exp = db.exp[interactiveState.expIdx];
                    $(interactiveState.curExp).text(exp);
                    const dir  = interactiveState.mode === 0 ? "raw" : "normalized";
                    const img = `/assets/images/2023-03-18/${dir}/m31_50mm_f1.4_${exp}_${iso}_d.jpg`;                                
                    $(interactiveState.img).attr("src", img);
                }
            };

            $(interactiveState.cb).attr("checked", false).change(() => {
                interactiveState.mode = $(interactiveState.cb).checked ? 1 : 0;
                interactiveState.change();
            });
            $(interactiveState.iso).attr("min", 0);
            $(interactiveState.iso).attr("max", db.iso.length - 1);
            $(interactiveState.iso).change(() => {
                interactiveState.isoIdx = $(interactiveState.iso).val();
                interactiveState.change();
            });
            $(interactiveState.exp).attr("min", 0);
            $(interactiveState.exp).attr("max", db.exp.length - 1);
            $(interactiveState.exp).change(() => {
                interactiveState.expIdx = $(interactiveState.exp).val();            
                interactiveState.change();
            });
            interactiveState.change();
        },0);        
        db.render();

    }, 1);
})();