import {
  MantineProvider,
  AppShell,
  Header,
  Anchor,
  Group,
} from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { StylesPlaceholder } from "@mantine/remix";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <html lang="en">
        <head>
          <Meta />
          <Links />
          <StylesPlaceholder />
        </head>
        <body>
          <AppShell
            header={
              <Header height={60} p="xs">
                <Group sx={{ height: "100%" }}>
                  <Anchor component={Link} to="/">
                    Customers DB
                  </Anchor>
                </Group>
              </Header>
            }
          >
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </AppShell>
        </body>
      </html>
    </MantineProvider>
  );
}
