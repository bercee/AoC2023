import { Solver } from "../solver";
import { DirectedGraph } from "graphology";
import * as mr from 'multi-integer-range';
import { MultiIntegerRange } from 'multi-integer-range';
import { allSimplePaths } from 'graphology-simple-path';
import _ from "lodash";


interface Part {
    x: number;
    m: number;
    a: number;
    s: number;
}

interface TestData {
    prop: keyof Part;
    smaller: boolean;
    num: number;
}

interface Ranges {
    x: MultiIntegerRange;
    m: MultiIntegerRange;
    a: MultiIntegerRange;
    s: MultiIntegerRange;
}

function createFullRange(): Ranges {
    return { a: mr.parse('1-4000'), m: mr.parse('1-4000'), s: mr.parse('1-4000'), x: mr.parse('1-4000') };
}


function measureRange(range: Ranges): number {
    return mr.length(range.s) * mr.length(range.x) * mr.length(range.m) * mr.length(range.a);
}

function sumPart(p: Part) {
    return _.sum(Object.keys(p).map(k => p[k as keyof Part]));
}


type Test = (p: Part) => boolean;

function createTest(data: TestData): Test {
    return (p: Part) => {
        const v = p[data.prop];
        return data.smaller ? v < data.num: v > data.num;
    };
}


function createDefault(): Test {
    return () => true;
}

export default class Day19 extends Solver {

    input: Part[] = [];

    graph: DirectedGraph = new DirectedGraph();


    constructor(origInput: string) {
        super(origInput);
        this.parse(this.origInput);
    }

    private parse(str: string) {
        const blocks = str.split("\n\n");
        this.input = blocks[1].split("\n").map(l => l.replace(/([a-z])=/g,"\"$1\":")).map(l => JSON.parse(l) as Part)
        const workflows = blocks[0].split("\n");
        for (let w of workflows) {
            const ww = w.split(/[{|}]/);
            const name = ww[0];
            const tests = ww[1].split(",");
            for (let i = 0; i < tests.length; i++) {
                const testName = `${name}${i}`;
                this.graph.addNode(testName, {"test": createDefault()})
            }
        }

        this.graph.addNode('R0');
        this.graph.addNode('A0');

        for (let w of workflows) {
            const ww = w.split(/[{|}]/);
            const name = ww[0];
            const tests = ww[1].split(",");
            for (let i = 0; i < tests.length; i++) {
                const testName = `${name}${i}`;
                const nextTestName = `${name}${i+1}`;
                const testParts = tests[i].split(":");
                if (testParts.length === 1) {
                    this.graph.addEdge(testName, `${testParts[0]}0`);
                } else {
                    const destName = `${testParts[1]}0`;
                    const testData: TestData = {
                        prop: testParts[0].charAt(0) as keyof Part,
                        num: Number.parseInt(testParts[0].substring(2)),
                        smaller: testParts[0].charAt(1) === "<"
                    }
                    const test = createTest(testData);
                    this.graph.setNodeAttribute(testName, "test", test);
                    this.graph.setNodeAttribute(testName, "testData", testData);
                    this.graph.addEdge(testName, destName);
                    this.graph.addEdge(testName, nextTestName);
                }
            }
        }

        console.log(`nodes: ${this.graph.nodes().length}`);
        console.log(`edges: ${this.graph.edges().length}`);
    }

    private walk(p: Part): boolean {
        let node = "in0";
        while (true) {
            if (node === "A0") {
                return true;
            } else if (node === "R0") {
                return false;
            }
            const test = this.graph.getNodeAttributes(node)["test"] as Test;
            const targetNodes = this.graph.outEdges(node).map(e => this.graph.opposite(node, e));
            if (test(p)) {
                node = targetNodes[0];
            } else {
                node = targetNodes[1];
            }
        }
    }

    private modify(testData: TestData, ranges: Ranges, keep: boolean) {
        const key = testData.prop as keyof Ranges;
        const otherNum = testData.smaller ? 1 : 4000;
        const myNum = testData.smaller ? testData.num - 1 : testData.num +1;
        const range = mr.normalize([[otherNum, myNum]]);
        ranges[key] = keep ? mr.intersect(ranges[key], range) :  mr.subtract(ranges[key], range);
    }

    private processPath(path: string[]): Ranges {
        const ranges = createFullRange();
        for (let i = 0; i < path.length-1; i++) {
            const node = path[i];
            const outNodes = this.graph.outEdges(node).map(e => this.graph.opposite(node, e));
            let condition = outNodes[0] === path[i + 1];
            const testData = this.graph.getNodeAttribute(node, "testData");
            if (testData) {
                this.modify(testData, ranges, condition);
            }

        }
        return ranges;
    }

    part1(): string | number {
        return _.sum(this.input.filter(i => this.walk(i)).map(sumPart));
    }

    part2(): string | number {
        return _.sum(allSimplePaths(this.graph, 'in0', 'A0').map(p => this.processPath(p)).map(measureRange));
    }
}