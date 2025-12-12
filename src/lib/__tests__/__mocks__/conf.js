// Mock for conf package
class MockConf {
    constructor() {
        this.store = new Map();
    }

    get(key) {
        return this.store.get(key);
    }

    set(key, value) {
        this.store.set(key, value);
    }

    has(key) {
        return this.store.has(key);
    }

    delete(key) {
        return this.store.delete(key);
    }

    clear() {
        this.store.clear();
    }

    get size() {
        return this.store.size;
    }
}

module.exports = MockConf;
module.exports.default = MockConf;