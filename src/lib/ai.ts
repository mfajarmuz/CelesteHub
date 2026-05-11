import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export class GeminiCliError extends Error {
  code: "CLI_FAILURE" | "TIMEOUT" | "EMPTY_RESPONSE";
  stderr?: string;

  constructor(
    message: string,
    code: "CLI_FAILURE" | "TIMEOUT" | "EMPTY_RESPONSE",
    stderr?: string
  ) {
    super(message);
    this.name = "GeminiCliError";
    this.code = code;
    this.stderr = stderr;
  }
}

export type GeminiPromptOptions = {
  model?: string;
  timeoutMs?: number;
  maxBuffer?: number;
};

function cleanGeminiText(raw: string) {
  return raw
    .replace(/^```(?:json|markdown|md|txt)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function runGeminiPrompt(
  prompt: string,
  options: GeminiPromptOptions = {}
) {
  const {
    model = "gemini-2.5-flash",
    timeoutMs = 90000,
    maxBuffer = 1024 * 1024 * 4,
  } = options;

  try {
    const { stdout, stderr } = await execFileAsync(
      "gemini",
      ["-m", model, "-p", prompt],
      {
        timeout: timeoutMs,
        maxBuffer,
        env: {
          ...process.env,
          NO_COLOR: "1",
          FORCE_COLOR: "0",
        },
      }
    );

    const text = cleanGeminiText(stdout || "");
    if (!text) {
      throw new GeminiCliError(
        "Gemini CLI returned an empty response.",
        "EMPTY_RESPONSE",
        stderr?.trim() || undefined
      );
    }

    return text;
  } catch (error) {
    const err = error as NodeJS.ErrnoException & {
      stdout?: string;
      stderr?: string;
      killed?: boolean;
      signal?: string;
      code?: string | number;
    };

    if (err.killed || err.signal === "SIGTERM") {
      throw new GeminiCliError(
        `Gemini CLI timed out after ${timeoutMs}ms.`,
        "TIMEOUT",
        err.stderr?.trim() || undefined
      );
    }

    if (error instanceof GeminiCliError) {
      throw error;
    }

    throw new GeminiCliError(
      "Gemini CLI failed to generate a response.",
      "CLI_FAILURE",
      err.stderr?.trim() || undefined
    );
  }
}
