import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { addProductToCart } from "@/_actions/add-cart-product";
import { decreaseCartProductQuantity } from "@/_actions/decrease-cart-product-quantity";
import { removeProductFromCart } from "@/_actions/remove-cart-product";
import { formatCentsToBRL } from "@/_helpers/money";

import { Button } from "../ui/button";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

export const CartItem = ({
  id,
  productName,
  productVariantId,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity,
}: CartItemProps) => {
  const queryClient = useQueryClient();
  const removeProductFromCartMutation = useMutation({
    mutationKey: ["remove-cart-product"],
    mutationFn: () => removeProductFromCart({ cartItemId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const decreaseCartProductQuantityMutation = useMutation({
    mutationKey: ["remove-cart-product"],
    mutationFn: () => decreaseCartProductQuantity({ cartItemId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const increaseCartProductQuantityMutation = useMutation({
    mutationKey: ["increase-cart-product-quantity"],
    mutationFn: () =>
      addProductToCart({ productVariantId: productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleRemoveProduct = () => {
    removeProductFromCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Produto removido do carrinho!");
      },
      onError: (error) => {
        toast.error("Erro ao remover produto do carrinho.");
      },
    });
  };

  const handleDecreaseQuantityClick = () => {
    decreaseCartProductQuantityMutation.mutate(undefined, {
      onError: (error) => {
        toast.error("Erro ao diminuir a quantidade do produto no carrinho.");
      },
    });
  };

  const handleIncreaseQuantityClick = () => {
    increaseCartProductQuantityMutation.mutate(undefined, {
      onError: (error) => {
        toast.error("Erro ao aumentar a quantidade do produto no carrinho.");
      },
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={78}
          height={78}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
          <div className="flex w-[100px] items-center justify-between rounded-lg border p-1">
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={handleDecreaseQuantityClick}
            >
              <MinusIcon />
            </Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={handleIncreaseQuantityClick}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <Button variant="outline" size="icon" onClick={handleRemoveProduct}>
          <TrashIcon />
        </Button>
        <p className="text-xs font-medium">
          {formatCentsToBRL(productVariantPriceInCents)}
        </p>
      </div>
    </div>
  );
};
