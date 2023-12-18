import { Vector } from "@flatten-js/core";

export type CellDirection = Vector;

export const UP = new Vector(-1, 0);
export const DOWN = new Vector(1, 0);
export const LEFT = new Vector(0, -1);
export const RIGHT = new Vector(0, 1);