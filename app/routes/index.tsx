import { Anchor, List, Stack, Text, Title } from "@mantine/core";
import type { Customer } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = { customers: Array<Customer> };

export const loader: LoaderFunction = async () => {
  const data = {
    customers: await db.customer.findMany(),
  };

  return json(data);
};

export default function Index() {
  const { customers } = useLoaderData<LoaderData>();

  return customers ? (
    <Stack>
      <Title>Customers</Title>
      <List>
        {customers.map((customer) => (
          <List.Item key={customer.id}>
            <Anchor component={Link} to={"customer/" + customer.id}>
              {customer.name}
            </Anchor>
          </List.Item>
        ))}
      </List>
    </Stack>
  ) : (
    <Text>No customers found :(</Text>
  );
}
