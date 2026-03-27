import type { SupportRecommendedAction } from "@/lib/ai/support/action-router";
import type { SupportConversationPolicy } from "@/lib/ai/support/conversation-policy";
import { buildHinataSystemInstruction, HINATA_DISPLAY_NAME } from "@/lib/ai/support/hinata-persona";
import type {
  SupportAssistantLocale,
  SupportConversationMessage,
  SupportScenarioResult,
} from "@/lib/ai/support/scenario-engine";

export type SupportGatewayUsage = {
  provider: "opencloud" | "mistral" | "openai" | "deterministic";
  model: string;
  promptChars: number;
  outputChars: number;
  fallbackUsed: boolean;
  tokenUsage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
};

export type SupportGatewayResult = {
  text: string | null;
  usage: SupportGatewayUsage;
};

export type SupportGatewayInput = {
  locale: SupportAssistantLocale;
  userMessage: string;
  history: SupportConversationMessage[];
  scenario: SupportScenarioResult;
  policy: SupportConversationPolicy;
  actions: SupportRecommendedAction[];
  prompt: string;
};

const MAX_OUTPUT_TOKENS = 260;
const OPENCLOUD_DEFAULT_MODEL = "vercel-ai-gateway/mistral/devstral-2";

function extractText(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((entry) => {
        if (typeof entry === "string") {
          return entry;
        }
        if (entry && typeof entry === "object") {
          const candidate = entry as { text?: unknown; content?: unknown };
          return extractText(candidate.text) || extractText(candidate.content);
        }
        return null;
      })
      .filter((entry): entry is string => Boolean(entry));
    return parts.length > 0 ? parts.join("\n").trim() : null;
  }

  if (value && typeof value === "object") {
    const record = value as {
      text?: unknown;
      content?: unknown;
      output_text?: unknown;
      assistantMessage?: unknown;
      message?: unknown;
      response?: unknown;
      result?: unknown;
    };

    return (
      extractText(record.text) ||
      extractText(record.content) ||
      extractText(record.output_text) ||
      extractText(record.assistantMessage) ||
      extractText(record.message) ||
      extractText(record.response) ||
      extractText(record.result)
    );
  }

  return null;
}

function extractGatewayText(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return extractText(data);
  }

  const record = data as {
    text?: unknown;
    assistantMessage?: unknown;
    output_text?: unknown;
    content?: unknown;
    choices?: Array<{ message?: { content?: unknown } }>;
    output?: Array<{ content?: unknown }>;
    result?: unknown;
    response?: unknown;
  };

  return (
    extractText(record.text) ||
    extractText(record.assistantMessage) ||
    extractText(record.output_text) ||
    extractText(record.content) ||
    extractText(record.choices?.[0]?.message?.content) ||
    extractText(record.output?.[0]?.content) ||
    extractText(record.result) ||
    extractText(record.response)
  );
}

function toTokenUsage(usage: Record<string, unknown> | undefined) {
  if (!usage) {
    return undefined;
  }

  return {
    inputTokens:
      typeof usage.input_tokens === "number"
        ? usage.input_tokens
        : typeof usage.prompt_tokens === "number"
          ? usage.prompt_tokens
          : undefined,
    outputTokens:
      typeof usage.output_tokens === "number"
        ? usage.output_tokens
        : typeof usage.completion_tokens === "number"
          ? usage.completion_tokens
          : undefined,
    totalTokens: typeof usage.total_tokens === "number" ? usage.total_tokens : undefined,
  };
}

function buildSystemInstruction(input: SupportGatewayInput) {
  return buildHinataSystemInstruction({
    locale: input.locale,
    history: input.history,
    scenario: input.scenario,
    policy: input.policy,
    actions: input.actions,
  });
}

async function requestOpenCloud(input: SupportGatewayInput): Promise<SupportGatewayResult | null> {
  const url = process.env.OPENCLOUD_SUPPORT_CHAT_URL?.trim();
  if (!url) {
    return null;
  }

  const token = process.env.OPENCLOUD_SUPPORT_CHAT_TOKEN?.trim();
  const model = process.env.OPENCLOUD_SUPPORT_MODEL?.trim() || OPENCLOUD_DEFAULT_MODEL;
  const systemInstruction = buildSystemInstruction(input);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        channel: "yorisou_support",
        assistant: {
          name: HINATA_DISPLAY_NAME,
          locale: input.locale,
          systemInstruction,
        },
        conversation: {
          history: input.history,
          userMessage: input.userMessage,
        },
        scenario: input.scenario,
        responsePolicy: {
          opening: input.policy.opening,
          followUpQuestion: input.policy.followUpQuestion,
          responsePriorities: input.policy.responsePriorities,
          forbiddenStyles: input.policy.forbiddenStyles,
          responseLength: input.policy.responseLength,
          followUpStyle: input.policy.followUpStyle,
          uncertaintyHandling: input.policy.uncertaintyHandling,
          productStatusGuidance: input.policy.productStatusGuidance,
          continuationGuidance: input.policy.continuationGuidance,
          actionOfferingGuidance: input.policy.actionOfferingGuidance,
        },
        recommendedActions: input.actions,
        generation: {
          model,
          temperature: 0.35,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      }),
    });

    if (!response.ok) {
      console.error("support gateway opencloud request failed:", await response.text());
      return null;
    }

    const data = (await response.json()) as Record<string, unknown>;
    const text = extractGatewayText(data);
    if (!text) {
      return null;
    }

    return {
      text,
      usage: {
        provider: "opencloud",
        model: typeof data.model === "string" ? data.model : model,
        promptChars: input.prompt.length,
        outputChars: text.length,
        fallbackUsed: false,
        tokenUsage: toTokenUsage((data.usage as Record<string, unknown> | undefined) || undefined),
      },
    };
  } catch (error) {
    console.error("support gateway opencloud error:", error);
    return null;
  }
}

async function requestMistral(input: SupportGatewayInput): Promise<SupportGatewayResult | null> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.MISTRAL_MODEL || "mistral-small-latest";
  const systemInstruction = buildSystemInstruction(input);

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [
          {
            role: "system",
            content: systemInstruction,
          },
          {
            role: "user",
            content: input.prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("support gateway mistral request failed:", await response.text());
      return null;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
    };
    const text = data.choices?.[0]?.message?.content?.trim() || null;
    if (!text) {
      return null;
    }

    return {
      text,
      usage: {
        provider: "mistral",
        model,
        promptChars: input.prompt.length,
        outputChars: text.length,
        fallbackUsed: false,
        tokenUsage: {
          inputTokens: data.usage?.prompt_tokens,
          outputTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens,
        },
      },
    };
  } catch (error) {
    console.error("support gateway mistral error:", error);
    return null;
  }
}

async function requestOpenAI(input: SupportGatewayInput): Promise<SupportGatewayResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const systemInstruction = buildSystemInstruction(input);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions: systemInstruction,
        input: input.prompt,
        temperature: 0.45,
        max_output_tokens: MAX_OUTPUT_TOKENS,
      }),
    });

    if (!response.ok) {
      console.error("support gateway OpenAI request failed:", await response.text());
      return null;
    }

    const data = (await response.json()) as {
      output_text?: string;
      usage?: { input_tokens?: number; output_tokens?: number; total_tokens?: number };
    };
    const text = data.output_text?.trim() || null;
    if (!text) {
      return null;
    }

    return {
      text,
      usage: {
        provider: "openai",
        model,
        promptChars: input.prompt.length,
        outputChars: text.length,
        fallbackUsed: false,
        tokenUsage: {
          inputTokens: data.usage?.input_tokens,
          outputTokens: data.usage?.output_tokens,
          totalTokens: data.usage?.total_tokens,
        },
      },
    };
  } catch (error) {
    console.error("support gateway OpenAI error:", error);
    return null;
  }
}

export async function generateSupportAssistantText(input: SupportGatewayInput): Promise<SupportGatewayResult | null> {
  const opencloud = await requestOpenCloud(input);
  if (opencloud?.text) {
    console.info("support gateway result", opencloud.usage);
    return opencloud;
  }

  const mistral = await requestMistral(input);
  if (mistral?.text) {
    console.info("support gateway result", mistral.usage);
    return mistral;
  }

  const openai = await requestOpenAI(input);
  if (openai?.text) {
    console.info("support gateway result", openai.usage);
    return openai;
  }

  return null;
}
