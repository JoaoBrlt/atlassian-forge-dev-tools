import { AtlassianEntry } from "@/types/request";
import { formatSize } from "@/utils/size-utils";
import { formatDuration } from "@/utils/time-utils";
import { Collapsible } from "@chakra-ui/react/collapsible";
import { Stack } from "@chakra-ui/react/stack";
import { Table } from "@chakra-ui/react/table";
import { Text, TextProps } from "@chakra-ui/react/text";
import HttpStatus from "http-status-codes";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

export interface HeadersTabProps {
  request: AtlassianEntry;
}

interface RequestDetail {
  name: string;
  value: ReactNode;
}

function getStatusColor(status: number): TextProps["color"] {
  if (status >= 100 && status <= 399) {
    return "green";
  }
  if (status >= 400 && status <= 599) {
    return "red";
  }
  return "gray";
}

function getGeneralDetails(request: AtlassianEntry): RequestDetail[] {
  return [
    {
      name: "Method",
      value: request.parsedRequest.method,
    },
    {
      name: "Path",
      value: request.parsedRequest.path,
    },
    {
      name: "Status",
      value: request.parsedResponse.success ? (
        <Text fontWeight="semibold" color={getStatusColor(request.parsedResponse.status)}>
          {request.parsedResponse.status} {HttpStatus.getStatusText(request.parsedResponse.status)}
        </Text>
      ) : (
        <Text fontWeight="semibold" color="fg.error">
          Invocation error
        </Text>
      ),
    },
    {
      name: "Size",
      value: `${formatSize(request.parsedResponse.transferredSize)} (${formatSize(request.parsedResponse.totalSize)} size)`,
    },
    {
      name: "Time",
      value: formatDuration(request.parsedResponse.duration),
    },
  ];
}

function HeadersTab({ request }: HeadersTabProps) {
  const generalDetails = getGeneralDetails(request);
  return (
    <Stack gap={0} minWidth="320px">
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger
          display="flex"
          alignItems="center"
          gap={2}
          width="100%"
          paddingInline={2}
          paddingBlock={1}
          borderBlockWidth="1px"
          backgroundColor="bg.muted"
          fontSize="0.75rem"
          cursor="pointer"
        >
          <Collapsible.Indicator transition="transform 0.2s" _open={{ transform: "rotate(90deg)" }}>
            <ChevronRight size="0.875rem" />
          </Collapsible.Indicator>
          General
        </Collapsible.Trigger>
        <Collapsible.Content asChild>
          <Stack padding={2}>
            <Table.Root size="sm" fontSize="0.75rem">
              <Table.Body>
                {generalDetails.map(({ name, value }) => (
                  <Table.Row key={name}>
                    <Table.ColumnHeader
                      width="30%"
                      minWidth="160px"
                      maxWidth="240px"
                      padding={0}
                      paddingBottom="1"
                      border="none"
                    >
                      {name}
                    </Table.ColumnHeader>
                    <Table.Cell padding={0} paddingBottom="1" border="none" wordBreak="break-all">
                      {value}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger
          display="flex"
          alignItems="center"
          gap={2}
          width="100%"
          paddingInline={2}
          paddingBlock={1}
          borderBlockWidth="1px"
          backgroundColor="bg.muted"
          fontSize="0.75rem"
          cursor="pointer"
        >
          <Collapsible.Indicator transition="transform 0.2s" _open={{ transform: "rotate(90deg)" }}>
            <ChevronRight size="0.875rem" />
          </Collapsible.Indicator>
          Response Headers
        </Collapsible.Trigger>
        <Collapsible.Content asChild>
          <Stack padding={2}>
            {request.parsedResponse.success && Object.keys(request.parsedResponse.headers).length > 0 ? (
              <Table.Root size="sm" fontSize="0.75rem">
                <Table.Body>
                  {Object.entries(request.parsedResponse.headers).map(([name, value]) => (
                    <Table.Row key={name}>
                      <Table.ColumnHeader
                        width="30%"
                        minWidth="160px"
                        maxWidth="240px"
                        padding={0}
                        paddingBottom="1"
                        border="none"
                      >
                        {name}
                      </Table.ColumnHeader>
                      <Table.Cell padding={0} paddingBottom="1" border="none" wordBreak="break-word">
                        {value}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            ) : (
              <Text>No response headers for this request.</Text>
            )}
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger
          display="flex"
          alignItems="center"
          gap={2}
          width="100%"
          paddingInline={2}
          paddingBlock={1}
          borderBlockWidth="1px"
          backgroundColor="bg.muted"
          fontSize="0.75rem"
          cursor="pointer"
        >
          <Collapsible.Indicator transition="transform 0.2s" _open={{ transform: "rotate(90deg)" }}>
            <ChevronRight size="0.875rem" />
          </Collapsible.Indicator>
          Request Headers
        </Collapsible.Trigger>
        <Collapsible.Content asChild>
          <Stack padding={2}>
            {Object.keys(request.parsedRequest.headers).length > 0 ? (
              <Table.Root size="sm" fontSize="0.75rem">
                <Table.Body>
                  {Object.entries(request.parsedRequest.headers).map(([name, value]) => (
                    <Table.Row key={name}>
                      <Table.ColumnHeader
                        width="30%"
                        minWidth="160px"
                        maxWidth="240px"
                        padding={0}
                        paddingBottom="1"
                        border="none"
                      >
                        {name}
                      </Table.ColumnHeader>
                      <Table.Cell padding={0} paddingBottom="1" border="none" wordBreak="break-word">
                        {value}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            ) : (
              <Text>No request headers for this request.</Text>
            )}
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Stack>
  );
}

export default HeadersTab;
