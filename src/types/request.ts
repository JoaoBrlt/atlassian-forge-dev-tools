import { Browser } from "#imports";

/**
 * Represents the HAR entry of an Atlassian Forge extension invocation.
 */
export interface AtlassianEntry<RequestType = unknown, ResponseType = unknown>
  extends Browser.devtools.network.Request {
  parsedRequest: AtlassianRequest<RequestType>;
  parsedResponse: AtlassianResponse<ResponseType>;
}

/**
 * Represents the parsed request of an Atlassian Forge extension invocation.
 */
export interface AtlassianRequest<RequestType = unknown> {
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: RequestType;
}

/**
 * Represents the parsed response of an Atlassian Forge extension invocation.
 */
export type AtlassianResponse<ResponseType = unknown> = AtlassianSuccessResponse<ResponseType> | AtlassianErrorResponse;

/**
 * Represents the parsed response of a successful Atlassian Forge extension invocation.
 */
export interface AtlassianSuccessResponse<ResponseType = unknown> {
  success: true;
  status: number;
  headers: Record<string, string>;
  body?: ResponseType;
  transferredSize: number;
  totalSize: number;
  duration: number;
}

/**
 * Represents the parsed response of a failed Atlassian Forge extension invocation.
 */
export interface AtlassianErrorResponse {
  success?: false;
  errors: AtlassianInvocationError[];
  transferredSize: number;
  totalSize: number;
  duration: number;
}

/**
 * Represents an invocation error.
 */
export interface AtlassianInvocationError {
  status: number;
  type: string;
  message: string;
}
