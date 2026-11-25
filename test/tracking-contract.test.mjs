import assert from "node:assert/strict";
import test from "node:test";

import {
  BEACON_EVENTS,
  BEACON_PRODUCTS,
  OFFER_CTA_EVENTS,
  OFFER_ENTRY_ROUTES,
  ROUTE_IDS,
  TRACKING_SESSION_COOKIE,
  TRACKING_SESSION_MAX_AGE_S,
} from "@dreamspain/tiehoy-route-contract";

test("every offer entry is a known route selling a known product", () => {
  for (const [routeId, product] of Object.entries(OFFER_ENTRY_ROUTES)) {
    assert.ok(ROUTE_IDS.includes(routeId), routeId);
    assert.ok(BEACON_PRODUCTS.includes(product), product);
  }
  assert.deepEqual(new Set(Object.values(OFFER_ENTRY_ROUTES)), new Set(BEACON_PRODUCTS));
});

test("offer-entry events are beacon events", () => {
  for (const event of Object.values(OFFER_CTA_EVENTS)) assert.ok(event in BEACON_EVENTS, event);
});

test("visit cookie is a plain token with a 30-minute window", () => {
  assert.match(TRACKING_SESSION_COOKIE, /^[a-z_]+$/);
  assert.equal(TRACKING_SESSION_MAX_AGE_S, 1800);
});

test("tracking registries are frozen", () => {
  assert.ok(Object.isFrozen(BEACON_EVENTS));
  assert.ok(Object.isFrozen(OFFER_ENTRY_ROUTES));
});
