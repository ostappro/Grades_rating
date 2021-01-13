import { inShapeOf, prune } from "../../src/shared/util";

const f = () => {}
const expected = {
    h: 3,
    y: "hey",
    f,
    g: null,
    t: false
}
const input = {
    h: 3,
    y: "hey",
    z: undefined,
    f,
    q: undefined,
    g: null,
    t: false
}

test("prune", () => {
    const pruned = prune(input)
    expect(pruned).toMatchObject(expected)
    expect(prune({})).toMatchObject({})
    expect(prune(expected)).toMatchObject(expected)
    expect(pruned).not.toMatchObject(input)
    expect(pruned).not.toHaveProperty("z")
})

test("inShapeOf", () => {
    expect(inShapeOf(input, {
        h: Number,
        y: String,
        f: Function,
        t: Boolean
    })).toBeTruthy()
    expect(inShapeOf(input, {
        h: Number,
        y: String,
        f: Function,
        q: undefined,
        z: undefined,
        g: null,
        t: Boolean
    })).toBeTruthy()
    expect(inShapeOf(input, {
        h: 3,
        y: "hey",
        z: undefined,
        g: null,
        t: false
    })).toBeTruthy()
    expect(inShapeOf(input, {
        h: String,
        y: String
    })).toBeFalsy()
    expect(inShapeOf(input, {
        h: Number,
        y: String,
        g: 0
    })).toBeFalsy()
    expect(inShapeOf(input, {})).toBeTruthy()
    expect(inShapeOf(input, {
        q: Number
    })).toBeFalsy()
    expect(inShapeOf(input, {
        q: undefined
    })).toBeTruthy()
})