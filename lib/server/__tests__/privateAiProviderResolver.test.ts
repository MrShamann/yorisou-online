import assert from "node:assert/strict";
import { resolvePrivateReflectionProviders } from "../privateAiProviderResolver";

const routes = resolvePrivateReflectionProviders({
  YORISOU_PRIVATE_AI_PROVIDER_PRIMARY: "gemini_shared",
  YORISOU_PRIVATE_AI_PROVIDER_FALLBACKS: "groq_shared,openrouter_shared,unknown",
  GEMINI_API_KEY: "test-gemini-key",
  GROQ_API_KEY: "test-groq-key",
  OPENROUTER_API_KEY: "test-openrouter-key",
});

assert.deepEqual(routes.map((route) => [route.alias, route.provider, route.model]), [
  ["gemini_shared", "gemini", "gemini-2.5-flash"],
  ["groq_shared", "groq", "llama-3.3-70b-versatile"],
  ["openrouter_shared", "openrouter", "openrouter/free"],
]);
assert.equal(routes[0].body("fixed prompt").generationConfig !== undefined, true);
assert.equal(routes[1].body("fixed prompt").response_format !== undefined, true);
assert.equal(resolvePrivateReflectionProviders({ GEMINI_API_KEY: "test" }).length, 0);
assert.equal(resolvePrivateReflectionProviders({ YORISOU_PRIVATE_AI_PROVIDER_PRIMARY: "gemini_shared" }).length, 0);
console.log(JSON.stringify({ status: "ok", providerResolverAssertions: 6 }));
