import { Matrix } from "ts-matrix";
import _ from "lodash";

export default class MatrixExt extends Matrix {

    static of(values: number[][]): MatrixExt {
        return new MatrixExt(values.length, values[0].length, values);
    }

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

    transpose(): MatrixExt {
        return MatrixExt.of(super.transpose().values);
    }

    flipVertical(): MatrixExt {
        return MatrixExt.of(this.values.map(l => l.reverse()));
    }

    rotateLeft(): MatrixExt {
        const matrix = this.values;
        const numRows = matrix.length;
        const numCols = matrix[0].length;

        const rotatedMatrix: number[][] = [];

        for (let col = numCols - 1; col >= 0; col--) {
            const newRow: number[] = [];
            for (let row = 0; row < numRows; row++) {
                newRow.push(matrix[row][col]);
            }
            rotatedMatrix.push(newRow);
        }

        return MatrixExt.of(rotatedMatrix);
    }

    rotateRight(): MatrixExt {
        const matrix = this.values;
        const numRows = matrix.length;
        const numCols = matrix[0].length;

        const rotatedMatrix: number[][] = [];

        for (let col = 0; col < numCols; col++) {
            const newRow: number[] = [];
            for (let row = numRows - 1; row >= 0; row--) {
                newRow.push(matrix[row][col]);
            }
            rotatedMatrix.push(newRow);
        }
        return MatrixExt.of(rotatedMatrix);
    }

    clone(): MatrixExt {
        return MatrixExt.of(_.cloneDeep(this.values));
    }

}