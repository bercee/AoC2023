import { Solver } from "../solver";
import { DirectedGraph } from "graphology";
import { Parsers } from "../../util/inputParser";


interface Pulse {
    p: boolean;
    from: string;
}

interface Module {
    type: "B" | "F" | "C";
    in(signal: boolean, from?: string): void;
    out(): boolean;


}

class Broadcaster implements Module {
    readonly type = "B";
    private toReturn: boolean;
    in(signal: boolean) {
        this.toReturn = signal;
    }
    out(): boolean {
        return this.toReturn;
    }
}

class FlipFlop implements Module {
    private state = false;
    private toReturn: boolean;
    readonly type = "F";

    in(signal: boolean) {
        if (signal) {
            this.toReturn = undefined;
        } else {
            this.state = !this.state;
            this.toReturn = !this.state;
        }
    }

    out(): boolean {
        return this.toReturn;
    }
}

class Conjunction implements Module {
    private map = new Map<string, boolean>();
    readonly type = "C";

    addInput(from: string) {
        this.map.set(from, false);
    }

    in(signal: boolean, from: string) {
        this.map.set(from, signal);
    }

    out() {
        return [...this.map.values()].some(v => !v);
    }
}



export default class Day20_wrong extends Solver {

    modules = new Map<string, Module>();
    graph = new DirectedGraph();

    private parse() {
        const lines = Parsers.asArray(this.origInput);
        for (let line of lines) {
            const dat = line.split(" -> ");
            let name = dat[0];
            if (name.startsWith("%")) {
                name = name.substring(1);
                this.graph.addNode(name);
                this.modules.set(name, new FlipFlop())
            } else if (name.startsWith("&")) {
                name = name.substring(1);
                this.modules.set(name, new Conjunction());
                this.graph.addNode(name);
            } else {
                this.modules.set(name, new Broadcaster());
                this.graph.addNode(name);
            }
        }



        for (let line of lines) {
            const dat = line.split(" -> ");
            const targets = dat[1].split(", ");
            let source = dat[0];
            source = source.search(/[%|&]/) !== -1 ? source.substring(1) : source;
            for (let target of targets) {
                if (target === "output") {
                    this.modules.set(target, new Broadcaster());
                    this.graph.addNode(target);
                }
                this.graph.addEdge(source, target);
                const module = this.modules.get(target);
                if (module.type === "C") {
                    (module as Conjunction).addInput(source);
                }
            }
        }
    }

    walk(): [number, number] {
        let low = 0;
        let high = 0;
        low++;
        let currentNodes = ["broadcaster"];
        this.getModule("broadcaster").in(false);

        while (currentNodes.length !== 0) {
            let targetNodes = [];
            let targetPulses = [];
            for (let i = 0; i < currentNodes.length; i++) {
                const currentNode = currentNodes[i];

                const currentTargets = this.getTargets(currentNode);
                const currentOutput = this.getModule(currentNode).out();

                // const out = this.modules.get(currentNode).in(currentPulse.p, currentPulse.from);
                const targets = this.getTargets(currentNode);

            }
        }


        return [low, high];
    }

    private getModule(node: string): Module {
        return this.modules.get(node);
    }

    private getTargets(node: string): string[] {
        return this.graph.outEdges(node).map(e => this.graph.opposite(node, e));
    }


    part1(): string | number {
        this.parse()
        console.log(`nodes: ${this.graph.nodes().length}`)
        console.log(`edges: ${this.graph.edges().length}`)
        return undefined;
    }

    part2(): string | number {
        return undefined;
    }

}