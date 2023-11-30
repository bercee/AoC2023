export class HashSet<T> {
    private set: { [key: string]: T } = {};

    constructor(private hashFunction: (item: T) => string = JSON.stringify) {}

    add(item: T): void {
        const hash = this.hashFunction(item);
        this.set[hash] = item;
    }

    has(item: T): boolean {
        const hash = this.hashFunction(item);
        return this.set.hasOwnProperty(hash);
    }

    delete(item: T): void {
        const hash = this.hashFunction(item);
        delete this.set[hash];
    }

    toArray(): T[] {
        return Object.values(this.set);
    }
}