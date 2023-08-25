import { BoxProps } from "@mui/material";

export interface HeaderProps extends BoxProps {
  onRefresh: () => Promise<void>;
}
