import { Matrix } from "ts-matrix";

export default class MatrixExt extends Matrix {
    row(index: number): number[] {
        if (index >= this.rows) {
            throw new Error("Row index cannot be larger or equal than the number of rows.");
        }
        return this.values[index];
    }

    allRows(): number[][] {
        return this.values;
    }

    column(index: number): number[] {
        if (index >= this.columns) {
            throw new Error("Column index cannot be larger or equal than the number of columns.");
        }
        const ret: number[] = [];
        for (let i = 0; i < this.rows; i++) {
            ret.push(this.at(i, index));
        }
        return ret;
    }

    allColumns(): number[][] {
        return this.transpose().values;
    }

}