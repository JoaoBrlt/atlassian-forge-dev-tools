import { Skeleton } from "@chakra-ui/react/skeleton";
import { HStack, Stack } from "@chakra-ui/react/stack";

const LINE_WIDTHS = [
  "10%",
  "20%",
  "50%",
  "30%",
  "40%",
  "30%",
  "40%",
  "60%",
  "30%",
  "40%",
  "30%",
  "40%",
  "50%",
  "20%",
  "10%",
];

function JsonViewerSkeleton() {
  return (
    <Stack gap={2} padding={2}>
      {LINE_WIDTHS.map((width, index) => (
        <HStack key={index} gap={2} overflow="hidden">
          {/* Line numbers */}
          <Skeleton height="12px" width="40px" flexShrink={0} />

          {/* Code lines */}
          <Skeleton height="12px" width={width} flexShrink={1} minWidth={0} />
        </HStack>
      ))}
    </Stack>
  );
}

export default JsonViewerSkeleton;
