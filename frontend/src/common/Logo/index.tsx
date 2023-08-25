import { Typography } from "@mui/material";
import { LogoProps } from "./interface";

const Logo = (props: LogoProps) => {
  return (
    <Typography
      variant="h6"
      noWrap
      sx={{
        fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: ".3rem",
        color: "inherit",
        textDecoration: "none",
        ...props.sx,
      }}
    >
      WILDME
    </Typography>
  );
};

export default Logo;
