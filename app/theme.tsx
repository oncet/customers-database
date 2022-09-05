import type { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
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
