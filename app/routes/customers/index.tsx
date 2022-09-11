import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { Customer } from "@prisma/client";
import { useEffect } from "react";
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
import { showNotification } from "@mantine/notifications";

import { db } from "~/utils/db.server";
import { commitSession, getSession } from "~/sessions";

type LoaderData = {
  customers: Array<Customer>;
  customerDeleted: true | undefined;
};

export const loader: LoaderFunction = async ({ request }) => {
  const data = {
    customers: await db.customer.findMany(),
  };

  const session = await getSession(request.headers.get("Cookie"));

  const customerDeleted = session.get("customerDeleted");

  return json(
    { ...data, customerDeleted },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export const meta: MetaFunction = () => {
  return {
    title: "Customers database",
  };
};

export default function Index() {
  const { customers, customerDeleted } = useLoaderData<LoaderData>();

  useEffect(() => {
    if (!customerDeleted) return;

    showNotification({
      message: "Customer deleted!",
      color: "teal",
    });
  }, [customerDeleted]);

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
