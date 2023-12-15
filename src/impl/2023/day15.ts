import { Solver } from "../solver";
import _ from "lodash";
import { HashMap } from "../../util/hashMap";

export default class Day15 extends Solver {

    input: string[];
    boxes = new HashMap<number, {label: string, focal: number}[]>();

    constructor(origInput: string) {
        super(origInput);
        this.input = origInput.split(",");
    }

    private hash(s: string): number {
        let r = 0;

        for (let i = 0; i < s.length; i++) {
            const a = s.charCodeAt(i);
            r += a;
            r*=17;
            r=r%256;
        }

        return r;
    }


    part1(): string | number {
        return _.sum(this.input.map(s => this.hash(s)));
    }

    part2(): string | number {
        for (let i of this.input) {
            const p = i.split(/[-|=]/);
            const hash = this.hash(p[0]);
            const op = p[1] === '' ? 0 : 1;
            const focal = op === 1 ? Number.parseInt(p[1]) : 0;
            const box = this.boxes.get(hash);
            const slot = this.slot(p[0], focal);
            if (box === undefined) {
                this.boxes.set(hash, [slot])
            } else {
                const idx = box.findIndex(s => s.label === slot.label);
                if (idx === -1) {
                    if (op === 1) {
                        box.push(slot);
                    }
                } else {
                    if (op === 0) {
                        box.splice(idx, 1);
                    } else {
                        box[idx].focal = slot.focal;
                    }
                }
            }
        }
        return this.countBoxes();
    }

    countBoxes() {
        let ret = 0;
        for (let key of this.boxes.getKeys()) {
            if (this.boxes.get(key).length === 0) {
                continue;
            }
            for (let i = 0; i < this.boxes.get(key).length; i++) {
                const slot = this.boxes.get(key)[i];
                ret += (key+1)*(i+1)*slot.focal;
            }
        }
        return ret;
    }

    private slot(label: string, focal: number) {
        return {label, focal};
    }

}