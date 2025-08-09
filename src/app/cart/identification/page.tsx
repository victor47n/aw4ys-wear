import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Header } from "@/_components/common/header";
import { auth } from "@/_lib/auth";
import { db } from "@/db";

import { Addresses } from "./_components/addresses";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart?.items.length === 0) {
    redirect("/");
  }

  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: (address, { eq }) => eq(address.userId, session.user.id),
    orderBy: (address, { desc }) => desc(address.createdAt),
  });

  return (
    <>
      <Header />
      <div className="space-y-4 px-5">
        <Addresses
          shippingAddresses={shippingAddresses}
          defaultShippingAddressId={cart.shippingAddress?.id || null}
        />
      </div>
    </>
  );
};

export default IdentificationPage;
