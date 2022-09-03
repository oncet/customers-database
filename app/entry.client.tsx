import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import { ClientProvider } from "@mantine/remix";
import { createEmotionCache } from "@mantine/core";

createEmotionCache({ key: "mantine" });

hydrateRoot(
  document,
  <ClientProvider>
    <RemixBrowser />
  </ClientProvider>
);
