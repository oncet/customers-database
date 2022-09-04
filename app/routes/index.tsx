import { Anchor, Group, List, Stack, Text, Title } from "@mantine/core";
import type { Customer } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = { customers: Array<Customer> };

export const loader: LoaderFunction = async () => {
  const data = {
    customers: await db.customer.findMany(),
  };

  return json(data);
};

export const meta: MetaFunction = () => {
  return {
    title: "Customers database",
  };
};

export default function Index() {
  const { customers } = useLoaderData<LoaderData>();

  return (
    <Stack>
      <Title>Customers</Title>
      <Group>
        <Anchor component={Link} to="customer/add">
          Add new customer
        </Anchor>
      </Group>
      {!!customers.length && (
        <List>
          {customers.map((customer) => (
            <List.Item key={customer.id}>
              <Anchor component={Link} to={"customer/" + customer.id}>
                {customer.firstName + " " + customer.lastName}
              </Anchor>
            </List.Item>
          ))}
        </List>
      )}
      {!customers.length && <Text>No customers found :(</Text>}
    </Stack>
  );
}
