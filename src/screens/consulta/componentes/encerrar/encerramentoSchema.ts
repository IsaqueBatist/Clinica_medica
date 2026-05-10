import { z } from "zod";
import { PROCEDIMENTOS } from "../../../../constants/procedimentos";
import { FORMA_PAGAMENTO, TIPO_CONSULTA } from "../../../../constants/consulta";

export const encerramentoSchema = z
  .object({
    tipo: z.nativeEnum(TIPO_CONSULTA),
    procedimentos: z
      .array(z.enum(PROCEDIMENTOS))
      .min(1, "Selecione ao menos um procedimento"),
    formaPagamento: z.nativeEnum(FORMA_PAGAMENTO),
    valor: z.coerce.number().min(0, "O valor não pode ser negativo"),
  })
  .refine(
    (data) => {
      // Comparação estrita com a constante, erradicando magic strings.
      if (data.tipo === TIPO_CONSULTA.RETORNO && data.valor > 0) {
        return false;
      }
      return true;
    },
    {
      message: "Consultas de retorno não podem ter valor cobrado.",
      path: ["valor"],
    },
  );

export type EncerramentoFormData = z.infer<typeof encerramentoSchema>;
