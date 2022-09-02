import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Prisma } from "@prisma/client";
import { Title, List, Stack, Breadcrumbs } from "@mantine/core";

import { db } from "~/utils/db.server";
import { Anchor } from "@mantine/core";

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
    title: data ? data.name + " - Customer" : "Customer not found",
  };
};

export default function Job() {
  const { name, jobs } = useLoaderData<CustomerWithJobs>();

  return (
    <Stack>
      <Breadcrumbs>Customer</Breadcrumbs>
      <Title>{name}</Title>
      {jobs && (
        <>
          <Title order={2}>Jobs</Title>
          <List>
            {jobs.map((job) => (
              <List.Item key={job.id}>
                <Anchor component={Link} to={"/job/" + job.id}>
                  {job.name}
                </Anchor>
              </List.Item>
            ))}
          </List>
        </>
      )}
    </Stack>
  );
}
