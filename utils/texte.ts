// Normalise un texte : apostrophe typographique, espaces, astérisque, casse
export function normaliser(texte: string | null | undefined): string {
  if (!texte) return '';
  return texte
    .replace(/\u2019/g, "'")
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\*+$/, '')
    .trim()
    .toLowerCase();
}
