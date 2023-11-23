export function asArray(input: string): string[] {
    return input.split("\n");
}

export function asIntArray(input: string): number[] {
    return asArray(input).map(s => Number.parseInt(s));
}