// Lit le fichier .env : ENV choisit l'environnement, URL_<ENV> donne son adresse.
// Sur GitHub Actions, les mêmes variables viennent du workflow.
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

const ENVIRONNEMENTS = ['qa', 'pp', 'prod'] as const;
export type NomEnvironnement = (typeof ENVIRONNEMENTS)[number];

const env = (process.env.ENV ?? 'prod').trim().toLowerCase();
if (!ENVIRONNEMENTS.includes(env as NomEnvironnement)) {
  throw new Error(`ENV invalide : "${process.env.ENV}" (valeurs possibles : qa, pp, prod)`);
}
export const ENV = env as NomEnvironnement;

const variable = `URL_${ENV.toUpperCase()}`;
export const BASE_URL = process.env[variable] ?? '';
if (!BASE_URL) {
  throw new Error(`La variable ${variable} est absente du fichier .env`);
}