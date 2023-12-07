import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import _ from "lodash";

const CARDS: string[] = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const CARD_IDXs = new Map(CARDS.map((v,i) => [v, i]));

function compare(c1: string[], c2: string[]): number {
    for (let i = 0; i < c1.length; i++) {
        const diff = CARD_IDXs.get(c1[i]) - CARD_IDXs.get(c2[i]);
        if (diff !==0 ) {
            return diff;
        }
    }
    return 0;
}

const CARDS2: string[] = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"];
const CARD_IDXs2 = new Map(CARDS2.map((v,i) => [v, i]));

function compare2(c1: string[], c2: string[]): number {
    for (let i = 0; i < c1.length; i++) {
        const diff = CARD_IDXs2.get(c1[i]) - CARD_IDXs2.get(c2[i]);
        if (diff !==0 ) {
            return diff;
        }
    }
    return 0;
}

interface Hand {
    cards: string[]
    bid: number;
    res?: number;
}

interface Test {
    (cards: string[]): boolean;
}

function createTest(arr: number[]): Test {
    return (cards: string[]) => {
        const g = _.groupBy(cards);
        const ls: number[] = [];
        for (let gKey in g) {
            const group = g[gKey];
            ls.push(group.length);
        }
        return _.isEqual(ls.sort(), arr);
    }
}

const TESTS: Test[] = [];

TESTS.push(createTest([5]));
TESTS.push(createTest([1,4]));
TESTS.push(createTest([2,3]));
TESTS.push(createTest([1,1,3]));
TESTS.push(createTest([1,2,2]));
TESTS.push(createTest([1,1,1,2]));
TESTS.push(createTest([1,1,1,1,1]));

function testRes(cards: string[]): number {
    return TESTS.findIndex(t => t(cards));
}




export default class Day7 extends Solver {

    input: string[];
    hands: Hand[] = [];


    constructor(origInput: string) {
        super(origInput);
        this.input = Parsers.asArray(origInput);
        this.hands = this.input.map(l => this.parseHand(l));
    }

    private parseHand(line: string): Hand {
        const p = line.split(" ");
        return {bid: Number.parseInt(p[1]), cards: p[0].split("")}
    }

    part1(): string | number {
        const hs = _.cloneDeep(this.hands);
        hs.sort((a, b) => {
            const diff = testRes(a.cards) - testRes(b.cards);
            if (diff !== 0) {
                return diff;
            } else {
                return compare(a.cards, b.cards);
            }
        })
        // console.log(hs);
        return _.sum(hs.map((h, idx) => h.bid*(hs.length-idx)))
    }

    part2(): string | number {
        const hs = _.cloneDeep(this.hands);
        for (let h of hs) {
            let min = testRes(h.cards);

            for (let r of CARDS2) {
                const csNew = h.cards.join("").replace(/J/g,r).split("");
                const res = testRes(csNew);
                if (res < min) {
                    min = res;
                }
            }
            h.res = min;
            // h.cards = minCs;

        }


        hs.sort((a, b) => {
            const diff = a.res - b.res;
            if (diff !== 0) {
                return diff;
            } else {
                return compare2(a.cards, b.cards);
            }
        })

        return _.sum(hs.map((h, idx) => h.bid*(hs.length-idx)));
    }

}