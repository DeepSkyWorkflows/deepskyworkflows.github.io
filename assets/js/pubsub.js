const pubsub = {

    events: {},

    backlog: [],

    subscribe: (event, callback) => {
        if (!pubsub.events[event]) {
            pubsub.events[event] = [];
        }
        pubsub.events[event].push(callback);
        for (let idx = 0; idx < pubsub.backlog.length; idx++) {
            const item = pubsub.backlog[idx];
            if (item.event === event) {
                pubsub.publish(item.event, item.data);
                pubsub.backlog.splice(idx, 1);
                idx--;
            }
        }
    },

    publish: (event, data) => {
        
        if (!pubsub.events[event]) {
            pubsub.backlog.push({event, data});
            return;
        }

        pubsub.events[event].forEach(callback => {
            callback(data);
        });
    }
};

window.dsw.loader.registerApi("pubsub", () => pubsub);