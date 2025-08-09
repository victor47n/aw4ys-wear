import { useQuery } from "@tanstack/react-query";

import { getCart } from "@/_actions/get-cart";

export const getUseCartQueryKey = () => ["cart"] as const;

export const useCart = (params?: {
  initialData?: Awaited<ReturnType<typeof getCart>>;
}) => {
  return useQuery({
    queryKey: getUseCartQueryKey(),
    queryFn: () => getCart(),
    initialData: params?.initialData,
  });
};
