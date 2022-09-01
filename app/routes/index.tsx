import type { Customer } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = { customers: Array<Customer> };

export const loader: LoaderFunction = async () => {
  const data = {
    customers: await db.customer.findMany(),
  };

  return json(data);
};

export default function Index() {
  const { customers } = useLoaderData<LoaderData>();

  return (
    customers && (
      <ul>
        {customers.map((customer) => (
          <li>
            <Link to={"customer/" + customer.id}>{customer.name}</Link>
          </li>
        ))}
      </ul>
    )
  );
}
