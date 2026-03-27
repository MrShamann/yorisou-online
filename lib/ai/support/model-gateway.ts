export type SupportGatewayUsage = {
  provider: "mistral" | "openai" | "deterministic";
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

const MAX_OUTPUT_TOKENS = 260;

async function requestMistral(prompt: string): Promise<SupportGatewayResult | null> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.MISTRAL_MODEL || "mistral-small-latest";

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [
          {
            role: "user",
            content: prompt,
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
    return {
      text,
      usage: {
        provider: "mistral",
        model,
        promptChars: prompt.length,
        outputChars: text?.length || 0,
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

async function requestOpenAI(prompt: string): Promise<SupportGatewayResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: prompt,
        temperature: 0.5,
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
    return {
      text,
      usage: {
        provider: "openai",
        model,
        promptChars: prompt.length,
        outputChars: text?.length || 0,
        fallbackUsed: true,
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

export async function generateSupportAssistantText(prompt: string): Promise<SupportGatewayResult | null> {
  const mistral = await requestMistral(prompt);
  if (mistral?.text) {
    console.info("support gateway result", mistral.usage);
    return mistral;
  }

  const openai = await requestOpenAI(prompt);
  if (openai?.text) {
    console.info("support gateway result", openai.usage);
    return openai;
  }

  return null;
}
