import { Anchor, List, Text, Title } from "@mantine/core";
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
    <>
      <Title>Customers</Title>
      <List>
        {customers.map((customer) => (
          <List.Item>
            <Anchor component={Link} to={"customer/" + customer.id}>
              {customer.name}
            </Anchor>
          </List.Item>
        ))}
      </List>
    </>
  ) : (
    <Text>No customers found :(</Text>
  );
}
