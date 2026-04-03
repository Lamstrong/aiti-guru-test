import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { type NotFoundRouteComponent } from "@tanstack/react-router";

import { RouterLink } from "../components/link";

export const NotFoundComponent: NotFoundRouteComponent = () => {
  return (
    <Box
      component="main"
      sx={{
        gap: 2,
        flex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        {"404"}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: "text.secondary",
        }}
      >
        {"Запрашиваемая страница не найдена"}
      </Typography>

      <RouterLink
        to="/"
        variant="h5"
        sx={{
          textDecoration: "none",
        }}
      >
        {"На главную"}
      </RouterLink>
    </Box>
  );
};
