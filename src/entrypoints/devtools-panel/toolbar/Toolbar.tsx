import { CloseButton, IconButton } from "@chakra-ui/react/button";
import { Input } from "@chakra-ui/react/input";
import { InputGroup } from "@chakra-ui/react/input-group";
import { HStack, StackSeparator } from "@chakra-ui/react/stack";
import { Funnel, Trash } from "lucide-react";
import { ChangeEvent, useRef } from "react";

export interface ToolbarProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  onClearRequests: () => void;
}

function Toolbar({ filter, onFilterChange, onClearRequests }: ToolbarProps) {
  const filterRef = useRef<HTMLInputElement | null>(null);

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFilterChange(event.target.value);
  };

  const handleFilterClear = () => {
    onFilterChange("");
    filterRef.current?.focus();
  };

  return (
    <HStack gap={0} separator={<StackSeparator />} borderWidth="1px" borderColor="border">
      <IconButton
        size="xs"
        variant="ghost"
        aria-label="Clear requests"
        title="Clear requests"
        onClick={onClearRequests}
      >
        <Trash />
      </IconButton>
      <InputGroup
        startElement={<Funnel size="0.875rem" />}
        endElement={
          filter ? <CloseButton size="xs" aria-label="Clear" title="Clear" onClick={handleFilterClear} /> : undefined
        }
      >
        <Input
          ref={filterRef}
          size="xs"
          ps="2.375rem"
          border="none"
          borderRadius={0}
          placeholder="Filter"
          value={filter}
          onChange={handleFilterChange}
        />
      </InputGroup>
    </HStack>
  );
}

export default Toolbar;
