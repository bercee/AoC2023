
export type InputParser = (input: string) => any;

export class Parsers {
    static readonly asArray = (input: string) => input.split("\n");

    static readonly asIntArray = (input: string) => input.split("\n").map(s => Number.parseInt(s));

    static readonly asMatrix = (input: string) => Parsers.asArray(input).map(s => s.split(/s+/));

}