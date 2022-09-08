import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { Prisma } from "@prisma/client";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Anchor,
  Text,
  Title,
  List,
  Stack,
  Breadcrumbs,
  Group,
} from "@mantine/core";

import { db } from "~/utils/db.server";

type CustomerWithJobs = Prisma.CustomerGetPayload<{
  include: {
    jobs: true;
  };
}>;

export const loader: LoaderFunction = async ({ params }) => {
  const customer = await db.customer.findFirst({
    where: {
      id: Number(params.id),
    },
    include: {
      jobs: true,
    },
  });

  if (!customer) {
    throw new Response("Customer not found", {
      status: 404,
    });
  }

  return json(customer);
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data
      ? data.firstName + " " + data.lastName + " - Customer"
      : "Customer not found",
  };
};

export default function Customer() {
  const { id, firstName, lastName, jobs } = useLoaderData<CustomerWithJobs>();

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
          <Anchor key="viewCustomer" component={Link} to={"/customers/" + id}>
            {firstName + " " + lastName}
          </Anchor>,
        ]}
      </Breadcrumbs>
      <Title>{firstName + " " + lastName}</Title>
      <Group>
        <Anchor component={Link} to="edit">
          Edit customer
        </Anchor>
      </Group>
      <Title order={2}>Jobs</Title>
      {!!jobs.length && (
        <List>
          {jobs.map((job) => (
            <List.Item key={job.id}>
              <Anchor component={Link} to={"jobs/" + job.id}>
                {job.name}
              </Anchor>
            </List.Item>
          ))}
        </List>
      )}
      {!jobs.length && <Text>This customer has no jobs.</Text>}
    </Stack>
  );
}
