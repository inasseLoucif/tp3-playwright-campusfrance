// Lecture des fichiers de données externes (ENTRÉES)
import fs from 'fs';
import path from 'path';
import { Config, Profil } from './types';

export const INPUT_DIR = path.resolve(process.cwd(), 'data', 'input');
export const OUTPUT_DIR = path.resolve(process.cwd(), 'output');

function chargerJson<T>(nomFichier: string): T {
  return JSON.parse(fs.readFileSync(path.join(INPUT_DIR, nomFichier), 'utf-8')) as T;
}

export const chargerConfig = () => chargerJson<Config>('config.json');
export const chargerProfil = (nom: string) => chargerJson<Profil>(`${nom}.json`);
