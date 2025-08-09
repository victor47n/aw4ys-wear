"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { auth } from "@/lib/auth";

export const getUserAddresses = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const addresses = await db.query.shippingAddressTable.findMany({
      where: (address, { eq }) => eq(address.userId, session.user.id),
      orderBy: (address, { desc }) => desc(address.createdAt),
    });

    return addresses;
  } catch (error) {
    console.error("Erro ao buscar endereços:", error);
    throw new Error("Erro ao buscar endereços");
  }
};
