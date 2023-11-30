import { Direction, Vector2D } from "../src/util/vector2D";
import findDirection = Direction.findDirection;
import RIGHT = Direction.RIGHT;
import DOWN_LEFT = Direction.DOWN_LEFT;
import LEFT = Direction.LEFT;
import UP = Direction.UP;
import DOWN = Direction.DOWN;
import UP_LEFT = Direction.UP_LEFT;
import DOWN_RIGHT = Direction.DOWN_RIGHT;
import UP_RIGHT = Direction.UP_RIGHT;

const input =
    "0,9 -> 5,9\n" +
    "8,0 -> 0,8\n" +
    "9,4 -> 3,4\n" +
    "2,2 -> 2,1\n" +
    "7,0 -> 7,4\n" +
    "6,4 -> 2,0\n" +
    "0,9 -> 2,9\n" +
    "3,4 -> 1,4\n" +
    "0,0 -> 8,8\n" +
    "5,5 -> 8,2";

interface Dat {
    to: Vector2D,
    from: Vector2D,
    dir: Vector2D
}

const testSet: Dat[] = [
    {from: Vector2D.of(0,9), to: Vector2D.of(5,9), dir: RIGHT},
    {from: Vector2D.of(8,0), to: Vector2D.of(0,8), dir: DOWN_LEFT},
    {from: Vector2D.of(9,4), to: Vector2D.of(3,4), dir: LEFT},
    {from: Vector2D.of(2,2), to: Vector2D.of(2,1), dir: UP},
    {from: Vector2D.of(7,0), to: Vector2D.of(7,4), dir: DOWN},
    {from: Vector2D.of(6,4), to: Vector2D.of(2,0), dir: UP_LEFT},
    {from: Vector2D.of(0,9), to: Vector2D.of(2,9), dir: RIGHT},
    {from: Vector2D.of(3,4), to: Vector2D.of(1,4), dir: LEFT},
    {from: Vector2D.of(0,0), to: Vector2D.of(8,8), dir: DOWN_RIGHT},
    {from: Vector2D.of(5,5), to: Vector2D.of(8,2), dir: UP_RIGHT }
];


test('find directions', () => {
    testSet.forEach(d => {
        expect(findDirection(d.from, d.to)?.equals(d.dir)).toBeTruthy();
    })
})