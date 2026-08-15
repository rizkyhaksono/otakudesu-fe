import { mock } from "bun:test";

/**
 * `server-only` throws on import outside a Server Component — which is exactly
 * what we want in the app, and exactly what blocks unit-testing the modules
 * that use it. Stub it here rather than weakening the real guard.
 */
mock.module("server-only", () => ({}));
