export class HashMap<K, V> {
    private map: { [hashedKey: string]: { key: K; value: V } } = {};

    constructor(private hashFunction: (key: K) => string = JSON.stringify) {}

    set(key: K, value: V): void {
        const hash = this.hashFunction(key);
        this.map[hash] = { key, value };
    }

    get(key: K): V | undefined {
        const hash = this.hashFunction(key);
        return this.map[hash]?.value;
    }

    delete(key: K): void {
        const hash = this.hashFunction(key);
        delete this.map[hash];
    }

    has(key: K): boolean {
        const hash = this.hashFunction(key);
        return this.map.hasOwnProperty(hash);
    }

    getKeys(): K[] {
        return Object.values(this.map).map(entry => entry.key);
    }
}