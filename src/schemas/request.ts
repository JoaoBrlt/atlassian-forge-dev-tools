import { z } from "zod";

/**
 * Validation schema for an Atlassian GraphQL extension invocation request.
 */
export const AtlassianInvokeExtensionRequestSchema = z.object({
  // The GraphQL operation name
  operationName: z.string(),

  // The GraphQL query
  query: z.string(),

  // The GraphQL variables
  variables: z.object({
    // The input variables
    input: z.object({
      // The invocation payload
      payload: z.object({
        // The invocation call
        call: z.object({
          // The HTTP request method
          method: z.string(),

          // The HTTP request path
          path: z.string(),

          // The HTTP request headers
          headers: z.record(z.string(), z.string()),

          // The HTTP request body (optional)
          body: z.unknown(),
        }),
      }),
    }),
  }),
});

/**
 * Validation schema for an Atlassian GraphQL extension invocation response.
 */
export const AtlassianInvokeExtensionResponseSchema = z.object({
  // The GraphQL response
  data: z.object({
    // The invocation result
    invokeExtension: z.object({
      // Whether the invocation was successful
      success: z.boolean(),

      // The invocation errors (optional)
      errors: z
        .array(
          z.object({
            // The error message
            message: z.string(),

            // The error extensions
            extensions: z.object({
              // The error type
              errorType: z.string(),

              // The error code
              statusCode: z.number(),
            }),
          }),
        )
        .optional()
        .nullable(),

      // The invocation response (optional)
      response: z
        .object({
          // The body of the function response
          body: z.object({
            // Whether the function call was successful
            success: z.boolean(),

            // The payload of the function response
            payload: z.object({
              // The HTTP response status
              status: z.number(),

              // The HTTP response headers
              headers: z.record(z.string(), z.array(z.string())),

              // The HTTP response body (optional)
              body: z.unknown(),
            }),
          }),
        })
        .optional()
        .nullable(),
    }),
  }),
});
