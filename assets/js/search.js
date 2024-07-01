const searchInit = async (queryRouter, domHelper) => {

    const searchDom = {

        searchInput: document.getElementsByClassName('search-input')[0],
        searchProgress: document.getElementsByClassName('search-progress')[0],
        searchResults: document.getElementsByClassName('search-results')[0],
        searchStatus: document.getElementsByClassName('search-status')[0],

        progress: {},

        timer: {
            start: null,
            end: null,
        },

        focusAndSelect: () => {
            searchDom.searchInput.focus();
            domHelper.runNext(() => searchDom.searchInput.select());
        }
    };

    const constants = {
        vectorblock: 2048
    };

    searchDom.progress = domHelper.progress(searchDom.searchProgress);

    const parser = (text) =>
        text.toLowerCase()
            .trim()
            .replace(/[^a-z0-9]/g, ' ')
            .split(' ')
            .filter((word) => word.length > 2);

    const db = {

        debounce: null,
        data: [],
        dictionary: [],
        vectors: {},
        documents: {},

        composeVectors: (vectors) => {

            let idx = 0;

            for (let index = 0; index < vectors.length; index++) {
                idx *= constants.vectorblock;
                const vector = vectors[index];
                idx += vector.vector;
            }

            if (!(db.vectors[idx])) {
                db.vectors[idx] = {
                    vector: idx,
                    count: 0,
                    documents: [],
                    weight: Math.pow(10, vectors.length - 1),
                    words: vectors.map(v => v.word)
                };
            }

            db.vectors[idx].count++;

            return { ...db.vectors[idx], count: 1 };
        },

        refWord: (word) => {
            const index = db.dictionary.indexOf(word);
            return { ...db.vectors[index] } ?? null;
        },

        parseWord: word => {
            if (db.dictionary.indexOf(word) < 0) {
                db.dictionary.push(word);
                const index = db.dictionary.indexOf(word);
                db.vectors[index] = {
                    vector: index,
                    count: 0,
                    documents: [],
                    word: word,
                    weight: 1
                };
            }
            const index = db.dictionary.indexOf(word);
            db.vectors[index].count++;
            return { ...db.vectors[index], count: 1 };
        },

        parseText: text => {

            const words = parser(text);
            const indexer = [];
            const indexes = [];

            const handleVector = (vector) => {
                if (vector) {
                    const vectorIdx = indexer.indexOf(vector.vector);
                    if (vectorIdx >= 0) {
                        indexes[vectorIdx].count++;
                    }
                    else {
                        indexes.push({ ...vector, count: 1 });
                    }
                }
            };

            for (let idx = 0; idx < words.length; idx++) {

                const vector = db.parseWord(words[idx]);

                handleVector(vector, indexes);

                if (idx > 1) {
                    const previousVector = db.refWord(words[idx - 1]);
                    if (previousVector) {
                        const vectortwo = db.composeVectors([previousVector, vector]);
                        handleVector(vectortwo, indexes);
                        if (idx > 2) {
                            const previousPreviousVector = db.refWord(words[idx - 2]);
                            if (previousPreviousVector) {
                                const vectorThree = db.composeVectors([previousPreviousVector, previousVector, vector]);
                                handleVector(vectorThree, indexes);
                            }
                        }
                    }
                }
            }

            return indexes;
        },

        indexPage: data => {

            if (!(data)) return null;

            const titleVectors = (data.title ? db.parseText(data.title) : [])
                .map(v => { return { ...v, weight: v.weight * 1000 }; });

            const descriptionVectors = (data.description ? db.parseText(data.description) : [])
                .map(v => { return { ...v, weight: v.weight * 100 }; });

            const contentVectors = (data.content ? db.parseText(data.content) : [])
                .map(v => { return { ...v, weight: v.weight * 100 }; });

            const tagVectors = (data.tags && data.tags.length ?
                data.tags.map(db.parseText) : [])
                .map(v => { return { ...v, weight: v.weight * 10 }; });

            const categoryVectors = (data.categories && data.categories.length ?
                data.categories.map(db.parseText) : [])
                .map(v => { return { ...v, weight: v.weight * 50 }; });

            const documentVectors = [...titleVectors, ...descriptionVectors, ...contentVectors, ...tagVectors, ...categoryVectors];

            const indexer = [];
            const parsedVectors = [];

            for (let vIdx = 0; vIdx < documentVectors.length; vIdx++) {

                const vector = documentVectors[vIdx];

                if (vector && vector.vector) {

                    if (db.vectors[vector.vector].documents.indexOf(data.url) < 0) {
                        db.vectors[vector.vector].documents.push(data.url);
                    }

                }

                if (indexer.indexOf(vector.vector) < 0) {
                    parsedVectors.push({ ...vector, documents: [data.url] });
                    indexer.push(vector.vector);
                }
                else {
                    const existingIdx = indexer.indexOf(vector.vector);
                    const existingVector = parsedVectors[existingIdx];
                    existingVector.count += vector.count;
                    existingVector.weight += vector.weight;
                }
            }

            db.documents[data.url] = {
                data,
                vectorIndexer: parsedVectors.map(v => v.vector),
                parsedVectors
            };

            return parsedVectors;
        }
    };

    const initalize = async (data) => {

        searchDom.progress.set(30);

        const progress = {
            current: 0,
            total: data.search.length
        }

        for (const item of data.search) {
            db.indexPage(item);
            progress.current++;
            const pct = 30 + 70 * (progress.current / progress.total);
            searchDom.progress.set(pct);
        }
    };

    const searchInit = async () => {

        queryRouter.parseIncoming();

        domHelper.show(searchDom.searchProgress);
        domHelper.message(searchDom.searchStatus, "info", "Loading the search database...");

        const response = await fetch('/search-database.json');

        searchDom.progress.set(10);
        const data = await response.json();

        searchDom.progress.set(20);
        domHelper.message(searchDom.searchStatus, "info", "Search database loaded. Parsing data...");

        searchDom.timer.start = new Date().getTime();
        await initalize(data);
        searchDom.timer.end = new Date().getTime();
        searchDom.progress.set(100);

        domHelper.message(searchDom.searchStatus, "success", `Vectors parsed and loaded in ${searchDom.timer.end - searchDom.timer.start}ms.`);
        searchDom.searchInput.removeAttribute('disabled');
    };

    await searchInit();

    const search = () => {

        if (!(searchDom.searchInput.value)) {
            return;
        }

        searchDom.timer.start = new Date().getTime();

        const searchReq = searchDom.searchInput.value.trim().toLowerCase();

        domHelper.message(searchDom.searchStatus, "info",
            `Initiating search on phrase: ${searchDom.searchInput.value}`);

        domHelper.clear(searchDom.searchResults);

        if (searchReq.length < 3) {
            domHelper.message(searchDom.searchStatus, "warning",
                "Search phrase must be at least 3 characters long.");
            return;
        }

        const searchWords = parser(searchReq);

        if (searchWords.length < 1) {

            domHelper.message(searchQuery.searchStatus, "warning",
                "Unable to parse search phrase.");
            return;
        }

        queryRouter.set('q', searchReq);

        const searchVectors = db.parseText(searchReq);
        const documentsIndexer = [];
        const documentsList = [];
        let maxWeight = 0;
        const matchedVectors = {
            total: searchVectors.length,
            matched: 0
        };

        for (let vector of searchVectors) {

            const dbVector = db.vectors[vector.vector];
            let hit = false;

            if (dbVector) {
                for (const document of db.vectors[vector.vector].documents) {
                    const doc = db.documents[document];
                    const weight = doc.parsedVectors[doc.vectorIndexer.indexOf(vector.vector)].weight;

                    if (documentsIndexer.indexOf(document) < 0) {
                        if (!hit) {
                            hit = true;
                            matchedVectors.matched++;
                        }
                        documentsIndexer.push(document);
                        documentsList.push({ document, weight });
                        if (weight > maxWeight) {
                            maxWeight = weight;
                        }
                    }
                    else {
                        const idx = documentsIndexer.indexOf(document);
                        documentsList[idx].weight += weight;
                        if (documentsList[idx].weight > maxWeight) {
                            maxWeight = documentsList[idx].weight;
                        }
                    }
                }
            }
        };

        queryRouter.update();

        if (documentsList.length < 1) {
            domHelper.message(searchDom.searchStatus, "warning", `No results found for search phrase: '${searchDom.searchInput.value}'.`);
            return;
        }

        searchDom.timer.end = new Date().getTime();

        if (documentsList.length > 0) {
            domHelper.message(searchDom.searchStatus,
                "success",
                `Found ${documentsList.length} results.`);

            documentsList.sort((a, b) => b.weight - a.weight);

            const range = {
                minWeight: 99999,
                maxWeight: 0
            };

            for (let docIdx = 0; docIdx < documentsList.length; docIdx++) {
                const weight = documentsList[docIdx].weight;
                if (weight < range.minWeight) {
                    range.minWeight = weight;
                }
                if (weight > range.maxWeight) {
                    range.maxWeight = weight;
                }

                const ratio = (weight - range.minWeight) / (range.maxWeight - range.minWeight);
                const pct = Math.floor(100 * ratio);
                documentsList[docIdx].pct = weight > 2000 ? pct : 0;
            }

            for (let docIdx = 0; docIdx < documentsList.length; docIdx++) {

                const doc = db.documents[documentsList[docIdx].document];

                const parts = [];

                const icon = doc.data.url.indexOf("gallery/") >= 0 ?
                    "image" : doc.data.url.indexOf("video/") >= 0 ?
                        "youtube" : doc.data.url.indexOf("https://") === 0 ?
                            "wrench" : "file";

                const hint = domHelper.elem('span', {
                    class: `fa fa-${icon}`,
                    title: icon,
                    innerHTML: ''
                });

                const title = domHelper.elem('h3', {},
                    [domHelper.elem('a',
                        {
                            href: doc.data.url,
                            class: 'search-result-link'
                        },
                        [hint, ` ${doc.data.title}`])]);

                parts.push(title);

                if (doc.data.thumb && doc.data.thumb.length > 0) {
                    const thumbLink = domHelper.elem('a', {
                        href: doc.data.url,
                        class: 'search-result-link'
                    }, [domHelper.elem('img', {
                        src: doc.data.thumb,
                        class: 'search-result-thumb',
                        title: doc.data.title,
                        alt: doc.data.title
                    })]);
                    parts.push(thumbLink);
                }

                if (doc.data.image && doc.data.image.length > 0) {
                    const imageLink = domHelper.elem('a', {
                        href: doc.data.url,
                        class: 'search-result-link'
                    }, [domHelper.elem('img', {
                        src: doc.data.image,
                        class: 'search-result-image',
                        title: doc.data.title,
                        alt: doc.data.title
                    })]);
                    parts.push(imageLink);
                }

                const description = domHelper.elem('p', {
                    innerText: doc.data.description
                });

                parts.push(description);

                const more = domHelper.elem('small', {},
                    [domHelper.elem('a', {
                        href: doc.data.url,
                        class: 'search-result-link',
                        innerText: "(more...)"
                    })]);

                parts.push(more);

                const result = domHelper.elem('div',
                    {
                        class: 'search-result'
                    },
                    [...parts]);

                searchDom.searchResults.appendChild(result);
            }

            domHelper.message(searchDom.searchStatus, "success", `Search found ${documentsList.length} pages in ${searchDom.timer.end - searchDom.timer.start}ms.`);            
        }
    };

    domHelper.hide(searchDom.searchProgress);
    domHelper.show(searchDom.searchInput);

    searchDom.searchInput.addEventListener('focus', () => searchDom.searchInput.select());
    searchDom.searchInput.addEventListener('blur', () => search());

    searchDom.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchDom.searchInput.blur();
        }

        if (e.key === 'Enter') {
            search();
        }
    });

    if (queryRouter.get('q') && queryRouter.get('q').length > 0) {
        searchDom.searchInput.value = queryRouter.get('q');
        search();
    } else {
        searchDom.focusAndSelect();
    }
};

window.dsw.loader.bootstrap(
    ["router", "domHelper"],
    ctx => searchInit(ctx.router, ctx.domHelper));