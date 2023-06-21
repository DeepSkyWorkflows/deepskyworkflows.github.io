window.deepSkyRouter = (() => {
    
    const queryManager = {

        values: {},
        keys: [],
        baseUrl: '',
        hash: '',

        parseIncoming: function () {

            queryManager.baseUrl = window.location.href.split('#')[0].split('?')[0];
            queryManager.hash = window.location.hash;

            if (queryManager.keys.length || !(window.location.search)) {
                return;
            }

            if (window.location.search) {
                const incoming = decodeURI(window.location.search.substring(1)).split("&");
                queryManager.values = {};
                queryManager.keys = [];
                for (let i = 0; i < incoming.length; i++) {
                    const keyValue = incoming[i].split("=");
                    queryManager.keys.push(keyValue[0]);
                    queryManager.values[keyValue[0]] = keyValue[1];
                    queryManager.set(keyValue[0], keyValue[1]);
                }
            }
        },

        setHash: function (hash) {
            queryManager.hash = hash;
        },

        get: function (key) {
            queryManager.parseIncoming();
            return queryManager.values[key];
        },

        set: function (key, value) {

            const pos = queryManager.keys.indexOf(key);

            if (pos < 0) {
                queryManager.keys.push(key);
            }

            queryManager.values[key] = value;
        },

        reset: function (key) {

            const pos = queryManager.keys.indexOf(key);

            if (pos >= 0) {
                queryManager.keys.splice(pos, 1);
                delete queryManager.values[key];
            }
        },

        update: function (title) {

            let str = '';
            
            if (queryManager.keys.length) {
                title += ' (';
                for (let i = 0; i < queryManager.keys.length; i++) {
                    if (i > 0) {
                        str += "&";
                        title += ", ";
                    }
                    title += `${queryManager.keys[i]}=${queryManager.values[queryManager.keys[i]]}`;
                    str += queryManager.keys[i];
                    str += "=";
                    str += queryManager.values[queryManager.keys[i]];
                }
            }

            const query = `?${encodeURI(str)}`;
            const url = queryManager.baseUrl;
            const hash = queryManager.hash;

            const newState = {
                Title: `${title})`,
                Url: `${url}${query}${hash}`
            };

            window.location.hash = queryManager.hash;
            window.history.pushState(newState, newState.Title, newState.Url);
        }
    };    

    return queryManager;
    
})();