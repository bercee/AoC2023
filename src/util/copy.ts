export function deepCopy2DArray<T>(originalArray: T[][]): T[][] {
    return originalArray.map(row => [...row]);
}