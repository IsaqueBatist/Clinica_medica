import { Consulta } from "../types/models/consulta.type";

type TransacaoConsulta = {
  get(id: string): Promise<Consulta>;
  update(id: string, patch: Partial<Consulta>): void;
};

export class ConflitoDTransacaoError extends Error {
  constructor(id: string) {
    super(
      `Conflito de transação: A consulta '${id}' foi modificada por outra operação. Tente novamente.`,
    );
    this.name = "ConflitoDTransacaoError";
  }
}

export async function runTransaction(
  mock: Consulta[],
  callback: (t: TransacaoConsulta) => Promise<void>,
): Promise<void> {
  const escritasPendentes: Array<{ id: string; patch: Partial<Consulta> }> = [];
  const versoes = new Map<string, string>(); // id → situacao no momento da leitura

  const t: TransacaoConsulta = {
    async get(id) {
      const consulta = mock.find((c) => c.numero === id);
      if (!consulta) throw new Error(`Consulta '${id}' inexistente.`);
      versoes.set(id, consulta.situacao);
      return { ...consulta };
    },
    update(id, patch) {
      escritasPendentes.push({ id, patch });
    },
  };

  await callback(t);

  // Fase de commit: detectar modificações concorrentes por comparação de versão
  for (const { id } of escritasPendentes) {
    const atual = mock.find((c) => c.numero === id);
    if (atual && atual.situacao !== versoes.get(id)) {
      throw new ConflitoDTransacaoError(id);
    }
  }

  for (const { id, patch } of escritasPendentes) {
    const idx = mock.findIndex((c) => c.numero === id);
    if (idx !== -1) mock[idx] = { ...mock[idx], ...patch };
  }
}
