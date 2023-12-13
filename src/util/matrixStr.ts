export function transpose(m: string[][]): string[][] {
    const ret: string[][] = [];
    for (let i = 0; i < m[0].length; i++) {
        ret[i] = [];
        for (let j = 0; j < m.length; j++) {
            ret[i][j] = m[j][i];
        }
    }
    return ret;
}