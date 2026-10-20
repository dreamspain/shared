import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import {
  LEGACY_ROUTES,
  LOCALES,
  ROUTES,
  ROUTE_IDS,
  alternatesFor,
  canonicalFor,
  matchRoute,
  pathFor,
  registryVersion,
  routerPattern,
  toJSON,
  validateManifest,
} from "@dreamspain/tiehoy-route-contract";

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function throws(fn, message) {
  assert.throws(fn, /route-contract/, message);
}

// The mandated source registry currently declares 30 IDs (not 32); this is a
// fidelity guard so unknown routes are never invented by the producer package.
test("exports the complete source manifest and explicit legacy dispositions", () => {
  assert.equal(ROUTE_IDS.length, 30);
  assert.equal(Object.keys(ROUTES).length, 30);
  assert.deepEqual(LOCALES, ["en", "es", "fr", "ru", "zh", "ar"]);
  assert.deepEqual(
    LEGACY_ROUTES,
    [
      { pattern: "/tie/*", action: "notFound", status: 404 },
      { pattern: "/oficina/*", action: "notFound", status: 404 },
      { pattern: "/oficinas/*", action: "notFound", status: 404 },
      { pattern: "/office/*", action: "notFound", status: 404 },
    ],
  );
  assert.deepEqual(validateManifest(), []);
});

test("constructs canonical localized paths without collapsing entity segments", () => {
  assert.equal(pathFor("home", "en"), "/");
  assert.equal(pathFor("home", "es"), "/es/");
  assert.equal(pathFor("pausedOffices", "es"), "/es/oficinas/pausadas/");
  assert.equal(pathFor("mentorTiger", "zh"), "/mentors/tiger/");
  assert.equal(pathFor("mentorTiger", "en"), "/en/mentors/tiger/");
  assert.equal(
    pathFor("citaPreviaOffice", "en", { province: "madrid", office: "alcala-de-henares" }),
    "/cita-previa/madrid/alcala-de-henares/",
  );
  assert.equal(
    canonicalFor("guideDetail", "fr", { slug: "tie-spain-guide" }),
    "https://tiehoy.com/fr/guides/tie-spain-guide/",
  );
  throws(() => pathFor("citaPreviaOffice", "en", { province: "madrid" }), "missing segment");
  throws(() => pathFor("citaPreviaOffice", "en", { province: "madrid", office: "" }), "empty segment");
});

test("rejects inactive locales, extra params, and unsafe dynamic raw slugs", () => {
  throws(() => pathFor("privacy", "fr"), "inactive locale");
  throws(() => routerPattern("privacy", "zh"), "inactive locale router pattern");
  throws(() => pathFor("home", "en", { unexpected: "value" }), "static extra param");
  throws(() => pathFor("guideDetail", "en", { slug: "valid-slug", extra: "value" }), "entity extra param");

  for (const slug of ["UPPER", "two--hyphens", "leading-", "-trailing", "dot.segment", "..", "has/slash", "encoded%2fslash", "has?query", "has#fragment", "line\nbreak"]) {
    throws(() => pathFor("guideDetail", "en", { slug }), `unsafe slug ${JSON.stringify(slug)}`);
  }
});

test("returns alternates whose x-default belongs to each request override", () => {
  const override = ["fr", "es"];
  const alternates = alternatesFor("guideDetail", { slug: "tie-spain-guide" }, override);
  assert.deepEqual(Object.keys(alternates), ["fr", "es", "x-default"]);
  assert.equal(alternates["x-default"], alternates.fr);
  throws(() => alternatesFor("privacy", undefined, ["fr"]), "inactive override locale");
  throws(() => alternatesFor("home", undefined, []), "empty override");
});

test("matches only active, raw-slug route paths", () => {
  assert.deepEqual(matchRoute("/cita-previa/madrid/alcala-de-henares"), {
    route: ROUTES.citaPreviaOffice,
    locale: "en",
    params: { province: "madrid", office: "alcala-de-henares" },
  });
  assert.deepEqual(matchRoute("/es/oficinas/pausadas/"), {
    route: ROUTES.pausedOffices,
    locale: "es",
    params: {},
  });
  assert.equal(matchRoute("/fr/privacy/"), null);
  for (const path of ["/guides/UPPER/", "/guides/%2f/", "/guides/a%2Fb/", "/guides/../", "/guides/has?query/"]) {
    assert.equal(matchRoute(path), null, `must reject ${path}`);
  }
});

test("publishes a deterministic content-addressed registry version", () => {
  assert.match(registryVersion, /^sha256:[a-f0-9]{64}$/);
  const manifest = toJSON();
  assert.equal(manifest.version, registryVersion);
  const { version, ...content } = manifest;
  const expected = `sha256:${createHash("sha256").update(stableStringify(content)).digest("hex")}`;
  assert.equal(registryVersion, expected);
  assert.notEqual(registryVersion, new Date().toISOString().slice(0, 10));
});
