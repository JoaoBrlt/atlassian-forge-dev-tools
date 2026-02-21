import { Badge, BadgeProps } from "@chakra-ui/react/badge";
import HttpStatus from "http-status-codes";

export interface ResponseStatusProps {
  status: number;
}

function getStatusColorPalette(status: number): BadgeProps["colorPalette"] {
  if (status >= 100 && status <= 399) {
    return "green";
  }
  if (status >= 400 && status <= 599) {
    return "red";
  }
  return "gray";
}

function getStatusTitle(status: number): string {
  return `${status} ${HttpStatus.getStatusText(status)}`;
}

function ResponseStatus({ status }: ResponseStatusProps) {
  const colorPalette = getStatusColorPalette(status);
  const title = getStatusTitle(status);
  return (
    <Badge colorPalette={colorPalette} title={title}>
      {status}
    </Badge>
  );
}

export default ResponseStatus;
