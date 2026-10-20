/** Dependency-free public route identity contract for TIEHoy. */
export declare const LOCALES: readonly ["en", "es", "fr", "ru", "zh", "ar"];
export type Locale = (typeof LOCALES)[number];
export declare const ROUTE_IDS: readonly ["home", "lote", "loteCheck", "loteNotify", "loteNotifyConfirmed", "citaPrevia", "citaPreviaAll", "citaPreviaBook", "citaPreviaProvince", "citaPreviaOffice", "pausedOffices", "topicsIndex", "hubTieCardRenewal", "hubResidenceRenewal", "hubFamilyReunification", "hubInvitationLetter", "guidesIndex", "guideDetail", "invitesIndex", "inviteDetail", "mentorsIndex", "lifeIndex", "lifeHave", "lifeNeed", "mentorTiger", "privacy", "cookies", "terms", "legalNotice", "construction"];
export type RouteId = (typeof ROUTE_IDS)[number];
export interface RouteDefinition {
    readonly id: RouteId;
    readonly kind: "static" | "entity";
    /** Path slug without locale prefix. EN and non-ES locales use this slug. */
    readonly slug: string;
    /** ES-specific slug when it differs from the regular slug. */
    readonly esSlug?: string;
    /** Locale that receives the unprefixed path; defaults to en. */
    readonly defaultLocale?: Locale;
    /** Dynamic segment names, in slug order. */
    readonly params?: readonly string[];
    /** Locales that have an active public route. */
    readonly activeLocales: readonly Locale[];
    readonly indexability: "indexable" | "noindex" | "excluded";
    readonly sitemap: "static" | "entity" | "never";
    readonly scltSlug?: string;
    readonly deepLink: boolean;
}
export interface LegacyRoute {
    readonly pattern: string;
    readonly action: "redirect" | "gone" | "notFound";
    readonly to?: RouteId;
    readonly status: 301 | 404 | 410;
}
export declare const TIEHOY_ORIGIN = "https://tiehoy.com";
export declare const SCLT_ORIGIN = "https://sclt.es";
export declare const ROUTES: Readonly<Record<RouteId, RouteDefinition>>;
/** Retired aliases deliberately remain direct 404s; they must not be revived implicitly. */
export declare const LEGACY_ROUTES: readonly LegacyRoute[];
/** Build an active, locale-aware route path. Dynamic params must be raw canonical slugs. */
export declare function pathFor(id: RouteId | string, locale: Locale | string, params?: Readonly<Record<string, string>>): string;
export declare function canonicalFor(id: RouteId | string, locale: Locale | string, params?: Readonly<Record<string, string>>): string;
/**
 * Locale alternate canonical URLs. An override is an active per-request subset;
 * x-default always selects a locale present in that subset.
 */
export declare function alternatesFor(id: RouteId | string, params?: Readonly<Record<string, string>>, localeOverride?: readonly (Locale | string)[]): Record<string, string>;
export declare function scltPathFor(id: RouteId | string, locale: Locale | string, params?: Readonly<Record<string, string>>): string | null;
export declare function scltCanonicalFor(id: RouteId | string, locale: Locale | string, params?: Readonly<Record<string, string>>): string | null;
/** React Router pattern without a leading slash. */
export declare function routerPattern(id: RouteId | string, locale: Locale | string): string;
export interface RouteMatch {
    readonly route: RouteDefinition;
    readonly locale: Locale;
    readonly params: Record<string, string>;
}
/** Match a raw public path. Queries, fragments, encodings, and non-canonical entity segments never match. */
export declare function matchRoute(path: string): RouteMatch | null;
export declare function sitemapRoutes(): RouteDefinition[];
export declare function sitemapStaticRoutes(): RouteDefinition[];
export declare function sitemapEntityRoutes(): RouteDefinition[];
export declare function deepLinkRoutes(): RouteDefinition[];
export declare function hubRoutes(): RouteDefinition[];
export declare function validateManifest(): string[];
export interface RouteRegistryJSON {
    readonly version: string;
    readonly locales: readonly string[];
    readonly routes: Record<string, Omit<RouteDefinition, "id">>;
    readonly legacy: readonly LegacyRoute[];
}
/** Stable SHA-256 of the JSON-exported route content, never date-derived. */
export declare const registryVersion: string;
export declare function toJSON(): RouteRegistryJSON;
