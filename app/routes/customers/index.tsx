import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { Customer } from "@prisma/client";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Anchor,
  Breadcrumbs,
  Group,
  List,
  Stack,
  Text,
  Title,
} from "@mantine/core";

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
      <Breadcrumbs>
        {[
          <Anchor key="home" component={Link} to="/">
            Home
          </Anchor>,
          <Anchor key="viewCustomers" component={Link} to="/customers">
            Customers
          </Anchor>,
        ]}
      </Breadcrumbs>
      <Title>Customers</Title>
      <Group>
        <Anchor component={Link} to="add">
          Add new customer
        </Anchor>
      </Group>
      {!!customers.length && (
        <List>
          {customers.map((customer) => (
            <List.Item key={customer.id}>
              <Anchor component={Link} to={customer.id.toString()}>
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
