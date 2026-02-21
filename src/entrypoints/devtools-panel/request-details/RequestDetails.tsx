import HeadersTab from "@/entrypoints/devtools-panel/request-details/tabs/headers/HeadersTab";
import RequestTab from "@/entrypoints/devtools-panel/request-details/tabs/request/RequestTab";
import { useVisibleItems } from "@/hooks/useVisibleItems";
import { AtlassianEntry } from "@/types/request";
import { CloseButton, IconButton } from "@chakra-ui/react/button";
import { Center } from "@chakra-ui/react/center";
import { Menu } from "@chakra-ui/react/menu";
import { Portal } from "@chakra-ui/react/portal";
import { Stack } from "@chakra-ui/react/stack";
import { SystemStyleObject } from "@chakra-ui/react/styled-system";
import { Tabs } from "@chakra-ui/react/tabs";
import { ChevronsRight } from "lucide-react";
import { CSSProperties, useState } from "react";
import ResponseTab from "./tabs/response/ResponseTab";

export interface RequestDetailsProps {
  request: AtlassianEntry;
  onCloseRequest: () => void;
}

interface Tab {
  label: string;
  value: string;
}

const TABS: Tab[] = [
  {
    label: "Headers",
    value: "headers",
  },
  {
    label: "Request",
    value: "request",
  },
  {
    label: "Response",
    value: "response",
  },
];

const hiddenTabStyles: CSSProperties = {
  position: "absolute",
  visibility: "hidden",
  pointerEvents: "none",
};

const selectedTabStyles: SystemStyleObject = {
  content: '""',
  position: "absolute",
  bottom: "-1px",
  insetInline: "0",
  height: "2px",
  background: "var(--chakra-colors-color-palette-solid)",
};

function RequestDetails({ request, onCloseRequest }: RequestDetailsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("headers");

  const { containerRef, itemRefs, visibleCount } = useVisibleItems<HTMLDivElement, HTMLButtonElement>({
    totalItems: TABS.length,
    reservedWidth: 32,
    ellipsisWidth: 24,
  });
  const visibleTabs = TABS.slice(0, visibleCount);
  const overflowTabs = TABS.slice(visibleCount);
  const isSelectedTabVisible = visibleTabs.some((tab) => tab.value === selectedTab);

  return (
    <Tabs.Root
      size="sm"
      lazyMount
      unmountOnExit
      value={selectedTab}
      onValueChange={(event) => setSelectedTab(event.value)}
      asChild
    >
      <Stack gap={0} height="100%" overflow="hidden">
        <Tabs.List ref={containerRef} minHeight="1.75rem" backgroundColor="bg.muted">
          <Center>
            <CloseButton size="2xs" aria-label="Close" title="Close" onClick={onCloseRequest} />
          </Center>
          {TABS.map((tab, index) => {
            const isVisible = index < visibleCount;
            return (
              <Tabs.Trigger
                key={tab.value}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                value={tab.value}
                flexShrink={0}
                height="1.75rem"
                fontSize="0.75rem"
                style={isVisible ? undefined : hiddenTabStyles}
              >
                {tab.label}
              </Tabs.Trigger>
            );
          })}
          {overflowTabs != null && overflowTabs.length > 0 && (
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton
                  variant="ghost"
                  size="2xs"
                  aria-label="More"
                  title="More"
                  height="1.75rem"
                  fontSize="0.75rem"
                  border="none"
                  _before={isSelectedTabVisible ? undefined : selectedTabStyles}
                >
                  <ChevronsRight />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.RadioItemGroup value={selectedTab} onValueChange={(event) => setSelectedTab(event.value)}>
                      {overflowTabs.map((tab) => (
                        <Menu.RadioItem key={tab.value} value={tab.value}>
                          {tab.label}
                          <Menu.ItemIndicator />
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioItemGroup>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </Tabs.List>
        <Tabs.Content value="headers" asChild>
          <Stack gap={0} height="100%" overflow="auto" padding={0}>
            <HeadersTab request={request} />
          </Stack>
        </Tabs.Content>
        <Tabs.Content value="request" asChild>
          <Stack gap={0} height="100%" overflow="auto" padding={0}>
            <RequestTab request={request} />
          </Stack>
        </Tabs.Content>
        <Tabs.Content value="response" asChild>
          <Stack gap={0} height="100%" overflow="auto" padding={0}>
            <ResponseTab request={request} />
          </Stack>
        </Tabs.Content>
      </Stack>
    </Tabs.Root>
  );
}

export default RequestDetails;
