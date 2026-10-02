// Lecture des fichiers de données externes (ENTRÉES)
import fs from 'fs';
import path from 'path';
import { Config, ConfigTp4, Profil, ProfilTp4 } from './types';

export const INPUT_DIR = path.resolve(process.cwd(), 'data', 'input');
export const OUTPUT_DIR = path.resolve(process.cwd(), 'output');

function chargerJson<T>(nomFichier: string): T {
  return JSON.parse(fs.readFileSync(path.join(INPUT_DIR, nomFichier), 'utf-8')) as T;
}

export const chargerConfig = () => chargerJson<Config>('config.json');
export const chargerProfil = (nom: string) => chargerJson<Profil>(`${nom}.json`);

// TP4 : data/input/tp4/*.json
export const chargerConfigTp4 = () => chargerJson<ConfigTp4>('tp4/config.json');
export const chargerProfilTp4 = (nom: string) => chargerJson<ProfilTp4>(`tp4/${nom}.json`);