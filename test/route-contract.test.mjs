import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
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
  resolveLegacyPath,
  routerPattern,
  toJSON,
  validateManifest,
} from "@dreamspain/tiehoy-route-contract";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

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

// The mandated source registry currently declares 31 IDs; this is a
// fidelity guard so unknown routes are never invented by the producer package.
test("exports the complete source manifest and explicit legacy dispositions", () => {
  assert.equal(ROUTE_IDS.length, 31);
  assert.equal(Object.keys(ROUTES).length, 31);
  assert.deepEqual(LOCALES, ["en", "es", "fr", "ru", "zh", "ar"]);
  assert.deepEqual(
    LEGACY_ROUTES,
    [
      { match: "prefix", path: "/tie/", action: "notFound", status: 404 },
      { match: "prefix", path: "/oficina/", action: "notFound", status: 404 },
      { match: "prefix", path: "/oficinas/", action: "notFound", status: 404 },
      { match: "prefix", path: "/office/", action: "notFound", status: 404 },
      { match: "exactOrTrailingSlash", path: "/residence-renewal", action: "gone", status: 410 },
      { match: "exactOrTrailingSlash", path: "/es/renovacion-residencia", action: "gone", status: 410 },
      { match: "exactOrTrailingSlash", path: "/renewal", action: "gone", status: 410 },
      { match: "exactOrTrailingSlash", path: "/es/renovacion", action: "gone", status: 410 },
      { match: "exact", path: "/tiger/", action: "redirect", status: 301, to: "mentorTiger", locale: "zh" },
      { match: "exact", path: "/en/tiger/", action: "redirect", status: 301, to: "mentorTiger", locale: "en" },
      { match: "exact", path: "/es/tiger/", action: "redirect", status: 301, to: "mentorTiger", locale: "es" },
      { match: "exact", path: "/fr/tiger/", action: "redirect", status: 301, to: "mentorTiger", locale: "fr" },
      { match: "exact", path: "/ru/tiger/", action: "redirect", status: 301, to: "mentorTiger", locale: "ru" },
      { match: "exact", path: "/zh/tiger/", action: "redirect", status: 301, to: "mentorTiger", locale: "zh" },
      { match: "exact", path: "/ar/tiger/", action: "redirect", status: 301, to: "mentorTiger", locale: "ar" },
      { match: "exact", path: "/zh/mentors/tiger/", action: "redirect", status: 301, to: "mentorTiger", locale: "zh" },
      { match: "exact", path: "/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "en", params: { slug: "tasa-790-012" } },
      { match: "exact", path: "/es/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "es", params: { slug: "tasa-790-012" } },
      { match: "exact", path: "/fr/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "fr", params: { slug: "tasa-790-012" } },
      { match: "exact", path: "/ru/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "ru", params: { slug: "tasa-790-012" } },
      { match: "exact", path: "/zh/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "zh", params: { slug: "tasa-790-012" } },
      { match: "exact", path: "/ar/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "ar", params: { slug: "tasa-790-012" } },
      { match: "exact", path: "/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "en", params: { slug: "tasa-790-012-invitation" } },
      { match: "exact", path: "/es/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "es", params: { slug: "tasa-790-012-invitation" } },
      { match: "exact", path: "/fr/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "fr", params: { slug: "tasa-790-012-invitation" } },
      { match: "exact", path: "/ru/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "ru", params: { slug: "tasa-790-012-invitation" } },
      { match: "exact", path: "/zh/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "zh", params: { slug: "tasa-790-012-invitation" } },
      { match: "exact", path: "/ar/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "ar", params: { slug: "tasa-790-012-invitation" } },
      { match: "exact", path: "/cita-previa/", action: "redirect", status: 301, to: "citaPrevia", locale: "en" },
      { match: "exact", path: "/cita-previa/madrid/", action: "redirect", status: 301, to: "citaPreviaProvince", locale: "en", params: { province: "madrid" } },
      { match: "exact", path: "/cita-previa/alicante/elche/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "en", params: { province: "alicante", office: "elche" } },
      { match: "exact", path: "/cita-previa/alicante/alicante/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "en", params: { province: "alicante", office: "alicante" } },
      { match: "exact", path: "/cita-previa/murcia/lorca/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "en", params: { province: "murcia", office: "lorca" } },
      { match: "exact", path: "/cita-previa/girona/lloret-de-mar/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "en", params: { province: "girona", office: "lloret-de-mar" } },
      { match: "exact", path: "/es/cita-previa/murcia/yecla/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "es", params: { province: "murcia", office: "yecla" } },
      { match: "exact", path: "/es/cita-previa/alicante/orihuela/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "es", params: { province: "alicante", office: "orihuela" } },
      { match: "exact", path: "/es/cita-previa/murcia/lorca/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "es", params: { province: "murcia", office: "lorca" } },
      { match: "exact", path: "/es/cita-previa/ciudad-real/tomelloso/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "es", params: { province: "ciudad-real", office: "tomelloso" } },
      { match: "exact", path: "/es/cita-previa/murcia/molina-de-segura/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "es", params: { province: "murcia", office: "molina-de-segura" } },
      { match: "exact", path: "/es/cita-previa/barcelona/viladecans/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "es", params: { province: "barcelona", office: "viladecans" } },
      { match: "exact", path: "/es/cita-previa/alicante/elda/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "es", params: { province: "alicante", office: "elda" } },
      { match: "exact", path: "/es/cita-previa/barcelona/", action: "redirect", status: 301, to: "citaPreviaProvince", locale: "es", params: { province: "barcelona" } },
      { match: "exact", path: "/es/cita-previa/tarragona/", action: "redirect", status: 301, to: "citaPreviaProvince", locale: "es", params: { province: "tarragona" } },
      { match: "exact", path: "/es/cita-previa/salamanca/salamanca/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "es", params: { province: "salamanca", office: "salamanca" } },
      { match: "exact", path: "/es/cita-previa/girona/lloret-de-mar/", action: "redirect", status: 301, to: "citaPreviaOffice", locale: "es", params: { province: "girona", office: "lloret-de-mar" } },
      { match: "exact", path: "/es/cita-previa/madrid/", action: "redirect", status: 301, to: "citaPreviaProvince", locale: "es", params: { province: "madrid" } },
      { match: "exact", path: "/fr/cita-previa/all/", action: "redirect", status: 301, to: "citaPreviaAll", locale: "fr" },
      { match: "exact", path: "/fr/cita-previa/zaragoza/", action: "redirect", status: 301, to: "citaPreviaProvince", locale: "fr", params: { province: "zaragoza" } },
      { match: "exact", path: "/ru/cita-previa/malaga/", action: "redirect", status: 301, to: "citaPreviaProvince", locale: "ru", params: { province: "malaga" } },
      { match: "prefix", path: "/cita-previa/", action: "notFound", status: 404 },
      { match: "prefix", path: "/es/cita-previa/", action: "notFound", status: 404 },
      { match: "prefix", path: "/fr/cita-previa/", action: "notFound", status: 404 },
      { match: "prefix", path: "/ru/cita-previa/", action: "notFound", status: 404 },
      { match: "prefix", path: "/zh/cita-previa/", action: "notFound", status: 404 },
      { match: "prefix", path: "/ar/cita-previa/", action: "notFound", status: 404 },
    ],
  );
  for (const id of ["privacy", "cookies", "terms", "legalNotice"]) {
    assert.deepEqual(ROUTES[id].activeLocales, LOCALES, `${id} must remain public in all live locales`);
  }
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
    "/cita/madrid/alcala-de-henares/",
  );
  assert.equal(
    canonicalFor("guideDetail", "fr", { slug: "tie-spain-guide" }),
    "https://tiehoy.com/fr/guides/tie-spain-guide/",
  );
  throws(() => pathFor("citaPreviaOffice", "en", { province: "madrid" }), "missing segment");
  throws(() => pathFor("citaPreviaOffice", "en", { province: "madrid", office: "" }), "empty segment");
});

test("rejects inactive locales, extra params, and unsafe dynamic raw slugs", () => {
  throws(() => pathFor("privacy", "ja"), "invalid locale");
  throws(() => routerPattern("privacy", "ja"), "invalid locale router pattern");
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
  throws(() => alternatesFor("privacy", undefined, ["ja"]), "invalid override locale");
  throws(() => alternatesFor("home", undefined, []), "empty override");
});

test("matches only active, raw-slug route paths", () => {
  assert.deepEqual(matchRoute("/cita/madrid/alcala-de-henares"), {
    route: ROUTES.citaPreviaOffice,
    locale: "en",
    params: { province: "madrid", office: "alcala-de-henares" },
  });
  assert.deepEqual(matchRoute("/es/oficinas/pausadas/"), {
    route: ROUTES.pausedOffices,
    locale: "es",
    params: {},
  });
  assert.deepEqual(matchRoute("/fr/privacy/"), {
    route: ROUTES.privacy,
    locale: "fr",
    params: {},
  });
  for (const path of ["/guides/UPPER/", "/guides/%2f/", "/guides/a%2Fb/", "/guides/../", "/guides/has?query/"]) {
    assert.equal(matchRoute(path), null, `must reject ${path}`);
  }
});

test("resolves legacy paths with explicit semantics without general normalization", () => {
  assert.deepEqual(resolveLegacyPath("/tie/historical"), { action: "notFound", status: 404 });
  assert.deepEqual(resolveLegacyPath("/office/"), { action: "notFound", status: 404 });
  assert.equal(resolveLegacyPath("/tie"), null, "prefix must include its documented trailing slash");
  assert.equal(resolveLegacyPath("/office?legacy=1"), null, "pathname resolver must not parse query strings");

  for (const pathname of ["/residence-renewal", "/es/renovacion-residencia", "/renewal", "/es/renovacion"]) {
    for (const variant of [pathname, `${pathname}/`]) {
      const requestPathname = new URL(`https://tiehoy.com${variant}?legacy=1`).pathname;
      assert.equal(requestPathname, variant, "Worker adapters must pass URL.pathname");
      assert.deepEqual(resolveLegacyPath(requestPathname), { action: "gone", status: 410 }, requestPathname);
    }
    for (const nonmatch of [`${pathname}//`, `${pathname}/archive`, `${pathname}-archive`]) {
      assert.equal(resolveLegacyPath(nonmatch), null, `${nonmatch} must not match the retirement`);
    }
  }

  assert.deepEqual(resolveLegacyPath("/tiger/"), { action: "redirect", status: 301, targetPath: "/mentors/tiger/" });
  assert.deepEqual(resolveLegacyPath("/es/tiger/"), { action: "redirect", status: 301, targetPath: "/es/mentors/tiger/" });
  assert.deepEqual(resolveLegacyPath("/zh/mentors/tiger/"), { action: "redirect", status: 301, targetPath: "/mentors/tiger/" });
  assert.equal(resolveLegacyPath("/es/tiger"), null, "exact alias must retain its slash requirement");
  assert.equal(resolveLegacyPath("/tiger/?utm=legacy"), null, "query preservation belongs to the Worker adapter");

  assert.deepEqual(resolveLegacyPath("/es/guides/tasa_790_012/"), {
    action: "redirect",
    status: 301,
    targetPath: "/es/guides/tasa-790-012/",
  });
  assert.deepEqual(resolveLegacyPath("/guides/tasa_790_012_invitation/"), {
    action: "redirect",
    status: 301,
    targetPath: "/guides/tasa-790-012-invitation/",
  });
  assert.equal(resolveLegacyPath("/es/guides/tasa_790_012"), null, "exact legacy paths require trailing slash");

  const underscoreGuideLegacyPaths = [
    ["/guides/tasa_790_012/", "/guides/tasa-790-012/"],
    ["/es/guides/tasa_790_012/", "/es/guides/tasa-790-012/"],
    ["/fr/guides/tasa_790_012/", "/fr/guides/tasa-790-012/"],
    ["/ru/guides/tasa_790_012/", "/ru/guides/tasa-790-012/"],
    ["/zh/guides/tasa_790_012/", "/zh/guides/tasa-790-012/"],
    ["/ar/guides/tasa_790_012/", "/ar/guides/tasa-790-012/"],
    ["/guides/tasa_790_012_invitation/", "/guides/tasa-790-012-invitation/"],
    ["/es/guides/tasa_790_012_invitation/", "/es/guides/tasa-790-012-invitation/"],
    ["/fr/guides/tasa_790_012_invitation/", "/fr/guides/tasa-790-012-invitation/"],
    ["/ru/guides/tasa_790_012_invitation/", "/ru/guides/tasa-790-012-invitation/"],
    ["/zh/guides/tasa_790_012_invitation/", "/zh/guides/tasa-790-012-invitation/"],
    ["/ar/guides/tasa_790_012_invitation/", "/ar/guides/tasa-790-012-invitation/"],
  ];
  for (const [legacyPath, targetPath] of underscoreGuideLegacyPaths) {
    assert.deepEqual(
      resolveLegacyPath(legacyPath),
      { action: "redirect", status: 301, targetPath },
      legacyPath,
    );
  }
});

test("freezes exported registry state so mutations cannot change route identity", () => {
  const originalPath = pathFor("privacy", "fr");
  const originalVersion = registryVersion;
  const originalJSON = toJSON();

  assert.equal(Object.isFrozen(LOCALES), true);
  assert.equal(Object.isFrozen(ROUTE_IDS), true);
  assert.equal(Object.isFrozen(ROUTES), true);
  assert.equal(Object.isFrozen(ROUTES.privacy), true);
  assert.equal(Object.isFrozen(ROUTES.privacy.activeLocales), true);
  assert.equal(Object.isFrozen(LEGACY_ROUTES), true);
  assert.equal(Object.isFrozen(LEGACY_ROUTES[0]), true);

  assert.throws(() => { ROUTES.privacy.activeLocales.push("en"); }, TypeError);
  assert.throws(() => { ROUTES.privacy.slug = "compromised"; }, TypeError);
  assert.throws(() => { LEGACY_ROUTES[0].path = "/compromised/"; }, TypeError);
  assert.throws(() => { LOCALES.push("en"); }, TypeError);

  const exportedJSON = toJSON();
  assert.equal(Object.isFrozen(exportedJSON), true);
  assert.throws(() => { exportedJSON.routes.privacy.slug = "compromised"; }, TypeError);
  assert.equal(pathFor("privacy", "fr"), originalPath);
  assert.equal(registryVersion, originalVersion);
  assert.deepEqual(toJSON(), originalJSON);
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

test("pins the compiler and packs exactly the public package surface", () => {
  const packageJSON = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.match(packageJSON.devDependencies?.typescript ?? "", /^\d+\.\d+\.\d+$/);
  assert.equal(typeof packageJSON.scripts?.["check:dist"], "string");

  const pack = JSON.parse(execFileSync("npm", ["pack", "--json", "--dry-run"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  }));
  assert.equal(pack.length, 1);
  assert.deepEqual(
    pack[0].files.map((entry) => entry.path).sort(),
    ["README.md", "dist/index.d.ts", "dist/index.js", "package.json"],
  );
});

test("cita-previa → cita: GSC URLs 301 to the renamed route, the rest of the old tree is 404", () => {
  assert.equal(pathFor("citaPrevia", "es"), "/es/cita/");
  assert.equal(pathFor("citaPreviaOffice", "en", { province: "murcia", office: "yecla" }), "/cita/murcia/yecla/");
  assert.deepEqual(resolveLegacyPath("/es/cita-previa/murcia/yecla/"), { action: "redirect", status: 301, targetPath: "/es/cita/murcia/yecla/" });
  assert.deepEqual(resolveLegacyPath("/cita-previa/"), { action: "redirect", status: 301, targetPath: "/cita/" });
  assert.deepEqual(resolveLegacyPath("/fr/cita-previa/all/"), { action: "redirect", status: 301, targetPath: "/fr/cita/all/" });
  assert.deepEqual(resolveLegacyPath("/es/cita-previa/"), { action: "notFound", status: 404 });
  assert.deepEqual(resolveLegacyPath("/zh/cita-previa/madrid/getafe/"), { action: "notFound", status: 404 });
  assert.equal(matchRoute("/cita-previa/murcia/"), null, "old prefix is no longer a route");
});

test("citaAlerts is a noindex static page under /cita/avisos/", () => {
  assert.equal(pathFor("citaAlerts", "en"), "/cita/avisos/");
  assert.equal(pathFor("citaAlerts", "es"), "/es/cita/avisos/");
  assert.equal(ROUTES.citaAlerts.indexability, "noindex");
  assert.equal(ROUTES.citaAlerts.sitemap, "never");
});
