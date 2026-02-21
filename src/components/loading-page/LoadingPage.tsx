import { Spinner } from "@chakra-ui/react/spinner";
import { Stack } from "@chakra-ui/react/stack";

function LoadingPage() {
  return (
    <Stack width="100%" height="100%" padding={4} gap={4} alignItems="center" justifyContent="center">
      <Spinner size="xl" />
    </Stack>
  );
}

export default LoadingPage;
