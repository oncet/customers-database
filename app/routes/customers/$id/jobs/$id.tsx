import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Anchor, Stack, Title, Text, Breadcrumbs, List } from "@mantine/core";
import type { Prisma } from "@prisma/client";

import { db } from "~/utils/db.server";

type JobWithCustomer = Prisma.JobGetPayload<{
  include: {
    Customer: true;
  };
}>;

export const loader: LoaderFunction = async ({ params }) => {
  const job = await db.job.findFirst({
    where: {
      id: Number(params.id),
    },
    include: {
      Customer: true,
    },
  });

  if (!job) {
    throw new Response("Job not found", {
      status: 404,
    });
  }

  return json(job);
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data ? data.name + " - Job" : "Job not found",
  };
};

export default function Job() {
  const { id, name, Customer } = useLoaderData<JobWithCustomer>();

  return (
    <Stack>
      <Breadcrumbs>
        {[
          <Anchor key="viewCustomers" component={Link} to="/">
            Customers
          </Anchor>,
          <Anchor
            key="viewCustomer"
            component={Link}
            to={"/customers/" + Customer.id}
          >
            {Customer.firstName + " " + Customer.lastName}
          </Anchor>,
          "Jobs",
          <Anchor
            key="viewJob"
            component={Link}
            to={"/customers/" + Customer.id + "/jobs/" + id}
          >
            {name}
          </Anchor>,
        ]}
      </Breadcrumbs>
      <Title>{name}</Title>
      <Title order={2}>Customer</Title>
      <Text>
        <Anchor component={Link} to={"/customers/" + Customer.id}>
          {Customer.firstName + " " + Customer.lastName}
        </Anchor>
      </Text>
    </Stack>
  );
}
