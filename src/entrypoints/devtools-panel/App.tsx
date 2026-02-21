import { browser, Browser } from "#imports";
import { AtlassianEntry } from "@/types/request";
import { parseEntry } from "@/utils/request-utils";
import { Splitter } from "@chakra-ui/react/splitter";
import { Stack } from "@chakra-ui/react/stack";
import { useCallback, useEffect, useState } from "react";
import RequestDetails from "./request-details/RequestDetails";
import RequestList from "./request-list/RequestList";
import Toolbar from "./toolbar/Toolbar";

function App() {
  const [filter, setFilter] = useState("");
  const [requests, setRequests] = useState<AtlassianEntry[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AtlassianEntry>();

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleClearRequests = useCallback(() => {
    setRequests([]);
    setSelectedRequest(undefined);
  }, []);

  const handleSelectRequest = (request: AtlassianEntry) => {
    setSelectedRequest(request);
  };

  const handleCloseRequest = () => {
    setSelectedRequest(undefined);
  };

  const handleRequestFinished = useCallback((request: Browser.devtools.network.Request) => {
    parseEntry(request)
      .then((parsedRequest) => {
        if (parsedRequest != null) {
          setRequests((entries) => [...entries, parsedRequest]);
        }
      })
      .catch((error) => console.error("Failed to parse entry:", error));
  }, []);

  useEffect(() => {
    browser.devtools.network.onRequestFinished.addListener(handleRequestFinished);
    browser.devtools.network.onNavigated.addListener(handleClearRequests);
    return () => {
      browser.devtools.network.onRequestFinished.removeListener(handleRequestFinished);
      browser.devtools.network.onNavigated.removeListener(handleClearRequests);
    };
  }, [handleClearRequests, handleRequestFinished]);

  return (
    <Stack gap={0} width="100%" height="100%" overflow="hidden">
      <Toolbar filter={filter} onFilterChange={handleFilterChange} onClearRequests={handleClearRequests} />
      <Splitter.Root
        defaultSize={[30, 70]}
        panels={[
          { id: "request-list", minSize: 10 },
          { id: "request-details", minSize: 10 },
        ]}
      >
        <Splitter.Panel id="request-list">
          <Stack gap={0} width="100%" height="100%" overflow="auto">
            <RequestList
              filter={filter}
              requests={requests}
              selectedRequest={selectedRequest}
              onSelectRequest={handleSelectRequest}
            />
          </Stack>
        </Splitter.Panel>
        {selectedRequest != null && (
          <>
            <Splitter.ResizeTrigger id="request-list:request-details">
              <Splitter.ResizeTriggerSeparator zIndex={1000} />
            </Splitter.ResizeTrigger>
            <Splitter.Panel id="request-details">
              <Stack gap={0} width="100%" height="100%" overflow="hidden">
                <RequestDetails request={selectedRequest} onCloseRequest={handleCloseRequest} />
              </Stack>
            </Splitter.Panel>
          </>
        )}
      </Splitter.Root>
    </Stack>
  );
}

export default App;
