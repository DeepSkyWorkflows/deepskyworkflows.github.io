window.gallerydbpromise = window.gallerydbpromise || (async function () {

    const addOnce = (item, coll) => {
        if (!coll.includes(item)) {
            coll.push(item);
            return true;
        }
        return false;
    };

    const addIndex = (index, key, item) => {
        const idx = index.hasOwnProperty(key) ? index[key] :
            { key: key, values: [] };
        idx.values.push(item);
        if (!index.hasOwnProperty(key)) {
            index[key] = idx;
        }
    };

    const internaldb = {

        db: await fetch("/gallery-database.json").then(r => r.json()),

        ready: false,

        idx: {

        },

        types: [],
        typeIdx: {},

        telescopes: [],
        telescopeIdx: {},

        focalLengths: [],
        focalLengthIdx: {},

        exposures: [],
        exposureIdx: {},

        groupIdx: {},

        signatures: [],
        notsignatures: [],

        archived: [],
        notarchived: [],

        dates: [],
        dateIdx: {},

        init: () => {
            const initialized = [];
            for (let idx = 0; idx < internaldb.db.gallery.length; idx++) {

                const item = internaldb.db.gallery[idx];
                const key = item.folder;
                if (!(key && key.length > 0)) {
                    continue;
                }
                if (item.rightAscension) {
                    const fov = item.radius.substring(0, item.radius.indexOf(' '));
                    const parts = item.rightAscension.split(' ');
                    const hours = parseInt(parts[0].replace(/^\D+/g, ''));
                    const minutes = parseInt(parts[1].replace(/^D+/g, '')) / 60.0;
                    const seconds = parseInt(parts[2].replace(/^D+/g, '')) / 3600.0;
                    const rIdx = hours + minutes + seconds;
                    item.ra = { idx: rIdx, h: hours, m: minutes, s: seconds };
                    const decSign = item.declination[0] === '-' ? -1 : 1;
                    const decParts = item.declination.split(' ');
                    const degrees = parseInt(decParts[0].substring(1).replace(/^D+/g, ''));
                    const decMinutes = parseInt(decParts[1].replace(/^D+/g, '')) / 60;
                    const decSeconds = parseInt(decParts[2].replace(/^D+/g, '')) / 3600;
                    const dec = (decSign) * (degrees + decMinutes + decSeconds);
                    item.dec = {
                        dec: dec,
                        degrees: degrees,
                        arcMinutes: decMinutes,
                        arcSeconds: decSeconds,
                        sign: decSign == 1 ? "+" : "-"
                    };
                    item.wwtCoord = `https://worldwidetelescope.org/webclient/#ra=${item.ra.idx}&dec=${item.dec.dec}&fov=${fov}`;
                }

                if (!(item.tags)) {
                    item.tags = [];
                }                

                item.archive = item.archive === "true";
                item.signature = item.signature === "true";
                item.nostars = item.nostars === "true";
                item.annotations = item.noannotations !== "true";

                if (!(item.imageUrl)) {
                    continue;
                }

                item.converted = {
                    text: `^${item.title}^${item.description}^${item.tags.join("^")}^`.toLowerCase(),
                    focalLength: parseInt(item.focalLength.replace(/^[a-zA-z]+$/, '')),
                    firstCapture: parseInt(item.firstCapture.substring(0, 4)) * 10000 +
                        parseInt(item.firstCapture.substring(5, 7) * 100 +
                            parseInt(item.firstCapture.substring(8, 10))),
                    lastCapture: parseInt(item.lastCapture.substring(0, 4)) * 10000 +
                        parseInt(item.lastCapture.substring(5, 7) * 100 +
                            parseInt(item.lastCapture.substring(8, 10))),
                    exposure: parseInt(item.exposure)
                };

                internaldb.idx[key] = item;

                addOnce(item.type, internaldb.types);
                addIndex(internaldb.typeIdx, item.type, key);

                addOnce(item.telescope, internaldb.telescopes);
                addIndex(internaldb.telescopeIdx, item.telescope, key);

                addOnce(item.converted.focalLength, internaldb.focalLengths);
                addIndex(internaldb.focalLengthIdx, item.converted.focalLength, key);

                addOnce(item.converted.exposure, internaldb.exposures);
                addIndex(internaldb.exposureIdx, item.converted.exposure, key);

                if (item.group && item.group.length) {
                    addIndex(internaldb.groupIdx, item.group, key);
                }

                if (item.signature) {
                    internaldb.signatures.push(key);
                } else {
                    internaldb.notsignatures.push(key);
                }

                if (item.archive) {
                    internaldb.archived.push(key);
                } else {
                    internaldb.notarchived.push(key);
                }

                addOnce(item.converted.firstCapture, internaldb.dates);
                addIndex(internaldb.dateIdx, item.converted.firstCapture, key);

                if (item.converted.firstCapture != item.converted.lastCapture) {
                    addOnce(item.converted.lastCapture, internaldb.dates);
                    addIndex(internaldb.dateIdx, item.converted.lastCapture, key);
                }

                var img = new Image();

                img.dataset.fullImg = `${window.location.origin}/${item.imageUrl}`;
                img.dataset.url = `${window.location.origin}/gallery/${item.folder}/`;

                if (img.nostars) {
                    img.dataset.nostarsImg = img.dataset.fullImg.replace(".jpg", "-nostars.jpg");
                }

                if (img.annotations) {
                    img.dataset.annotatedImg = img.dataset.fullImg.replace(".jpg", "-annotated.jpg");
                    img.dataset.annotatedFullImg = img.dataset.fullImg.replace(".jpg", "-annotated-fs.jpg");
                    img.dataset.gridImg = img.dataset.fullImg.replace(".jpg", "-grid.jpg");
                }

                img.setAttribute("src", `${window.location.origin}/${item.thumbnailUrl}`);
                img.setAttribute("title", item.description);
                img.setAttribute("alt", item.description);

                item.img = img;
                initialized.push(item);
            }
            internaldb.db.gallery = initialized;
        },

        sort: { sortCol: "lastCapture", ascending: false },
        predicates: [{
            col: "signature",
            op: "eq",
            val1: true
        }]
    };

    internaldb.init();

    const sorts = {

        sort: (col, item1, item2, asc) => {
            let result = sorts[col](item1, item2);
            return asc === false ? result : result * -1;
        },

        "title": (item1, item2) =>
            item1.title < item2.title ? 1 : -1,

        "date": (item1, item2) => sorts["firstCapture"](item1, item2),

        "lastCapture": (item1, item2) => {
            if (!(item1.converted)) {
                return 1;
            }
            const date1 = item1.converted.lastCapture * 100000000 + item1.converted.firstCapture;
            const date2 = item2.converted.lastCapture * 100000000 + item2.converted.firstCapture;
            if (date1 === date2) {
                return sorts.title(item1, item2);
            }
            return date2 - date1;
        },

        "firstCapture": (item1, item2) => {
            const date1 = item1.converted.firstCapture * 100000000 + item1.converted.lastCapture;
            const date2 = item2.converted.firstCapture * 100000000 + item2.converted.lastCapture;
            if (date1 === date2) {
                return sorts.title(item1, item2);
            }
            return date1 - date2;
        }
    };

    const db = {

        lastOp: null,

        getSorts: () => [...["title", "date", "lastCapture", "firstCapture"]].sort(),

        getTypes: () => [...internaldb.types].sort(),

        getTelescopes: () => [...internaldb.telescopes].sort(),

        getExposures: () => [...internaldb.exposures].sort((a, b) => (parseInt(a) - parseInt(b))),

        getFocalLengths: () => [...internaldb.focalLengths].sort((a, b) => (parseInt(a) - parseInt(b))),

        setSort: (sortCol, asc) =>
            internaldb.sort = { sortCol: sortCol, ascending: asc },

        setPredicate: (col, op, val1, val2) =>
            internaldb.predicates =
            (col === undefined || col === null || col === "")
                ? []
                : [{
                    col: col,
                    op: op,
                    val1: val1,
                    val2: val2
                }],

        addPredicate: (col, op, val1, val2) => {
            internaldb.predicates.push({
                col: col,
                op: op,
                val1: val1,
                val2: val2
            });
        },

        getItem: key => internaldb.idx[key],

        bindToItem: (img, key) => {
            const item = db.getItem(key);
            img.setAttribute("src", "/assets/images/loading.gif");
            img.setAttribute("title", item.description);
            img.setAttribute("alt", item.description);
            item.img.addEventListener("load", () => {
                img.setAttribute("src", item.img.src);
            });
            if (item.img.complete) {
                img.setAttribute("src", item.img.src);
            }
            img.dataset.folder = key;
            return img;
        },

        makeAbsoluteUrl: (url) => {
            const path = url.substring(0, 1) === "/" ? url.substring(1) : url;
            return `${window.location.protocol}//${window.location.host}/${path}`;
        },

        groupBy: (col) => {
            const result = db.getItems();
            const groups = [];
            const groupIdx = {};
            const groupedResult = [];

            for (let idx = 0; idx < result.length; idx++) {
                const item = result[idx];
                const group = item[col];
                if (groupIdx[group] === undefined) {
                    groupIdx[group] = [];
                    groups.push({
                        group: group,
                        items: groupIdx[group]
                    });
                }
                groups[group].push(item)
            }

            return groups;
        },

        getItems: (limit = 10) => {

            let predicate = null;

            let op = `Sorted ${internaldb.sort.ascending === true ? 'ascending' : 'descending'} by ${internaldb.sort.sortCol}. `;

            if (internaldb.predicates.length > 0) {
                op = `${op}Filtering by `;
            }

            const filters = [];

            const sort = (item1, item2) =>
                sorts.sort(internaldb.sort.sortCol, item1, item2, internaldb.sort.ascending);

            // type, telescope, focallength, exposure, date eq, signature, archived

            const fnCombine = (predicate1, predicate2) =>
                item => predicate1(item) && predicate2(item);

            for (let idx = 0; idx < internaldb.predicates.length; idx++) {

                let predicateDefinition = internaldb.predicates[idx];

                let newPredicate = null;

                switch (predicateDefinition.col) {

                    case ("title"):
                        newPredicate = item => item.title.indexOf(predicateDefinition.val1) >= 0;
                        filters.push(`title contains ${predicateDefinition.val1}'`);
                        break;

                    case ("description"):
                        newPredicate = item => item.description.indexOf(predicateDefinition.val1) >= 0;
                        filters.push(`description contains ${predicateDefinition.val1}'`);
                        break;

                    case ("text"):
                        newPredicate = item => item.converted.text.indexOf(predicateDefinition.val1.toLowerCase()) >= 0;
                        filters.push(`text contains ${predicateDefinition.val1}`);
                        break;

                    case ("tags"):
                        newPredicate = item => item.tags.includes(predicateDefinition.val1);
                        filters.push(`tags contains ${predicateDefinition.val1}`);
                        break;

                    case ("type"):
                        newPredicate = item => item.type === predicateDefinition.val1;
                        filters.push(`type is ${predicateDefinition.val1}`);
                        break;

                    case ("signature"):
                        newPredicate = item => item.signature === predicateDefinition.val1;
                        filters.push(`signature is ${predicateDefinition.val1}`);
                        break;

                    case ("prints"):
                        newPredicate = item => !!(item.printUrl && item.printUrl.length)
                            === predicateDefinition.val1;
                        filters.push(`prints is ${predicateDefinition.val1}`);
                        break;

                    case ("archive"):
                        newPredicate = item => item.archive === predicateDefinition.val1;
                        filters.push(`archive is ${predicateDefinition.val1}`);
                        break;

                    case ("telescope"):
                        newPredicate = item => item.telescope === predicateDefinition.val1;
                        filters.push(`telescope is ${predicateDefinition.val1}`);
                        break;

                    case ("exposure"):
                        predicateDefinition.val1 = Number(predicateDefinition.val1);
                        switch (predicateDefinition.op) {
                            case "lt":
                                newPredicate = item => item.converted.exposure < predicateDefinition.val1;
                                filters.push(`exposure is less than ${predicateDefinition.val1}`);
                                break;

                            case "gt":
                                newPredicate = item => item.converted.exposure > predicateDefinition.val1;
                                filters.push(`exposure is greater than ${predicateDefinition.val1}`);
                                break;

                            case "eq":
                                newPredicate = item => item.converted.exposure === predicateDefinition.val1;
                                filters.push(`exposure is equal to ${predicateDefinition.val1}`);
                                break;

                            case "between":
                                newPredicate = item => item.converted.exposure >= predicateDefinition.val1
                                    && item.converted.exposure <= predicateDefinition.val2;
                                filters.push(`exposure is between ${predicateDefinition.val1}' and ${predicateDefinition.val2}`);
                                break;
                        }

                        if (newPredicate !== null) {
                            let newerPredicate = newPredicate;
                            newPredicate = fnCombine(item => !!(item.converted), newerPredicate);
                        }

                        break;

                    case ("focallength"):
                        predicateDefinition.val1 = Number(predicateDefinition.val1);
                        switch (predicateDefinition.op) {
                            case "lt":
                                newPredicate = item => item.converted.focalLength < predicateDefinition.val1;
                                filters.push(`focal length is less than ${predicateDefinition.val1}`);
                                break;

                            case "gt":
                                newPredicate = item => item.converted.focalLength > predicateDefinition.val1;
                                filters.push(`focal length is greater than ${predicateDefinition.val1}`);
                                break;

                            case "eq":
                                newPredicate = item => item.converted.focalLength === predicateDefinition.val1;
                                filters.push(`focal length is equal to ${predicateDefinition.val1}`);
                                break;

                            case "between":
                                newPredicate = item => item.converted.focalLength >= predicateDefinition.val1
                                    && item.converted.focalLength <= predicateDefinition.val2;
                                filters.push(`focal length is between ${predicateDefinition.val1}' and ${predicateDefinition.val2}`);
                                break;
                        }

                        if (newPredicate !== null) {
                            let newerPredicate = newPredicate;
                            newPredicate = fnCombine(item => !!(item.converted), newerPredicate);
                        }

                        break;

                    case ("captureDate"):
                        switch (predicateDefinition.op) {
                            case "lt":
                                newPredicate = item => item.converted.lastCapture < predicateDefinition.val1;
                                filters.push(`capture date is less than ${predicateDefinition.val1}`);
                                break;

                            case "gt":
                                newPredicate = item => item.converted.firstCapture > predicateDefinition.val1;
                                filters.push(`capture date is greater than ${predicateDefinition.val1}`);
                                break;

                            case "eq":
                                newPredicate = item => (item.converted.firstCapture === predicateDefinition.val1
                                    || item.converted.lastCapture === predicateDefinition.val1);
                                filters.push(`capture date is equal to ${predicateDefinition.val1}`);
                                break;

                            case "between":
                                newPredicate = item => item.converted.firstCapture >= predicateDefinition.val1
                                    && item.converted.lastCapture <= predicateDefinition.val2;
                                filters.push(`capture date is between ${predicateDefinition.val1}' and ${predicateDefinition.val2}`);
                                break;
                        }

                        if (newPredicate !== null) {
                            let newerPredicate = newPredicate;
                            newPredicate = fnCombine(item => !!(item.converted), newerPredicate);
                        }

                        break;
                }

                if (newPredicate !== null) {
                    if (predicate === null) {
                        predicate = newPredicate;
                    } else {
                        const oldPredicate = predicate;
                        predicate = fnCombine(oldPredicate, newPredicate);
                    }
                }
            }

            predicate = predicate || (() => true);
            db.lastOp = filters.length ? `${op} ${filters.join(", ")}` : op;
            const result = [...internaldb.db.gallery.filter(predicate)].sort(sort);
            db.lastOp += ` (${result.length > 0 ? result.length : 'no' } results)`;
            return limit > 0 && result.length > limit 
                ? result.slice(0, limit)
                : result;
        }
    };

    db.setSort("lastCapture", false);
    db.setPredicate("signature", "eq", true);

    return db;
})();

(async () => window.gallerydb = await window.gallerydbpromise)();