import ColumnResizeHandle from "@/entrypoints/devtools-panel/request-list/column-resize-handle/ColumnResizeHandle";
import ResponseStatus from "@/entrypoints/devtools-panel/request-list/response-status/ResponseStatus";
import { AtlassianEntry } from "@/types/request";
import { formatSize } from "@/utils/size-utils";
import { formatDuration } from "@/utils/time-utils";
import { Badge } from "@chakra-ui/react/badge";
import { Table } from "@chakra-ui/react/table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

export interface RequestListProps {
  filter: string;
  requests: AtlassianEntry[];
  selectedRequest?: AtlassianEntry;
  onSelectRequest: (request: AtlassianEntry) => void;
}

const columnHelper = createColumnHelper<AtlassianEntry>();

const COLUMNS = [
  columnHelper.accessor("parsedResponse.status", {
    id: "status",
    header: "Status",
    size: 80,
    cell: (props) => {
      const value = props.getValue<number | undefined>();
      if (value == null) {
        return (
          <Badge colorPalette="red" title="Invocation error">
            Error
          </Badge>
        );
      }
      return <ResponseStatus status={value} />;
    },
  }),
  columnHelper.accessor("parsedRequest.method", {
    id: "method",
    header: "Method",
    size: 80,
  }),
  columnHelper.accessor("parsedRequest.path", {
    id: "path",
    header: "Path",
    size: 160,
  }),
  columnHelper.accessor("parsedResponse.transferredSize", {
    id: "size",
    header: "Size",
    size: 80,
    cell: (props) => {
      const value = props.getValue<number | undefined>();
      if (value == null) {
        return "N/A";
      }
      return formatSize(value);
    },
  }),
  columnHelper.accessor("parsedResponse.duration", {
    id: "time",
    header: "Time",
    size: 80,
    cell: (props) => {
      const value = props.getValue<number | undefined>();
      if (value == null) {
        return "N/A";
      }
      return formatDuration(value);
    },
  }),
];

function RequestList({ filter, requests, selectedRequest, onSelectRequest }: RequestListProps) {
  const columnFilters = useMemo(() => (filter ? [{ id: "path", value: filter }] : []), [filter]);

  const table = useReactTable({
    data: requests,
    columns: COLUMNS,
    state: {
      columnFilters,
    },
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: () => {},
    defaultColumn: {
      minSize: 60,
      size: 80,
    },
  });

  return (
    <Table.Root
      size="sm"
      variant="outline"
      interactive
      stickyHeader
      showColumnBorder
      width="100%"
      tableLayout="fixed"
      fontSize="0.75rem"
    >
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id} backgroundColor="bg.muted">
            {headerGroup.headers.map((header) => (
              <Table.ColumnHeader
                key={header.id}
                colSpan={header.colSpan}
                position="relative"
                padding={1}
                style={{ width: header.getSize() }}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.getCanResize() && (
                  <ColumnResizeHandle
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    onDoubleClick={() => header.column.resetSize()}
                    isResizing={header.column.getIsResizing()}
                  />
                )}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row
            key={row.id}
            cursor="pointer"
            data-selected={row.original === selectedRequest ? "" : undefined}
            onClick={() => onSelectRequest(row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <Table.Cell
                key={cell.id}
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                padding={1}
                style={{ width: cell.column.getSize() }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export default RequestList;
