import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import type { Prisma } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import {
  Anchor,
  Title,
  Stack,
  Breadcrumbs,
  TextInput,
  Button,
  Modal,
  Text,
  Notification,
} from "@mantine/core";
import { assert, nonempty, object, string, StructError } from "superstruct";

import { db } from "~/utils/db.server";
import { useState } from "react";
import { commitSession, getSession } from "~/sessions";

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
  const session = await getSession(request.headers.get("Cookie"));

  if (request.method === "DELETE") {
    await db.customer.delete({
      where: {
        id: Number(params.id),
      },
    });

    session.flash("customerDeleted", true);

    return redirect("/customers/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // TODO de-dupes duplicated values
  const inputData = Object.fromEntries(await request.formData());

  const Customer = object({
    firstName: nonempty(string()),
    lastName: nonempty(string()),
    email: nonempty(string()),
  });

  try {
    assert(inputData, Customer);

    await db.customer.update({
      where: {
        id: Number(params.id),
      },
      data: inputData,
    });

    session.flash("customerUpdated", true);

    return redirect("/customers/" + params.id, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    if (error instanceof StructError) {
      return json({ errorMessage: error.message, values: inputData });
    }
  }
};

export default function EditCustomer() {
  const { id, firstName, lastName, email, jobs } =
    useLoaderData<CustomerWithJobs>();

  const actionData = useActionData();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openDeleteDiaog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
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
            <Anchor
              key="editCustomer"
              component={Link}
              to={"/customers/" + id + "/edit"}
            >
              Edit
            </Anchor>,
          ]}
        </Breadcrumbs>
        <Title>Edit customer #{id}</Title>
        <Form method="put">
          <Stack>
            <TextInput
              label="First name"
              name="firstName"
              defaultValue={actionData?.values.firstName || firstName}
            />
            <TextInput
              label="Last name"
              name="lastName"
              defaultValue={actionData?.values.lastName || lastName}
            />
            <TextInput
              label="E-mail address"
              name="email"
              defaultValue={actionData?.values.email || email}
            />
            {actionData?.errorMessage && (
              <Notification color="red" disallowClose>
                {actionData.errorMessage}
              </Notification>
            )}
            <Button type="submit">Update customer</Button>
          </Stack>
        </Form>
        <Button color="red" onClick={openDeleteDiaog}>
          Delete customer
        </Button>
      </Stack>
      <Modal
        centered
        opened={isDeleteDialogOpen}
        withCloseButton={false}
        onClose={closeDeleteDialog}
      >
        <Stack>
          <Text>
            Are you sure you want to delete {firstName + " " + lastName}?
          </Text>
          <Text weight="bold">This action can't be undone. </Text>
          <Form method="delete">
            <Stack>
              <Button type="submit" color="red">
                Delete customer
              </Button>
              <Button onClick={closeDeleteDialog}>Cancel</Button>
            </Stack>
          </Form>
        </Stack>
      </Modal>
    </>
  );
}
