import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import type { Prisma } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import {
  Anchor,
  Title,
  Stack,
  Breadcrumbs,
  TextInput,
  Button,
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
      ? data.firstName + " " + data.lastName + " - Edit customer"
      : "Customer not found",
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  await db.customer.update({
    where: {
      id: Number(params.id),
    },
    data: {
      firstName,
      lastName,
    },
  });

  return redirect("/customer/" + params.id);
};

export default function EditCustomer() {
  const { id, firstName, lastName, jobs } = useLoaderData<CustomerWithJobs>();

  return (
    <Stack>
      <Breadcrumbs>
        {[
          "Customer",
          <Anchor key="customerName" component={Link} to={"/customer/" + id}>
            {firstName + " " + lastName}
          </Anchor>,
          "Edit",
        ]}
      </Breadcrumbs>
      <Title>Edit customer</Title>
      <Form method="put">
        <Stack>
          <TextInput
            label="First name"
            name="firstName"
            defaultValue={firstName}
          />
          <TextInput
            label="Last name"
            name="lastName"
            defaultValue={lastName}
          />
          <Button type="submit">Update customer</Button>
        </Stack>
      </Form>
    </Stack>
  );
}
