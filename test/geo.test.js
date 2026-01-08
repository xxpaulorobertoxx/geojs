import assert from "node:assert/strict";
import test from "node:test";
import { addItem, removeItemById, findWithinRadius, distanceMeters } from "../index.js";

test("addItem adds a normalized item", () => {
  const items = [];
  const result = addItem(items, {
    id: "a1",
    latitude: 10,
    longitude: 20,
    data: { label: "A" }
  });

  assert.equal(items.length, 0);
  assert.equal(result.length, 1);
  assert.deepEqual(result[0], {
    id: "a1",
    latitude: 10,
    longitude: 20,
    data: { label: "A" }
  });
});

test("removeItemById removes matching ids", () => {
  const items = [
    { id: "a1", latitude: 0, longitude: 0, data: {} },
    { id: "b2", latitude: 1, longitude: 1, data: {} }
  ];

  const result = removeItemById(items, "a1");
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "b2");
});

test("findWithinRadius filters by distance", () => {
  const items = [
    { id: "a1", latitude: 0, longitude: 0, data: {} },
    { id: "b2", latitude: 0.01, longitude: 0, data: {} }
  ];

  const nearby = findWithinRadius(items, 0, 0, 1200);
  assert.deepEqual(
    nearby.map((item) => item.id),
    ["a1", "b2"]
  );

  const tight = findWithinRadius(items, 0, 0, 500);
  assert.deepEqual(
    tight.map((item) => item.id),
    ["a1"]
  );
});

test("distanceMeters returns approx distance", () => {
  const distance = distanceMeters(0, 0, 0, 1);
  assert.ok(distance > 110000 && distance < 112000);
});

test("invalid latitude throws", () => {
  assert.throws(
    () =>
      addItem([], {
        id: "bad",
        latitude: 200,
        longitude: 0,
        data: {}
      }),
    /latitude/
  );
});
