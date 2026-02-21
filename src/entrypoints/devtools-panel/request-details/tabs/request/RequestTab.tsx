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

function RequestTab({ request }: RequestTabProps) {
  if (request.parsedRequest.body == null) {
    return (
      <Stack padding={2}>
        <Text>No payload for this request.</Text>
      </Stack>
    );
  }
  const contentType = getHeader(request.parsedRequest.headers, "Content-Type");
  if (contentType?.includes("application/json")) {
    return (
      <Suspense fallback={<JsonViewerSkeleton />}>
        <JsonViewer data={request.parsedRequest.body} />
      </Suspense>
    );
  }
  return (
    <Stack padding={2}>
      <pre>{JSON.stringify(request.parsedRequest.body, null, 2)}</pre>
    </Stack>
  );
}

export default RequestTab;
