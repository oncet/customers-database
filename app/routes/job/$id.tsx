import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Prisma } from "@prisma/client";

import { db } from "~/utils/db.server";
import { Anchor, Title } from "@mantine/core";

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
    title: data ? data.name : "Job not found",
  };
};

export default function Job() {
  const { name, Customer } = useLoaderData<JobWithCustomer>();

  return (
    <>
      <Title>{name}</Title>
      <dl>
        <dt>Customer</dt>
        <dd>
          <Anchor component={Link} to={"/customer/" + Customer.id}>
            {Customer.name}
          </Anchor>
        </dd>
      </dl>
    </>
  );
}
