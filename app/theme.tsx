import type { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  colorScheme: "dark",
  components: {
    Breadcrumbs: {
      styles: {
        root: {
          flexWrap: "wrap",
        },
      },
    },
  },
};
