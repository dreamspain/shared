/** Dependency-free public route identity contract for TIEHoy. */
/** Freeze nested registry data so consumers cannot alter routing behavior at runtime. */
function deepFreeze(value) {
    if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
        for (const key of Reflect.ownKeys(value)) {
            deepFreeze(value[key]);
        }
        Object.freeze(value);
    }
    return value;
}
export const LOCALES = deepFreeze(["en", "es", "fr", "ru", "zh", "ar"]);
export const ROUTE_IDS = deepFreeze([
    "home", "lote", "loteCheck", "loteNotify", "loteNotifyConfirmed",
    "citaPrevia", "citaPreviaAll", "citaPreviaBook", "citaAlerts", "citaPreviaProvince", "citaPreviaOffice",
    "pausedOffices", "topicsIndex", "hubTieCardRenewal", "hubResidenceRenewal",
    "hubFamilyReunification", "hubInvitationLetter", "guidesIndex", "guideDetail",
    "invitesIndex", "inviteDetail", "mentorsIndex", "lifeIndex", "lifeHave", "lifeNeed",
    "mentorTiger", "privacy", "cookies", "terms", "legalNotice", "construction",
]);
export const TIEHOY_ORIGIN = "https://tiehoy.com";
export const SCLT_ORIGIN = "https://sclt.es";
const ALL_LOCALES = LOCALES;
export const ROUTES = deepFreeze({
    home: { id: "home", kind: "static", slug: "", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", scltSlug: "tie", deepLink: false },
    lote: { id: "lote", kind: "static", slug: "lote", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: true },
    loteCheck: { id: "loteCheck", kind: "static", slug: "lote/check", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", scltSlug: "tie/consultar", deepLink: true },
    loteNotify: { id: "loteNotify", kind: "static", slug: "lote/notify", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    loteNotifyConfirmed: { id: "loteNotifyConfirmed", kind: "static", slug: "lote/notify/confirmed", activeLocales: ALL_LOCALES, indexability: "noindex", sitemap: "never", deepLink: false },
    citaPrevia: { id: "citaPrevia", kind: "static", slug: "cita", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    citaPreviaAll: { id: "citaPreviaAll", kind: "static", slug: "cita/all", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    citaPreviaBook: { id: "citaPreviaBook", kind: "static", slug: "cita/book", activeLocales: ALL_LOCALES, indexability: "noindex", sitemap: "never", deepLink: false },
    citaAlerts: { id: "citaAlerts", kind: "static", slug: "cita/avisos", activeLocales: ALL_LOCALES, indexability: "noindex", sitemap: "never", deepLink: false },
    citaPreviaProvince: { id: "citaPreviaProvince", kind: "entity", slug: "cita/:province", params: ["province"], activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "entity", scltSlug: "tie/:province", deepLink: false },
    citaPreviaOffice: { id: "citaPreviaOffice", kind: "entity", slug: "cita/:province/:office", params: ["province", "office"], activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "entity", scltSlug: "tie/:province/:office", deepLink: false },
    pausedOffices: { id: "pausedOffices", kind: "static", slug: "offices/paused", esSlug: "oficinas/pausadas", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    topicsIndex: { id: "topicsIndex", kind: "static", slug: "topics", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: true },
    hubTieCardRenewal: { id: "hubTieCardRenewal", kind: "static", slug: "tie-card-renewal", esSlug: "renovacion-tie", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: true },
    hubResidenceRenewal: { id: "hubResidenceRenewal", kind: "static", slug: "topics/residence-renewal", esSlug: "topics/renovacion-residencia", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: true },
    hubFamilyReunification: { id: "hubFamilyReunification", kind: "static", slug: "topics/family-reunification", esSlug: "topics/reagrupacion-familiar", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: true },
    hubInvitationLetter: { id: "hubInvitationLetter", kind: "static", slug: "topics/invitation-letter", esSlug: "topics/carta-de-invitacion", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: true },
    guidesIndex: { id: "guidesIndex", kind: "static", slug: "guides", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: true },
    guideDetail: { id: "guideDetail", kind: "entity", slug: "guides/:slug", params: ["slug"], activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "entity", deepLink: true },
    invitesIndex: { id: "invitesIndex", kind: "static", slug: "invites", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    inviteDetail: { id: "inviteDetail", kind: "entity", slug: "invites/:slug", params: ["slug"], activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "entity", deepLink: false },
    mentorsIndex: { id: "mentorsIndex", kind: "static", slug: "mentors", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    lifeIndex: { id: "lifeIndex", kind: "static", slug: "life", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    lifeHave: { id: "lifeHave", kind: "static", slug: "life/have", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    lifeNeed: { id: "lifeNeed", kind: "static", slug: "life/need", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    mentorTiger: { id: "mentorTiger", kind: "static", slug: "mentors/tiger", defaultLocale: "zh", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    privacy: { id: "privacy", kind: "static", slug: "privacy", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    cookies: { id: "cookies", kind: "static", slug: "cookies", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    terms: { id: "terms", kind: "static", slug: "terms", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    legalNotice: { id: "legalNotice", kind: "static", slug: "legal-notice", activeLocales: ALL_LOCALES, indexability: "indexable", sitemap: "static", deepLink: false },
    construction: { id: "construction", kind: "static", slug: "construction", activeLocales: ALL_LOCALES, indexability: "noindex", sitemap: "never", deepLink: false },
});
/**
 * Current historical path behavior from the Worker. `match` is deliberately
 * explicit: exact entries do not accept a slash variant, retirement entries
 * accept exactly one optional trailing slash, and prefix entries include their
 * required trailing slash. These are pathname-only policies.
 */
export const LEGACY_ROUTES = deepFreeze([
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
    // 2026-10-28 underscore slug rename; GSC 28d impressions>0 (元要求 §三.3 301 rule).
    { match: "exact", path: "/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "en", params: { slug: "tasa-790-012" } },
    { match: "exact", path: "/es/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "es", params: { slug: "tasa-790-012" } },
    { match: "exact", path: "/fr/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "fr", params: { slug: "tasa-790-012" } },
    { match: "exact", path: "/ru/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "ru", params: { slug: "tasa-790-012" } },
    { match: "exact", path: "/zh/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "zh", params: { slug: "tasa-790-012" } },
    { match: "exact", path: "/ar/guides/tasa_790_012/", action: "redirect", status: 301, to: "guideDetail", locale: "ar", params: { slug: "tasa-790-012" } },
    // 2026-10-28 underscore slug rename; GSC 28d impressions>0 (元要求 §三.3 301 rule).
    { match: "exact", path: "/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "en", params: { slug: "tasa-790-012-invitation" } },
    { match: "exact", path: "/es/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "es", params: { slug: "tasa-790-012-invitation" } },
    { match: "exact", path: "/fr/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "fr", params: { slug: "tasa-790-012-invitation" } },
    { match: "exact", path: "/ru/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "ru", params: { slug: "tasa-790-012-invitation" } },
    { match: "exact", path: "/zh/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "zh", params: { slug: "tasa-790-012-invitation" } },
    { match: "exact", path: "/ar/guides/tasa_790_012_invitation/", action: "redirect", status: 301, to: "guideDetail", locale: "ar", params: { slug: "tasa-790-012-invitation" } },
    // cita-previa → cita (2026-10-28): GSC 28-day URLs with impressions → 301; the rest of the old tree → 404.
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
]);
const RAW_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function fail(message) {
    throw new Error(`[tiehoy-route-contract] ${message}`);
}
function routeFor(id) {
    const route = ROUTES[id];
    return route ?? fail(`unknown route: ${JSON.stringify(id)}`);
}
function resolveDefaultLocale(route) {
    return route.defaultLocale ?? "en";
}
function assertActiveLocale(route, locale) {
    if (!LOCALES.includes(locale))
        fail(`invalid locale: ${JSON.stringify(locale)}`);
    if (!route.activeLocales.includes(locale))
        fail(`inactive locale ${JSON.stringify(locale)} for route ${JSON.stringify(route.id)}`);
}
function assertParams(route, params) {
    const expected = route.params ?? [];
    const supplied = Object.keys(params ?? {});
    for (const key of supplied) {
        if (!expected.includes(key))
            fail(`route ${JSON.stringify(route.id)} received unknown param ${JSON.stringify(key)}`);
    }
    for (const key of expected) {
        const value = params?.[key];
        if (typeof value !== "string" || !RAW_SLUG.test(value)) {
            fail(`route ${JSON.stringify(route.id)} requires canonical raw-slug param ${JSON.stringify(key)}`);
        }
    }
}
function slugFor(route, locale) {
    return locale === "es" && route.esSlug ? route.esSlug : route.slug;
}
function pathFromSlug(route, locale, params) {
    let slug = slugFor(route, locale);
    for (const param of route.params ?? [])
        slug = slug.replace(`:${param}`, params[param]);
    if (/:\w+/.test(slug))
        fail(`route ${JSON.stringify(route.id)} retained an unresolved dynamic segment`);
    const suffix = slug === "" ? "/" : `/${slug}/`;
    return locale === resolveDefaultLocale(route) ? suffix : `/${locale}${suffix}`;
}
/** Build an active, locale-aware route path. Dynamic params must be raw canonical slugs. */
export function pathFor(id, locale, params) {
    const route = routeFor(id);
    assertActiveLocale(route, locale);
    assertParams(route, params);
    return pathFromSlug(route, locale, params);
}
/**
 * Resolve only a raw URL pathname against documented legacy behavior.
 * This function does not add or remove a slash and rejects query/fragment
 * input. A Worker adapter must preserve an incoming query when it constructs
 * a redirect URL from `targetPath`.
 */
export function resolveLegacyPath(pathname) {
    if (typeof pathname !== "string" || !pathname.startsWith("/") || /[?#]/.test(pathname))
        return null;
    for (const legacy of LEGACY_ROUTES) {
        const matches = legacy.match === "exact"
            ? pathname === legacy.path
            : legacy.match === "exactOrTrailingSlash"
                ? pathname === legacy.path || pathname === `${legacy.path}/`
                : pathname.startsWith(legacy.path);
        if (!matches)
            continue;
        if (legacy.action === "redirect") {
            return deepFreeze({ action: "redirect", status: 301, targetPath: pathFor(legacy.to, legacy.locale, legacy.params) });
        }
        if (legacy.action === "gone")
            return deepFreeze({ action: "gone", status: 410 });
        return deepFreeze({ action: "notFound", status: 404 });
    }
    return null;
}
export function canonicalFor(id, locale, params) {
    return `${TIEHOY_ORIGIN}${pathFor(id, locale, params)}`;
}
/**
 * Locale alternate canonical URLs. An override is an active per-request subset;
 * x-default always selects a locale present in that subset.
 */
export function alternatesFor(id, params, localeOverride) {
    const route = routeFor(id);
    const locales = localeOverride ? [...localeOverride] : [...route.activeLocales];
    if (locales.length === 0)
        fail(`locale override for route ${JSON.stringify(route.id)} must not be empty`);
    const unique = new Set();
    for (const locale of locales) {
        assertActiveLocale(route, locale);
        if (unique.has(locale))
            fail(`locale override for route ${JSON.stringify(route.id)} contains duplicate ${JSON.stringify(locale)}`);
        unique.add(locale);
    }
    assertParams(route, params);
    const result = {};
    for (const locale of locales)
        result[locale] = canonicalFor(route.id, locale, params);
    const defaultLocale = resolveDefaultLocale(route);
    const xDefaultLocale = unique.has(defaultLocale) ? defaultLocale : locales[0];
    result["x-default"] = result[xDefaultLocale];
    return result;
}
export function scltPathFor(id, locale, params) {
    const route = routeFor(id);
    assertActiveLocale(route, locale);
    assertParams(route, params);
    if (!route.scltSlug)
        return null;
    let slug = route.scltSlug;
    for (const param of route.params ?? [])
        slug = slug.replace(`:${param}`, params[param]);
    if (/:\w+/.test(slug))
        fail(`route ${JSON.stringify(route.id)} retained an unresolved SCLT dynamic segment`);
    return locale === "es" ? `/${slug}/` : `/${locale}/${slug}/`;
}
export function scltCanonicalFor(id, locale, params) {
    const path = scltPathFor(id, locale, params);
    return path === null ? null : `${SCLT_ORIGIN}${path}`;
}
/** React Router pattern without a leading slash. */
export function routerPattern(id, locale) {
    const route = routeFor(id);
    assertActiveLocale(route, locale);
    const slug = slugFor(route, locale);
    if (slug === "")
        return locale === resolveDefaultLocale(route) ? "" : locale;
    return locale === resolveDefaultLocale(route) ? slug : `${locale}/${slug}`;
}
/** Match a raw public path. Queries, fragments, encodings, and non-canonical entity segments never match. */
export function matchRoute(path) {
    if (typeof path !== "string" || !path.startsWith("/") || /[?#%\u0000-\u001F\u007F]/.test(path))
        return null;
    const normalized = path === "/" ? path : path.endsWith("/") ? path : `${path}/`;
    if (normalized.includes("//"))
        return null;
    const inputSegments = normalized === "/" ? [] : normalized.slice(1, -1).split("/");
    for (const id of ROUTE_IDS) {
        const route = ROUTES[id];
        for (const locale of route.activeLocales) {
            const prefix = locale === resolveDefaultLocale(route) ? [] : [locale];
            const routeSegments = slugFor(route, locale) === "" ? [] : slugFor(route, locale).split("/");
            if (inputSegments.length !== prefix.length + routeSegments.length)
                continue;
            const params = {};
            let matches = true;
            for (let i = 0; i < prefix.length; i++)
                if (inputSegments[i] !== prefix[i])
                    matches = false;
            for (let i = 0; i < routeSegments.length && matches; i++) {
                const expected = routeSegments[i];
                const actual = inputSegments[prefix.length + i];
                if (expected.startsWith(":")) {
                    if (!RAW_SLUG.test(actual))
                        matches = false;
                    else
                        params[expected.slice(1)] = actual;
                }
                else if (actual !== expected)
                    matches = false;
            }
            if (matches)
                return deepFreeze({ route, locale, params });
        }
    }
    return null;
}
export function sitemapRoutes() {
    return deepFreeze(Object.values(ROUTES).filter((route) => route.sitemap !== "never"));
}
export function sitemapStaticRoutes() {
    return deepFreeze(Object.values(ROUTES).filter((route) => route.sitemap === "static"));
}
export function sitemapEntityRoutes() {
    return deepFreeze(Object.values(ROUTES).filter((route) => route.sitemap === "entity"));
}
export function deepLinkRoutes() {
    return deepFreeze(Object.values(ROUTES).filter((route) => route.deepLink));
}
export function hubRoutes() {
    return deepFreeze(Object.values(ROUTES).filter((route) => route.id.startsWith("hub")));
}
export function validateManifest() {
    const errors = [];
    const staticPaths = new Set();
    if (new Set(ROUTE_IDS).size !== ROUTE_IDS.length)
        errors.push("ROUTE_IDS contains duplicates");
    for (const id of ROUTE_IDS) {
        const route = ROUTES[id];
        if (!route) {
            errors.push(`ROUTE_IDS entry ${JSON.stringify(id)} is missing from ROUTES`);
            continue;
        }
        if (route.id !== id)
            errors.push(`ROUTES[${JSON.stringify(id)}].id does not match`);
        if (route.slug.startsWith("/") || route.esSlug?.startsWith("/"))
            errors.push(`Route ${JSON.stringify(id)} has a leading slash in a slug`);
        if (!route.activeLocales.length)
            errors.push(`Route ${JSON.stringify(id)} has no active locales`);
        for (const locale of route.activeLocales)
            if (!LOCALES.includes(locale))
                errors.push(`Route ${JSON.stringify(id)} has invalid locale ${JSON.stringify(locale)}`);
        if (!route.activeLocales.includes(resolveDefaultLocale(route)))
            errors.push(`Route ${JSON.stringify(id)} default locale is inactive`);
        const slugParams = [...route.slug.matchAll(/:(\w+)/g)].map((match) => match[1]);
        const declared = route.params ?? [];
        if (route.kind === "entity" && (!declared.length || slugParams.length !== declared.length || slugParams.some((param, i) => param !== declared[i])))
            errors.push(`Entity route ${JSON.stringify(id)} params do not match slug`);
        if (route.kind === "static" && (declared.length || slugParams.length))
            errors.push(`Static route ${JSON.stringify(id)} must not have params`);
        if (route.kind === "static")
            for (const locale of route.activeLocales) {
                const path = pathFromSlug(route, locale);
                if (staticPaths.has(path))
                    errors.push(`Duplicate static path ${JSON.stringify(path)}`);
                staticPaths.add(path);
            }
    }
    for (const key of Object.keys(ROUTES))
        if (!ROUTE_IDS.includes(key))
            errors.push(`ROUTES contains undeclared route ${JSON.stringify(key)}`);
    for (const legacy of LEGACY_ROUTES) {
        const candidate = legacy;
        if (!candidate.path.startsWith("/"))
            errors.push(`Legacy path ${JSON.stringify(candidate.path)} must start with /`);
        if (/[?#]/.test(candidate.path))
            errors.push(`Legacy path ${JSON.stringify(candidate.path)} must be pathname-only`);
        if (candidate.match !== "exact" && candidate.match !== "exactOrTrailingSlash" && candidate.match !== "prefix")
            errors.push(`Legacy path ${JSON.stringify(candidate.path)} has invalid match semantics`);
        if (candidate.match === "exactOrTrailingSlash" && candidate.path.endsWith("/"))
            errors.push(`Legacy path ${JSON.stringify(candidate.path)} must omit the optional trailing slash`);
        if (candidate.action === "redirect") {
            if (candidate.status !== 301)
                errors.push(`Legacy redirect ${JSON.stringify(candidate.path)} must have status 301`);
            if (!candidate.to || !ROUTES[candidate.to])
                errors.push(`Legacy redirect ${JSON.stringify(candidate.path)} references unknown target`);
            else if (!candidate.locale || !ROUTES[candidate.to].activeLocales.includes(candidate.locale))
                errors.push(`Legacy redirect ${JSON.stringify(candidate.path)} has inactive target locale`);
            else {
                const targetRoute = ROUTES[candidate.to];
                const expectedParams = targetRoute.params ?? [];
                if (expectedParams.length) {
                    const redirect = legacy;
                    const suppliedKeys = Object.keys(redirect.params ?? {}).sort();
                    const expectedKeys = [...expectedParams].sort();
                    if (suppliedKeys.length !== expectedKeys.length || !expectedKeys.every((key, index) => suppliedKeys[index] === key)) {
                        errors.push(`Legacy redirect ${JSON.stringify(candidate.path)} has invalid target params`);
                    }
                    else {
                        try {
                            pathFor(candidate.to, candidate.locale, redirect.params);
                        }
                        catch {
                            errors.push(`Legacy redirect ${JSON.stringify(candidate.path)} has invalid target params`);
                        }
                    }
                }
            }
        }
        if (candidate.action === "gone" && candidate.status !== 410)
            errors.push(`Legacy gone route ${JSON.stringify(candidate.path)} must have status 410`);
        if (candidate.action === "notFound" && candidate.status !== 404)
            errors.push(`Legacy notFound route ${JSON.stringify(candidate.path)} must have status 404`);
    }
    return errors;
}
function registryContent() {
    return {
        locales: [...LOCALES],
        routes: Object.fromEntries(ROUTE_IDS.map((id) => {
            const { id: _id, ...route } = ROUTES[id];
            return [id, route];
        })),
        legacy: LEGACY_ROUTES.map((route) => ({ ...route })),
    };
}
function stableStringify(value) {
    if (Array.isArray(value))
        return `[${value.map(stableStringify).join(",")}]`;
    if (value !== null && typeof value === "object") {
        const record = value;
        return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
    }
    return JSON.stringify(value);
}
/** Small synchronous SHA-256 implementation so this contract has no runtime dependency, including Node built-ins. */
function sha256Hex(input) {
    const bytes = new TextEncoder().encode(input);
    const bitLength = bytes.length * 8;
    const paddedLength = (((bytes.length + 9 + 63) >> 6) << 6);
    const data = new Uint8Array(paddedLength);
    data.set(bytes);
    data[bytes.length] = 0x80;
    const view = new DataView(data.buffer);
    view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000), false);
    view.setUint32(paddedLength - 4, bitLength >>> 0, false);
    const hash = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
    const k = new Uint32Array([0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]);
    const w = new Uint32Array(64);
    for (let offset = 0; offset < data.length; offset += 64) {
        for (let i = 0; i < 16; i++)
            w[i] = view.getUint32(offset + i * 4, false);
        for (let i = 16; i < 64; i++) {
            const a = w[i - 15], b = w[i - 2];
            const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3);
            const s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10);
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
        }
        let [a, b, c, d, e, f, g, h] = hash;
        for (let i = 0; i < 64; i++) {
            const s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
            const choice = (e & f) ^ (~e & g);
            const temp1 = (h + s1 + choice + k[i] + w[i]) >>> 0;
            const s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
            const majority = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (s0 + majority) >>> 0;
            h = g;
            g = f;
            f = e;
            e = (d + temp1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) >>> 0;
        }
        hash[0] = (hash[0] + a) >>> 0;
        hash[1] = (hash[1] + b) >>> 0;
        hash[2] = (hash[2] + c) >>> 0;
        hash[3] = (hash[3] + d) >>> 0;
        hash[4] = (hash[4] + e) >>> 0;
        hash[5] = (hash[5] + f) >>> 0;
        hash[6] = (hash[6] + g) >>> 0;
        hash[7] = (hash[7] + h) >>> 0;
    }
    return Array.from(hash, (word) => word.toString(16).padStart(8, "0")).join("");
}
/** Stable SHA-256 of the JSON-exported route content, never date-derived. */
export const registryVersion = `sha256:${sha256Hex(stableStringify(registryContent()))}`;
export function toJSON() {
    return deepFreeze({ version: registryVersion, ...registryContent() });
}
