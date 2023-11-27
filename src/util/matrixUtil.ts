import { Matrix } from "ts-matrix";

export function rowOf(matrix: Matrix, index: number) {
    if (index >= matrix.rows) {
        throw new Error("not enough rows");
    }
    const ret: number[] = [];
    for (let i = 0; i < matrix.columns; i++) {
        ret.push(matrix.at(index, i));
    }
    return ret;
}

export function columnOf(matrix: Matrix, index: number) {
    if (index >= matrix.columns) {
        throw new Error("not enough rows");
    }
    const ret: number[] = [];
    for (let i = 0; i < matrix.rows; i++) {
        ret.push(matrix.at(i, index));
    }
    return ret;
}
