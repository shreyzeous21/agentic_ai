function getStatus(error: unknown): number | undefined {
  let current: any = error;

  while (current) {
    if (typeof current.status === "number") return current.status;
    current = current?.cause ?? current?.error;
  }

  return undefined;
}

function getRetryAfter(error: unknown): number | undefined {
  const headers = (error as any)?.headers;

  if (headers instanceof Headers) {
    const value = headers.get("retry-after");
    if (value) {
      const seconds = parseInt(value, 10);
      if (!Number.isNaN(seconds)) return seconds;
    }
  }

  const direct = (error as any)?.retryAfter;
  if (typeof direct === "number") return direct;

  return undefined;
}

function getApiMessage(error: unknown): string | undefined {
  const e = error as any;

  const candidates = [
    e?.error?.error?.message,
    e?.error?.message,
    e?.body?.error?.message,
    e?.cause?.message,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  return undefined;
}

export function formatErrorBrief(error: unknown): string {
  const status = getStatus(error);
  const apiMessage = getApiMessage(error);

  if (apiMessage) {
    return status ? `${status} ${apiMessage}` : apiMessage;
  }

  if (error instanceof Error) {
    return status ? `${status} ${error.message}` : error.message;
  }

  return "Unknown error";
}

export function handleAgentError(error: unknown): void {
  const status = getStatus(error);

  switch (status) {
    case 400:
      printError(
        "Bad Request",
        "The request sent to the AI provider is invalid.",
      );
      break;

    case 401:
      printError("Unauthorized", "Invalid or missing API key.");
      break;

    case 403:
      printError(
        "Forbidden",
        "You don't have permission to access this resource.",
      );
      break;

    case 404:
      printError(
        "Not Found",
        "The requested model or endpoint could not be found.",
      );
      break;

    case 413:
      printError(
        "Request Too Large",
        "The conversation exceeded the model's token limit.\nTry starting a new conversation.",
      );
      break;

    case 422:
      printError(
        "Model Error",
        "The model encountered an internal error.\nThis might be due to invalid input or model limitations.",
      );
      break;

    case 429: {
      const wait = getRetryAfter(error);
      const apiMessage = getApiMessage(error);
      const detail =
        apiMessage ?? "Too many requests were sent.\nPlease wait and try again.";
      const message = wait
        ? `${detail}\n\nRetry after ~${wait} seconds.`
        : detail;

      printError("Rate Limit Exceeded", message);
      break;
    }

    case 500:
      printError(
        "Internal Server Error",
        "The AI provider encountered an unexpected error.",
      );
      break;

    case 503:
      printError(
        "Service Unavailable",
        "The AI provider is temporarily unavailable.",
      );
      break;

    case 504:
      printError(
        "Gateway Timeout",
        "The AI provider took too long to respond.",
      );
      break;

    default:
      if (error instanceof Error) {
        printError("Unexpected Error", error.message);
      } else {
        printError("Unknown Error", JSON.stringify(error, null, 2));
      }
  }
}

function printError(title: string, message: string) {
  console.log();

  console.log("=".repeat(70));
  console.log(`❌ ${title}`);
  console.log("-".repeat(70));
  console.log(message);
  console.log("=".repeat(70));

  console.log();
}
