import JsonViewer from "@/components/json-viewer/JsonViewer.lazy";
import JsonViewerSkeleton from "@/components/json-viewer/JsonViewer.skeleton";
import { AtlassianEntry } from "@/types/request";
import { getHeader } from "@/utils/request-utils";
import { Stack } from "@chakra-ui/react/stack";
import { Text } from "@chakra-ui/react/text";
import { Suspense } from "react";

export interface RequestTabProps {
  request: AtlassianEntry;
}

function ResponseTab({ request }: RequestTabProps) {
  if (!request.parsedResponse.success) {
    return (
      <Suspense fallback={<JsonViewerSkeleton />}>
        <JsonViewer data={request.parsedResponse.errors} />
      </Suspense>
    );
  }
  if (request.parsedResponse.body == null) {
    return (
      <Stack padding={2}>
        <Text>No response data for this request.</Text>
      </Stack>
    );
  }
  const contentType = getHeader(request.parsedResponse.headers, "Content-Type");
  if (contentType?.includes("application/json")) {
    return (
      <Suspense fallback={<JsonViewerSkeleton />}>
        <JsonViewer data={request.parsedResponse.body} />
      </Suspense>
    );
  }
  return (
    <Stack padding={2}>
      <pre>{JSON.stringify(request.parsedResponse.body, null, 2)}</pre>
    </Stack>
  );
}

export default ResponseTab;
