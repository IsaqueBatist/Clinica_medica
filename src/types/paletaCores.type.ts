export interface PaletaCores {
  fundo: {
    primario: string;
    secundario: string;
    superficie: string;
    suave: string;
  };
  texto: {
    primario: string;
    secundario: string;
    suave: string;
    inverso: string;
    sobreMarca: string;
  };
  borda: {
    padrao: string;
    forte: string;
    foco: string;
  };
  status: {
    sucesso: string;
    erro: string;
    aviso: string;
    info: string;
    neutro: string;
  };
  marca: {
    primario: string;
    secundario: string;
  };
}
