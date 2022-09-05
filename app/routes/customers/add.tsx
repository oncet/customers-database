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

export const meta: MetaFunction = () => {
  return {
    title: "Add new customer",
  };
};

export const action: ActionFunction = async ({ request }) => {
  // const formData = await request.formData();

  // const firstName = formData.get("firstName") as string;
  // const lastName = formData.get("lastName") as string;

  // await db.customer.create({
  //   data: {
  //     firstName,
  //     lastName,
  //   },
  // });

  // return redirect("/customers/" + params.id);

  return null;
};

export default function AddCustomer() {
  return (
    <Stack>
      <Breadcrumbs>
        {[
          "Customers",
          <Anchor key="customerAdd" component={Link} to="/customers/add">
            Add new
          </Anchor>,
        ]}
      </Breadcrumbs>
      <Title>Add new customer</Title>
      <Form method="put">
        <Stack>
          <TextInput label="First name" name="firstName" />
          <TextInput label="Last name" name="lastName" />
          <Button type="submit">Add new customer</Button>
        </Stack>
      </Form>
    </Stack>
  );
}
