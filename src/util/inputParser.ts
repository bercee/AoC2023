
export type InputParser = (input: string) => any;

export class Parsers {

    static readonly asArray = (input: string) => input.split("\n");

    static readonly asIntArray = (input: string) => Parsers.asArray(input).map(s => Number.parseInt(s));

    static readonly asMatrix =
        (input: string, regex = /\s+/, trim = true) =>
        Parsers.asArray(input).map(s => {
            const ss = trim ? s.trim() : s;
            return ss.split(regex ?? "");
        });

    static readonly asIntMatrix = (input: string, regex = /\s+/, trim = true) => {
        return Parsers.asMatrix(input, regex, trim).map(ss => ss.map(s => Number.parseInt(s)));
    }

}