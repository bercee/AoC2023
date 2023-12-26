//I know, this is very ugly code, but i have officially exhausted. Will not optimize this.
//Disclaimer: I cheated for this part, looked into reddit to have a hint what's going on.
import { Solver } from "../solver";
import { Parsers } from "../../util/inputParser";
import { lcm } from "mathjs";

interface Counter {
    low: number;
    high: number;
}

interface Pulse {
    from: string,
    to: string;
    signal: Signal;
}

function of(from: string, to: string, signal: Signal): Pulse {
    return {from, to, signal};
}

enum Signal {
    L, H
}

enum State {
    ON, OFF
}

interface Module {
    readonly type: "B" | "F" | "C" | "FF";
    readonly targets: string[]
    readonly sources: string[];
    process(s: Signal, from?: string): Signal | undefined;
    addTarget(module: string): void;
    addSource(module: string): void;
    reset(): void;

}


abstract class AbstractModule implements Module {
    readonly sources: string[] = [];
    readonly targets: string[] = [];
    readonly type: "B" | "F" | "C" | "FF";

    addSource(module: string): void {
        this.sources.push(module);
    }

    addTarget(module: string): void {
        this.targets.push(module);
    }

    abstract process(s: Signal, from?: string): Signal | undefined;
    abstract reset(): void;
}

class Broadcaster extends AbstractModule{
    readonly type: "B";


    process(s: Signal): Signal {
        return s;
    }

    reset(): void {
    }
}


class FlipFlop extends AbstractModule {
    readonly type = "F";
    state: State = State.OFF;
    process(s: Signal): Signal | undefined{
        if (s === Signal.H) {
            return undefined;
        } else {
            if (this.state === State.ON) {
                this.state = State.OFF;
                return Signal.L;
            } else {
                this.state = State.ON;
                return Signal.H;
            }
        }
    }

    reset(): void {
        this.state = State.OFF;
    }
}

class Final extends AbstractModule {
    list: Signal[] = [];
    readonly type = "FF";
    process(s: Signal, from?: string): Signal | undefined {
        this.list.push(s);
        return undefined;
    }

        reset() {
        this.list = [];
    }

}


class Conjunction extends AbstractModule{
    map = new Map<string, Signal>();
    readonly type = "C";
    counter: number;


    addSource(module: string) {
        super.addSource(module);
        this.map.set(module, Signal.L);
    }

    state(): Signal {
        if ([...this.map.values()].every(s => s === Signal.H)) {
            return Signal.L;
        } else {
            return Signal.H;
        }
    }

    process(s: Signal, from: string): Signal {
        this.counter++;
        this.map.set(from, s);
        return this.state();
    }

    resetCounter() {
        this.counter = 0;
    }

    reset() {
        this.counter = 0;
        for (let key of this.map.keys()) {
            this.map.set(key, Signal.L);
        }
    }
}

export default class Day20 extends Solver {


    modules = new Map<string, Module>();

    finalModule: Final;
    finalParent : Conjunction
    endNames: string[];
    ends: Conjunction[];

    endsFirstHigh: number[] = Array(4).fill(0);
    res = 0;


    constructor(origInput: string) {
        super(origInput);
        this.parse();
    }

    private parse() {
        const lines = Parsers.asArray(this.origInput);
        for (let line of lines) {
            const dat = line.split(" -> ");
            let name = dat[0];
            if (name.startsWith("%")) {
                name = name.substring(1);
                this.modules.set(name, new FlipFlop())
            } else if (name.startsWith("&")) {
                name = name.substring(1);
                this.modules.set(name, new Conjunction());
            } else {
                this.modules.set(name, new Broadcaster());
            }
        }



        for (let line of lines) {
            const dat = line.split(" -> ");
            const targets = dat[1].split(", ");
            let source = dat[0];
            source = source.search(/[%|&]/) !== -1 ? source.substring(1) : source;
            for (let target of targets) {
                if (this.modules.get(target) === undefined) {
                    if (target === "rx") {
                        this.modules.set(target, new Final())
                    } else {
                        this.modules.set(target, new Broadcaster())
                    }
                }
                this.modules.get(source).addTarget(target);
                this.modules.get(target).addSource(source);
            }
        }

        // console.log(this.modules.keys())

        this.finalModule = this.modules.get("rx") as Final;
        if (!this.finalModule) {
            return;
        }
        this.finalParent = this.modules.get(this.finalModule.sources[0]) as Conjunction;
        this.endNames = this.finalParent.sources;
        this.ends = this.finalParent.sources.map(e => this.modules.get(e) as Conjunction);
    }

    private pushButton(counter?: Counter) {
        this.res++;
        // console.log('push button')
        const q: Pulse[] = [];
        q.push(of(undefined, "broadcaster", Signal.L));
        counter && counter.low++;
        while (q.length !== 0) {
            const nextSign = q.shift();
            // console.log(`${nextSign.from} -${nextSign.signal} --> ${nextSign.to}`)
            const m = this.modules.get(nextSign.to);
            const res = m.process(nextSign.signal, nextSign.from);
            if (res === undefined) {
                continue;
            }
            for (let target of m.targets) {
                if (res === Signal.L) {
                    counter && counter.low++;
                }else {
                    counter && counter.high++;
                }
                q.push(of(nextSign.to, target, res));
                this.endNames.forEach((e, idx) => {
                    if (nextSign.to === e && res === Signal.H && this.endsFirstHigh[idx] === 0) {
                        this.endsFirstHigh[idx] = this.res;
                    }
                })
            }
        }

    }

    resetAll() {
        for (let key of this.modules.keys()) {
            if (key === "rx") {
                continue;
            }
            const m = this.modules.get(key);
            m.reset();
        }
    }

    part1(): string | number {
        const counter: Counter = {low: 0, high: 0};
        for (let i = 0; i < 1000; i++) {
            this.pushButton(counter);
        }


        return counter.low * counter.high;
    }
    part2(): string | number {

        while (this.endsFirstHigh.some(e => e === 0)) {
            this.pushButton();
        }
        console.log(this.endsFirstHigh)


        return this.endsFirstHigh.reduce((a, b) => lcm(a,b));
    }

}
