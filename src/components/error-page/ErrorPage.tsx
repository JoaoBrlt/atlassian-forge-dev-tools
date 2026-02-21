import { Box } from "@chakra-ui/react/box";
import { Button, IconButton } from "@chakra-ui/react/button";
import { CodeBlock } from "@chakra-ui/react/code-block";
import { Float } from "@chakra-ui/react/float";
import { Heading } from "@chakra-ui/react/heading";
import { Stack } from "@chakra-ui/react/stack";
import { Text } from "@chakra-ui/react/text";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { FallbackProps } from "react-error-boundary";

function getErrorStack(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }
  return "An unexpected error has occurred.";
}

function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Stack width="100%" height="100%" padding={4} gap={4} alignItems="center" justifyContent="center">
      <Box padding={4} borderRadius="full" color="red.fg" backgroundColor="red.subtle">
        <TriangleAlert size="3rem" />
      </Box>

      <Stack gap={2} textAlign="center">
        <Heading size="2xl">Something went wrong</Heading>
        <Text color="fg.muted" fontSize="md">
          Please try again or report the issue.
        </Text>
      </Stack>

      <CodeBlock.Root code={getErrorStack(error)} minWidth="min(100%, 20rem)" maxWidth="100%" overflow="auto">
        <CodeBlock.Content>
          <Float placement="top-end" offset="5" zIndex="1">
            <CodeBlock.CopyTrigger asChild>
              <IconButton variant="ghost" size="2xs">
                <CodeBlock.CopyIndicator />
              </IconButton>
            </CodeBlock.CopyTrigger>
          </Float>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>

      <Button colorPalette="red" onClick={resetErrorBoundary}>
        <RotateCcw />
        Try again
      </Button>
    </Stack>
  );
}

export default ErrorPage;
