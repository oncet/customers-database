import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import type { Prisma } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
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
    title: data ? data.name + " - Edit customer" : "Customer not found",
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const name = formData.get("name");

  // await createPost({ title, slug, markdown });

  return redirect("/customer/" + params.id);
};

export default function EditCustomer() {
  const { name, jobs } = useLoaderData<CustomerWithJobs>();

  return (
    <Stack>
      <Breadcrumbs>{["Customer", name, "Edit"]}</Breadcrumbs>
      <Title>Edit customer</Title>
      <Form method="put">
        <label>
          Name <input name="name" />
        </label>
        <button type="submit">Update customer</button>
      </Form>
    </Stack>
  );
}
