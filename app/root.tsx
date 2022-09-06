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
import {
  MantineProvider,
  AppShell,
  Header,
  Anchor,
  Group,
  Container,
} from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";

import { theme } from "~/theme";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <MantineProvider
      theme={theme}
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <html lang="en">
        <head>
          <Meta />
          <Links />
          <StylesPlaceholder />
        </head>
        <body>
          <AppShell
            header={
              <Header height={60}>
                <Container sx={{ height: "100%" }}>
                  <Group sx={{ height: "100%" }}>
                    <Anchor component={Link} to="/">
                      CDB
                    </Anchor>
                  </Group>
                </Container>
              </Header>
            }
            styles={{
              main: {
                paddingLeft: 0,
                paddingRight: 0,
              },
            }}
          >
            <Container>
              <Outlet />
            </Container>
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </AppShell>
        </body>
      </html>
    </MantineProvider>
  );
}
