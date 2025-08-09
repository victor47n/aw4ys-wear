"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/_lib/auth";
import { db } from "@/db";
import { cartTable } from "@/db/schema";

import {
  UpdateCartShippingAddressSchema,
  updateCartShippingAddressSchema,
} from "./schema";

export const updateCartShippingAddress = async (
  data: UpdateCartShippingAddressSchema,
) => {
  updateCartShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: (shippingAddress, { eq, and }) =>
      and(
        eq(shippingAddress.id, data.shippingAddressId),
        eq(shippingAddress.userId, session.user.id),
      ),
  });

  if (!shippingAddress) {
    throw new Error("Shipping address not found or unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const [updatedCart] = await db
    .update(cartTable)
    .set({
      shippingAddressId: data.shippingAddressId,
    })
    .where(eq(cartTable.id, cart.id))
    .returning();

  return updatedCart;
};
