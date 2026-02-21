import { Box, BoxProps } from "@chakra-ui/react/box";

export interface ColumnResizeHandleProps extends BoxProps {
  isResizing?: boolean;
}

function ColumnResizeHandle({ isResizing, ...props }: ColumnResizeHandleProps) {
  return (
    <Box
      position="absolute"
      right={0}
      top={0}
      height="100%"
      width="4px"
      cursor="col-resize"
      userSelect="none"
      touchAction="none"
      backgroundColor={isResizing ? "blue.300" : undefined}
      zIndex={1}
      {...props}
    />
  );
}

export default ColumnResizeHandle;
