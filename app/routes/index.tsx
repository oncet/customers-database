import type { Customer } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
    <>
      <h1>Hello world!</h1>
      {customers && (
        <ul>
          {customers.map((customer) => (
            <li>{customer.name}</li>
          ))}
        </ul>
      )}
    </>
  );
}
