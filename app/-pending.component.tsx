import Box from "@mui/material/Box";
import { RouteComponent } from "@tanstack/react-router";
import CircularProgress from "@mui/material/CircularProgress";

export const PendingComponent: RouteComponent = () => {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
};
