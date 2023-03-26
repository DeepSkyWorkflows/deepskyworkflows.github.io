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
            mode: 0,
            loadIdx: 0,
            index: {
                iso: {

                },
                exposure: {

                }
            },
            photos: [],
            render: () => {
                $(playground).html('');
                $(playground).append('<div id=loading><strong>Loading interactive images...</strong></div>');
                var wrapper = document.createElement('div');
                $(playground).append(wrapper);
                $(wrapper).attr('id', 'wrapper');
                const template = $("script[type='template'").html();
                $(wrapper).append(template);
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
                loadMode: 0,
                loadIdx: 0,                
                isoPlay: false,
                expPlay: false,
                init: false,
                isoBtn: document.getElementById("playIso"),
                expBtn: document.getElementById("playExp"),
                cb: document.getElementById("stretchBtn"),
                iso: document.getElementById("isoSlider"),
                exp: document.getElementById("exp"),
                img: document.getElementById("interactiveImg"),
                curIso: document.getElementById("currentIso"),
                curExp: document.getElementById("currentExp"),
                load: () => {
                    if (interactiveState.init) {
                        return;
                    }
                    const photo = db.photos[interactiveState.loadIdx];
                    const dir = interactiveState.loadMode == 0 ? "raw" : "normalized";
                    const imgUrl = `/assets/images/2023-03-18/${dir}/${photo.id}`;
                    $(interactiveState.img).on("load", interactiveState.load);
                    $(interactiveState.img).attr("src", imgUrl);
                    interactiveState.loadIdx++;
                    if (interactiveState.loadIdx === db.photos.length) {
                        interactiveState.loadMode++;
                        interactiveState.loadIdx = 0;
                        if (interactiveState.loadMode > 1) {
                            interactiveState.init = true;
                        }
                    }
                    if (!interactiveState.init) {
                        return;
                    }

                    $("#loading").addClass("d-none");
                    $(interactiveState.cb).removeAttr("disabled");
                    $(interactiveState.iso).removeAttr("disabled");
                    $(interactiveState.exp).removeAttr("disabled");                    
                    $(interactiveState.isoBtn).removeAttr("disabled");                    
                    $(interactiveState.expBtn).removeAttr("disabled");                    

                    $(interactiveState.isoBtn).on("click", () => {
                        interactiveState.isoPlay = !interactiveState.isoPlay;
                        $(interactiveState.isoBtn).text(interactiveState.isoPlay 
                            ? "⏹ STOP" : "▶ PLAY");
                    });

                    $(interactiveState.expBtn).on("click", () => {
                        interactiveState.expPlay = !interactiveState.expPlay;
                        $(interactiveState.expBtn).text(interactiveState.expPlay 
                            ? "⏹ STOP" : "▶ PLAY");
                    });

                    $(interactiveState.cb).on("click", () => {
                        interactiveState.mode ^= 1;
                        $(interactiveState.cb).text(interactiveState.mode === 0 ? "Stretch" : "Unstretch");                        
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
                },
                tick: () => {
                    let work = interactiveState.isoPlay || interactiveState.expPlay;
                    if (work) {
                        if (interactiveState.isoPlay) {
                            if (!interactiveState.expPlay) {
                                interactiveState.isoIdx = (interactiveState.isoIdx + 1) % db.iso.length;                                                            
                            }
                        }
                        if (interactiveState.expPlay) {
                            if (!interactiveState.isoPlay) {
                                interactiveState.expIdx = (interactiveState.expIdx + 1) % db.exp.length;
                            }
                            else {
                                interactiveState.isoIdx++;
                                if (interactiveState.isoIdx === db.iso.length) {
                                    interactiveState.isoIdx = 0;
                                    interactiveState.expIdx++;
                                    if (interactiveState.expIdx === db.exp.length) {
                                        interactiveState.isoIdx = interactiveState.expIdx = 0;
                                    }
                                }
                            }
                        }
                        interactiveState.change();
                    }
                },
                change: () => {
                    const iso = db.iso[interactiveState.isoIdx];
                    $(interactiveState.curIso).text(iso);
                    const exp = db.exp[interactiveState.expIdx];
                    $(interactiveState.curExp).text(exp);
                    const dir  = interactiveState.mode === 0 ? "raw" : "normalized";
                    const img = `/assets/images/2023-03-18/${dir}/m31_50mm_f1.4_${exp}_${iso}_d.jpg`;                                
                    $(interactiveState.img).attr("src", img);
                    $("#imgView").attr("href", img);
                }
            };

            $(interactiveState.cb).attr("disabled", "disabled");
            $(interactiveState.iso).attr("disabled", "disabled");
            $(interactiveState.exp).attr("disabled", "disabled");
            $(interactiveState.isoBtn).attr("disabled", "disabled");
            $(interactiveState.expBtn).attr("disabled", "disabled");
            
            setInterval(interactiveState.tick, 500);            
            setTimeout(interactiveState.load, 0);
        },0);        
        db.render();    
    }, 1);
})();