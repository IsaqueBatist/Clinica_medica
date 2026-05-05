// src/utils/delay.ts

/**
 * Encapsula setTimeout em uma Promise para simular latência de I/O de rede.
 * @param min Tempo mínimo em milissegundos
 * @param max Tempo máximo em milissegundos
 */

export const delay = (min: number = 200, max: number = 500): Promise<void> => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};
