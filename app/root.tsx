import { MantineProvider, AppShell, Header } from "@mantine/core";
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
        </head>
        <body>
          <AppShell
            padding="md"
            header={
              <Header height={60} p="xs">
                <Link to="/">Customers database</Link>
              </Header>
            }
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
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
