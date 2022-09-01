import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Prisma } from "@prisma/client";

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
    title: data ? data.name : "Customer not found",
  };
};

export default function Job() {
  const { name, jobs } = useLoaderData<CustomerWithJobs>();

  return (
    <>
      <h1>{name}</h1>
      {jobs && (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <Link to={"/job/" + job.id}>{job.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
