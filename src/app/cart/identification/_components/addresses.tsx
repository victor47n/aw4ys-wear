"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/_components/ui/radio-group";
import { useCreateShippingAddress } from "@/_hooks/mutations/use-create-shipping-address";
import { useUpdateCartShippingAddress } from "@/_hooks/mutations/use-update-cart-shipping-address";
import { useUserAddresses } from "@/_hooks/queries/use-user-addresses";
import type { shippingAddressTable } from "@/db/schema";

const addressFormSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  recipientName: z.string().min(1, "Nome completo é obrigatório"),
  cpfOrCnpj: z.string().min(14, "CPF é obrigatório"),
  phone: z.string().min(15, "Celular é obrigatório"),
  zipCode: z.string().min(9, "CEP é obrigatório"),
  street: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório"),
});

type AddressFormSchema = z.infer<typeof addressFormSchema>;

interface AddressesProps {
  shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
  defaultShippingAddressId: string | null;
}

export const Addresses = ({
  shippingAddresses,
  defaultShippingAddressId,
}: AddressesProps) => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    defaultShippingAddressId || null,
  );
  const createShippingAddressMutation = useCreateShippingAddress();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
  const { data: addresses, isLoading } = useUserAddresses({
    initialData: shippingAddresses,
  });

  const form = useForm<AddressFormSchema>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      email: "",
      recipientName: "",
      cpfOrCnpj: "",
      phone: "",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const removeMasks = (values: AddressFormSchema) => {
    return {
      ...values,
      cpfOrCnpj: values.cpfOrCnpj.replace(/[^\d]/g, ""),
      phone: values.phone.replace(/[^\d]/g, ""),
      zipCode: values.zipCode.replace(/[^\d]/g, ""),
    };
  };

  const formatAddress = (address: NonNullable<typeof addresses>[0]) => {
    const formatCpf = (cpf: string) => {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    const formatPhone = (phone: string) => {
      if (phone.length === 11) {
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      }
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    };

    const formatZipCode = (zipCode: string) => {
      return zipCode.replace(/(\d{5})(\d{3})/, "$1-$2");
    };

    return {
      ...address,
      cpfOrCnpj: formatCpf(address.cpfOrCnpj),
      phone: formatPhone(address.phone),
      zipCode: formatZipCode(address.zipCode),
    };
  };

  const onSubmit = async (values: AddressFormSchema) => {
    try {
      const cleanedValues = removeMasks(values);
      const newAddress =
        await createShippingAddressMutation.mutateAsync(cleanedValues);
      toast.success("Endereço criado com sucesso!");
      form.reset();
      setSelectedAddress(newAddress.id);

      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: newAddress.id,
      });
    } catch (error) {
      toast.error("Erro ao criar endereço. Tente novamente.");
      console.error("Error creating address:", error);
    }
  };

  const handleContinueWithPayment = async () => {
    if (!selectedAddress || selectedAddress === "add_new") {
      toast.error("Selecione um endereço para continuar");
      return;
    }

    try {
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: selectedAddress,
      });
      toast.success("Endereço atualizado no carrinho!");
      router.push("/cart/confirmation");
    } catch (error) {
      toast.error("Erro ao atualizar endereço do carrinho.");
      console.error("Error updating cart address:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center">Carregando endereços...</div>
        ) : (
          <RadioGroup
            value={selectedAddress}
            onValueChange={setSelectedAddress}
          >
            {addresses?.map((address) => {
              const formattedAddress = formatAddress(address);
              const addressSummary = `${formattedAddress.street}, ${formattedAddress.number}${formattedAddress.complement ? `, ${formattedAddress.complement}` : ""}, ${formattedAddress.neighborhood}...`;

              return (
                <Card key={address.id}>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={address.id} />
                      <div className="flex-1">
                        <div className="text-sm">{addressSummary}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Card>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="add_new" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Adicionar novo</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        )}

        {selectedAddress === "add_new" && (
          <div className="mt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cpfOrCnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PatternFormat
                            format="###.###.###-##"
                            customInput={Input}
                            placeholder="CPF"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PatternFormat
                            format="(##) #####-####"
                            customInput={Input}
                            placeholder="Celular"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PatternFormat
                          format="#####-###"
                          customInput={Input}
                          placeholder="CEP"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Endereço" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Número" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Complemento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Estado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-6 w-full"
                  disabled={createShippingAddressMutation.isPending}
                >
                  {createShippingAddressMutation.isPending
                    ? "Criando endereço..."
                    : "Criar endereço"}
                </Button>
              </form>
            </Form>
          </div>
        )}

        <div className="mt-6">
          <Button
            onClick={handleContinueWithPayment}
            className="w-full"
            disabled={
              !selectedAddress ||
              selectedAddress === "add_new" ||
              updateCartShippingAddressMutation.isPending
            }
          >
            {updateCartShippingAddressMutation.isPending
              ? "Atualizando carrinho..."
              : "Continuar com o pagamento"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
