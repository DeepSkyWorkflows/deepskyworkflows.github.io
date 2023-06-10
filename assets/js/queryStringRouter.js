window.deepSkyRouter = (() => {
    const router = {

        hash: "",

        getHash: () => router.hash,

        setHash: hash => {
            window.location.hash = hash;
            router.hash = hash;
        },
        
        baseUrl: window.location.href.split('#')[0].split('?')[0],

        incoming: decodeURI(window.location.search.substring(1)).split("&"),

        values: {},

        keys: [], 

        get: key => key && key.length ? router.values[key] : [...router.keys],
    
        set: (key, value) => {
            
            const pos = router.keys.indexOf(key);

            if (pos < 0) {
                router.keys.push(key);
            }

            router.values[key] = value;
            router.update();
        },

        reset: key => {
        
            const pos = router.keys.indexOf(key);

            if (pos >= 0) {
                router.keys.splice(pos, 1);
                delete router.values[key];
            }

            router.update();
        },

        update: (title) => {

            let str = '';
            title = title || 'Gallery Search';            

            if (router.keys.length) {
                
                title += ' (';
                
                for (let i = 0; i < router.keys.length; i++) {
                    
                    if (i > 0) {
                        str += "&";
                        title += ", ";
                    }
                    
                    title += `${router.keys[i]}=${router.values[router.keys[i]]}`;
                    str += router.keys[i];
                    str += "=";
                    str += router.values[router.keys[i]];               
                }
            }

            const query = `?${encodeURI(str)}`;
            const url = router.baseUrl;
            const hash = router.hash;
        
            const newState = {
                Title: `${title})`,
                Url: `${url}${query}${hash}`
            };

            window.location.hash = router.hash;
            window.history.pushState(newState, newState.Title, newState.Url); 
            
            return newState;
        }        
    };

    for (let i = 0; i < router.incoming.length; i++) {
        const keyValue = router.incoming[i].split("=");
        if (keyValue[0] && keyValue[0].length) {
            router.keys.push(keyValue[0]);
            router.values[keyValue[0]] = keyValue[1];
            router.set(keyValue[0], keyValue[1]);
        }
    }

    return router;
})();