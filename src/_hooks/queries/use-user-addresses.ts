import { useQuery } from "@tanstack/react-query";

import { getUserAddresses } from "@/_actions/get-user-addresses";

export const getUserAddressesQueryKey = () => ["user-addresses"] as const;

export const useUserAddresses = (params?: {
  initialData?: Awaited<ReturnType<typeof getUserAddresses>>;
}) => {
  return useQuery({
    queryKey: getUserAddressesQueryKey(),
    queryFn: getUserAddresses,
    initialData: params?.initialData,
  });
};
