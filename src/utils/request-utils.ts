import { Browser } from "#imports";
import { AtlassianInvokeExtensionRequestSchema, AtlassianInvokeExtensionResponseSchema } from "@/schemas/request";
import { AtlassianEntry, AtlassianRequest, AtlassianResponse } from "@/types/request";

function parseRequest(entry: Browser.devtools.network.Request): AtlassianRequest | null {
  const body = entry.request.postData?.text;
  if (body == null) {
    return null;
  }
  const parsedBody = AtlassianInvokeExtensionRequestSchema.safeParse(JSON.parse(body));
  if (!parsedBody.success) {
    return null;
  }
  const call = parsedBody.data.variables.input.payload.call;
  return {
    method: call.method,
    path: call.path,
    headers: call.headers,
    body: call.body,
  };
}

async function getResponseBody(entry: Browser.devtools.network.Request): Promise<string | null> {
  const result = await new Promise<{ content?: string; encoding?: string }>((resolve) => {
    entry.getContent((content, encoding) => {
      resolve({ content, encoding });
    });
  });
  if (result == null) {
    return null;
  }
  if (result.content == null) {
    return null;
  }
  if (result.encoding === "base64") {
    return Buffer.from(result.content, "base64").toString("utf-8");
  }
  return result.content;
}

function convertResponseHeaders(rawHeaders: Record<string, string[]>): Record<string, string> {
  return Object.fromEntries(Object.entries(rawHeaders).map(([key, values]) => [key, values.join(", ")]));
}

async function parseResponse(entry: Browser.devtools.network.Request): Promise<AtlassianResponse | null> {
  const body = await getResponseBody(entry);
  if (body == null) {
    return null;
  }
  const parsedBody = AtlassianInvokeExtensionResponseSchema.safeParse(JSON.parse(body));
  if (!parsedBody.success) {
    return null;
  }
  const success = parsedBody.data.data.invokeExtension.success;
  if (!success) {
    const errors = parsedBody.data.data.invokeExtension.errors;
    return {
      success: false,
      errors:
        errors?.map((error) => ({
          status: error.extensions.statusCode,
          type: error.extensions.errorType,
          message: error.message,
        })) ?? [],
      transferredSize: entry.response._transferSize ?? entry.response.content.size,
      totalSize: entry.response.content.size,
      duration: entry.time,
    };
  }
  const response = parsedBody.data.data.invokeExtension.response;
  if (response == null) {
    return {
      success: false,
      errors: [
        {
          status: 500,
          type: "MISSING_RESPONSE",
          message: "Missing response from function.",
        },
      ],
      transferredSize: entry.response._transferSize ?? entry.response.content.size,
      totalSize: entry.response.content.size,
      duration: entry.time,
    };
  }
  const payload = response.body.payload;
  return {
    success: true,
    status: payload.status,
    headers: convertResponseHeaders(payload.headers),
    body: payload.body,
    transferredSize: entry.response._transferSize ?? entry.response.content.size,
    totalSize: entry.response.content.size,
    duration: entry.time,
  };
}

/**
 * Parses a network HAR entry into an Atlassian HAR entry (if the request is an Atlassian Forge extension invocation).
 * @param entry the network HAR entry to parse
 * @return the Atlassian HAR entry, or `null` if the entry is not an Atlassian Forge extension invocation
 */
export async function parseEntry(entry: Browser.devtools.network.Request): Promise<AtlassianEntry | null> {
  if (entry == null) {
    return null;
  }
  if (entry.request.method !== "POST") {
    return null;
  }
  const url = new URL(entry.request.url);
  if (!url.pathname.endsWith("/gateway/api/graphql")) {
    return null;
  }
  const body = entry.request.postData?.text;
  if (body == null) {
    return null;
  }
  const parsedBody = JSON.parse(body) as { operationName?: string };
  if (parsedBody == null) {
    return null;
  }
  const operationName = parsedBody.operationName;
  if (operationName !== "forge_ui_invokeExtension") {
    return null;
  }
  const parsedRequest = parseRequest(entry);
  if (parsedRequest == null) {
    return null;
  }
  const parsedResponse = await parseResponse(entry);
  if (parsedResponse == null) {
    return null;
  }
  return {
    ...entry,
    parsedRequest,
    parsedResponse,
  };
}

/**
 * Retrieves the value of a header from a set of headers.
 * @param headers the set of headers
 * @param name the name of the header
 * @return the value of the header, or `undefined` if the header is not present
 */
export function getHeader(headers: Record<string, string>, name: string): string | undefined {
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  return entry?.[1];
}
