console.log("Loader.js loaded.");

const loader = {

    resources: {
        domHelper: "dom_helper.js",
        gallerydb: "gallerydb.js",
        router: "querystringrouter.js",
        pubsub: "pubsub.js" 
    },

    loaded: [],

    apis: {},

    loadRequest: (req, cb) => {

        const metaFile = req.trim().toLowerCase();

        if (loader.loaded.indexOf(metaFile) > -1) {
            console.log("Already loaded", metaFile);
            if (cb) {
                cb(true);
            }
            return;
        }

        if (metaFile.indexOf(".js") > 0) {
            console.log("Loading script", metaFile);
            const script = document.createElement("script");

            if (cb) {
                script.onload = () => cb(true);
                script.onerror = () => cb(false);
            }

            script.src = `/assets/js/${metaFile}`;
            script.type = "module";
            document.head.appendChild(script);
            loader.loaded.push(metaFile);

        } else if (metaFile.indexOf(".css") > 0) {
            console.log("Loading stylesheet", metaFile);
            const link = document.createElement("link");

            if (cb) {
                link.onload = () => cb(true);
                link.onerror = () => cb(false);
            }

            link.rel = "stylesheet";
            link.href = `/assets/css/${metaFile}`;
            loader.loaded.push(metaFile);
            document.head.appendChild(link);
        }
    },

    init: () => {

        for (let i = 0; i < window.dsw.deferredQueue.length; i++) {
            loader.loadRequest(window.dsw.deferredQueue[i]);        
        }                
    },

    bootstrap: (deps, cb) => {
        
        const iteration = ctx => {
            if (ctx.idx >= deps.length) {
                cb(ctx.results);
            }
            else {
                loader.resolveApi(deps[ctx.idx]).then(result => {
                    ctx.results[deps[ctx.idx]] = result;
                    ctx.idx++;
                    iteration(ctx);
                });
            }
        };
        
        iteration({
            idx: 0,
            results: {}
        });        
    },

    resolveApi: name => new Promise((resolve, reject) => {

        if (!(loader.apis[name])) {

            if (loader.resources[name]) {

                loader.loadRequest(loader.resources[name], success => {
        
                    if (success) {
                        setTimeout(() => {
                            loader.resolveApi(name)
                                .then(result => resolve(result))
                                .catch(err => reject(err));
                        });
                    }
                    else {
                    reject(`API ${name} failed to load`);
                    }
                });                
            }
            else {
                reject(`API ${name} not found`);
            }
        }
        else {     
            const factory = loader.apis[name];

            if (factory instanceof Promise) {
                factory.then(result => resolve(result));            
                return;
            }

            if (typeof factory === "function") {
                resolve(factory());
                return;
            }

            resolve(factory);
        }
    }),

    registerApi: (name, apiFactory, deps) => new Promise((resolve, reject) => {
        console.log("Registering API", name, apiFactory, deps);
        if (loader.apis[name]) {
            resolve(true);
        } else {
            if (deps && deps.length) {
                const depQueue = [];
                for (let i = 0; i < deps.length; i++) {
                    depQueue.push(loader.loadRequest(deps[i]));
                }
                Promise.all(promises).then(() => {
                    loader.apis[name] = apiFactory();
                    resolve(true);
                });
            } else {
                loader.apis[name] = apiFactory();
                resolve(true);
            }
        }
    })
};

window.dsw.loader = loader;

setTimeout(loader.init);