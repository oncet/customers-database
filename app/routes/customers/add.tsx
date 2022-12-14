import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import {
  Anchor,
  Title,
  Stack,
  Breadcrumbs,
  TextInput,
  Button,
  Notification,
} from "@mantine/core";
import { assert, nonempty, object, string, StructError } from "superstruct";

import { db } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return {
    title: "Add new customer",
  };
};

export const action: ActionFunction = async ({ request }) => {
  // TODO de-dupes duplicated values
  const inputData = Object.fromEntries(await request.formData());

  const Customer = object({
    firstName: nonempty(string()),
    lastName: nonempty(string()),
    email: nonempty(string()),
  });

  try {
    assert(inputData, Customer);

    const newCustomer = await db.customer.create({
      data: inputData,
    });

    return redirect("/customers/" + newCustomer.id);
  } catch (error) {
    if (error instanceof StructError) {
      return json({ errorMessage: error.message, values: inputData });
    }
  }
};

export default function AddCustomer() {
  const actionData = useActionData();

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
          <Anchor key="addCustomer" component={Link} to="/customers/add">
            Add new
          </Anchor>,
        ]}
      </Breadcrumbs>
      <Title>Add new customer</Title>
      <Form method="put">
        <Stack>
          <TextInput
            label="First name"
            name="firstName"
            defaultValue={actionData?.values.firstName}
          />
          <TextInput
            label="Last name"
            name="lastName"
            defaultValue={actionData?.values.lastName}
          />
          <TextInput
            label="E-mail address"
            name="email"
            defaultValue={actionData?.values.email}
          />
          {actionData?.errorMessage && (
            <Notification color="red" disallowClose>
              {actionData.errorMessage}
            </Notification>
          )}
          <Button type="submit">Add new customer</Button>
        </Stack>
      </Form>
    </Stack>
  );
}
