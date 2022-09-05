import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Anchor, Breadcrumbs, Stack, Text, Title } from "@mantine/core";

export const meta: MetaFunction = () => {
  return {
    title: "Homepage - Customers database",
  };
};

export default function Index() {
  return (
    <Stack>
      <Breadcrumbs>
        {[
          <Anchor key="home" component={Link} to="/">
            Home
          </Anchor>,
        ]}
      </Breadcrumbs>
      <Title>Welcome!</Title>
      <Text>
        Head to{" "}
        <Anchor component={Link} to="customers">
          customers
        </Anchor>
        .
      </Text>
    </Stack>
  );
}
