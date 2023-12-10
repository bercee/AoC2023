import { Vector2D } from "../src/util/vector2D";

test('vector2d toString and parse', () => {
    const v = new Vector2D([35,-41]);
    const str = v.toString();
    expect(str).toEqual("[35,-41]")
    const v2 = Vector2D.parse(str);
    expect(v2).toEqual(v);
})