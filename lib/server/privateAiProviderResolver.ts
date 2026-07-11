export type ProviderPayload = {
  content: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
};

export type ReflectionProviderRoute = {
  alias: string;
  provider: string;
  model: string;
  endpoint: string;
  headers: Record<string, string>;
  body: (prompt: string) => Record<string, unknown>;
  parse: (value: unknown) => ProviderPayload;
};

type Env = Record<string, string | undefined>;

const openAiPayload = (value: unknown): ProviderPayload => {
  const data = value as { choices?: Array<{ message?: { content?: string } }>; usage?: { prompt_tokens?: number; completion_tokens?: number } };
  return {
    content: data.choices?.[0]?.message?.content || null,
    inputTokens: data.usage?.prompt_tokens || null,
    outputTokens: data.usage?.completion_tokens || null,
  };
};

const geminiPayload = (value: unknown): ProviderPayload => {
  const data = value as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number } };
  const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || null;
  return {
    content,
    inputTokens: data.usageMetadata?.promptTokenCount || null,
    outputTokens: data.usageMetadata?.candidatesTokenCount || null,
  };
};

const aliases = new Set(["gemini_shared", "groq_shared", "mistral_shared", "openrouter_shared", "nvidia_nim_shared"]);

function requestedAliases(env: Env): string[] {
  const primary = env.YORISOU_PRIVATE_AI_PROVIDER_PRIMARY?.trim();
  if (!primary) return [];
  const fallbacks = (env.YORISOU_PRIVATE_AI_PROVIDER_FALLBACKS || "").split(",").map((value) => value.trim()).filter(Boolean);
  return [...new Set([primary, ...fallbacks])].filter((value) => aliases.has(value));
}

export function resolvePrivateReflectionProviders(env: Env = process.env): ReflectionProviderRoute[] {
  return requestedAliases(env).flatMap((alias): ReflectionProviderRoute[] => {
    if (alias === "gemini_shared" && env.GEMINI_API_KEY?.trim()) {
      const model = env.YORISOU_PRIVATE_AI_GEMINI_MODEL?.trim() || "gemini-2.5-flash";
      return [{
        alias, provider: "gemini", model,
        endpoint: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
        body: (prompt) => ({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.25, maxOutputTokens: 1100, responseMimeType: "application/json" } }),
        parse: geminiPayload,
      }];
    }
    const definitions: Record<string, { provider: string; key?: string; model: string; endpoint: string }> = {
      groq_shared: { provider: "groq", key: env.GROQ_API_KEY, model: env.YORISOU_PRIVATE_AI_GROQ_MODEL?.trim() || "llama-3.3-70b-versatile", endpoint: "https://api.groq.com/openai/v1/chat/completions" },
      mistral_shared: { provider: "mistral", key: env.MISTRAL_API_KEY, model: env.YORISOU_PRIVATE_AI_MISTRAL_MODEL?.trim() || "mistral-small-latest", endpoint: "https://api.mistral.ai/v1/chat/completions" },
      openrouter_shared: { provider: "openrouter", key: env.OPENROUTER_API_KEY, model: env.YORISOU_PRIVATE_AI_OPENROUTER_MODEL?.trim() || "openrouter/free", endpoint: `${env.OPENROUTER_BASE_URL?.replace(/\/$/, "") || "https://openrouter.ai/api/v1"}/chat/completions` },
      nvidia_nim_shared: { provider: "nvidia_nim", key: env.NVIDIA_API_KEY, model: env.YORISOU_PRIVATE_AI_NVIDIA_MODEL?.trim() || env.NVIDIA_MODEL?.trim() || "meta/llama-3.1-8b-instruct", endpoint: `${env.NVIDIA_BASE_URL?.replace(/\/$/, "") || "https://integrate.api.nvidia.com/v1"}/chat/completions` },
    };
    const definition = definitions[alias];
    if (!definition?.key?.trim()) return [];
    return [{
      alias, provider: definition.provider, model: definition.model, endpoint: definition.endpoint,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${definition.key}` },
      body: (prompt) => ({ model: definition.model, temperature: 0.25, max_tokens: 1100, response_format: { type: "json_object" }, messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }] }),
      parse: openAiPayload,
    }];
  });
}
