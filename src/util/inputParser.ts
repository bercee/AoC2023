
export type InputParser = (input: string) => any;

export class Parsers {

    static readonly fullString = (input: string) => input;
    static readonly asArray = (input: string) => input.split("\n").filter(l => l.trim().length);

    static readonly asIntArray = (input: string) => Parsers.asArray(input).map(s => Number.parseInt(s));

    static readonly asMatrix = (input: string) => Parsers.asArray(input).map(s => s.split(/\s+/));

}