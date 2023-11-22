window.ds_dom_helper = (function () {
    return {

        timeoutTracker: {},

        modifyClasses: function (elem, classes) {
            if (elem) {
                if (typeof elem === "string") {
                    elem = this.id(elem);
                }
                const elemClasses = classes.split(" ");
                for (let i = 0; i < elemClasses.length; i++) {
                    if (elemClasses[i].startsWith("+")) {
                        elem.classList.add(elemClasses[i].substring(1));
                    } else if (elemClasses[i].startsWith("-")) {
                        elem.classList.remove(elemClasses[i].substring(1));
                    } else {
                        elem.classList.add(elemClasses[i]);
                    }
                }
            }
        },

        arrayToOptions(array, opts = { valueProp: null, textProp:  null, selectedValue: null }) {
            const getValue = (item) =>  opts.valueProp ? item[opts.valueProp] : item;
            const getText = (item) => opts.textProp ? item[opts.textProp] : getValue(item);
            selectedValue = opts.selectedValue || getValue(array[0]);
            const options = [];
            for (let  i = 0; i < array.length; i++) {
                const option = this.elem("option", {
                    value: getValue(array[i]),
                    innerText: getText(array[i])
                });
                if (option.value === selectedValue) {
                    option.selected = true;
                }
                options.push(option);
            }
            return options;
        },

        setSelectedValue: function (select, value) {
            if (typeof select === "string") {
                select = this.id(select);
            }

            for (var i = 0; i < select.options.length; i++) {
                if (select.options[i].value === value) {
                    select.setAttribute("selectedIndex", i);
                    select.options[i].selected = true;                                        
                }
                else {
                    select.options[i].selected = false;                
                }
            }
        },

        runNext: function(callback, tag = null) {
            return this.runAfterMs(callback, 0, tag);
        },

        runAfterMs: function (callback, ms, tag = null) {
            if (tag) {
                this.timeoutTracker[tag] = setTimeout(() => {
                    delete this.timeoutTracker[tag];
                    callback();
                }, ms);
                return null;
            }
            else {
                return setTimeout(callback, ms);
            }
        },

        resetRun: function (tag) {
            if (this.timeoutTracker[tag]) {
                clearTimeout(this.timeoutTracker[tag]);
                delete this.timeoutTracker[tag];
            }   
        },

        show: function (elem) {
            if (typeof elem === "string") {
                elem = this.id(elem);
            }
            elem.classList.remove("d-none");
        },

        hide: function (elem) { 
            if (typeof elem === "string") {
                elem = this.id(elem);
            }
            elem.classList.add("d-none");
        },

        toggle: function (elem) {
            if (typeof elem === "string") {
                elem = this.id(elem);
            }
            elem.classList.toggle("d-none");
        },

        id: function(id) {
            return document.getElementById(id);
        },

        elem: function(tag, config) {
            var elem = document.createElement(tag);
            if (config) {
                for (var prop in config) {
                    if (config.hasOwnProperty(prop)) {
                        if (prop === "class") {
                            this.modifyClasses(elem, config[prop]);
                        } else if (prop.startsWith("on")) {
                            elem.addEventListener(prop.substring(2), config[prop]);
                        } else if (prop.startsWith("inner") || prop === "style") {
                            elem[prop] = config[prop];
                        } else {
                            elem.setAttribute(prop, config[prop]);
                        }
                    }
                }
            }
            return elem;
        }
    };
})();