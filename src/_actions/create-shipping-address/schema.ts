import { z } from "zod";

export const createShippingAddressSchema = z.object({
  email: z.email("E-mail inválido"),
  recipientName: z.string().min(1, "Nome completo é obrigatório"),
  cpfOrCnpj: z.string().min(11, "CPF é obrigatório").max(14, "CPF inválido"),
  phone: z
    .string()
    .min(10, "Celular é obrigatório")
    .max(11, "Celular inválido"),
  zipCode: z.string().min(8, "CEP é obrigatório").max(8, "CEP inválido"),
  street: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório"),
});

export type CreateShippingAddressSchema = z.infer<
  typeof createShippingAddressSchema
>;
