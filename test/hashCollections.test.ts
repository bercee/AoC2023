import { HashMap } from "../src/util/hashMap";
import { HashSet } from "../src/util/hashSet";

interface TestObject {
    s: string;
    n: number;
    s2?: string;
}

function createTestObject(s: string, n: number, s2?: string): TestObject {
    return {s, n, s2};
}

test('Hash Map test cases with strings', () => {
    const map = new HashMap<string, string>();
    map.set("key1", "valami");
    expect(map.get("key1")).toBeTruthy();
    expect(map.get("key2")).toBeFalsy();
    expect(map.getKeys()[0]).toEqual("key1");

    map.delete("key1");
    expect(map.get("key1")).toBeFalsy();



});

test('Hash Map test cases with objects', () => {
    const map = new HashMap<TestObject, string>();
    map.set(createTestObject('a', 1), "valami");

    expect(map.get(createTestObject('a', 1))).toBeTruthy();
    expect(map.get(createTestObject('a', 1, 'b'))).toBeFalsy();

    map.set(createTestObject('a', 1), "valami más");

    expect(map.getKeys()).toHaveLength(1);

    expect(JSON.stringify(map.getKeys()[0])).toEqual(JSON.stringify(createTestObject('a', 1)))

});

test('Hash Set with objects', () => {
    const set = new HashSet<TestObject>();
    set.add(createTestObject("a",1));
    expect(set.toArray()).toHaveLength(1);
    expect(set.has(createTestObject("a",1))).toBeTruthy();
    expect(set.has(createTestObject("a", 1, "b"))).toBeFalsy();

    set.delete(createTestObject("a", 1));

    expect(set.toArray()).toHaveLength(0);
})