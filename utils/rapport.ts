// Écriture des résultats dans des fichiers externes (SORTIES)
import fs from 'fs';
import path from 'path';
import { OUTPUT_DIR } from './dataLoader';

interface Ligne {
  horodatage: string;
  environnement: string;
  scenario: string;
  verification: string;
  attendu: string;
  obtenu: string;
  statut: 'OK' | 'KO';
}

const ENTETES: (keyof Ligne)[] = ['horodatage', 'environnement', 'scenario', 'verification', 'attendu', 'obtenu', 'statut'];

export class Rapport {
  private lignes: Ligne[] = [];

  constructor(
    private readonly scenario: string,
    private readonly nomFichier: string,
    private readonly environnement: string,
  ) {}

  ajouter(verification: string, attendu: unknown, obtenu: unknown, ok: boolean) {
    this.lignes.push({
      horodatage: new Date().toISOString(),
      environnement: this.environnement.toUpperCase(),
      scenario: this.scenario,
      verification,
      attendu: String(attendu),
      obtenu: String(obtenu),
      statut: ok ? 'OK' : 'KO',
    });
  }

  ecrire() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    // ex. output/resultats-qa-etudiant.csv
    const base = path.join(OUTPUT_DIR, `resultats-${this.environnement}-${this.nomFichier}`);

    fs.writeFileSync(`${base}.json`, JSON.stringify(this.lignes, null, 2), 'utf-8');

    // CSV (séparateur ; + BOM pour Excel)
    const echapper = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [ENTETES.join(';'), ...this.lignes.map(l => ENTETES.map(k => echapper(l[k])).join(';'))];
    fs.writeFileSync(`${base}.csv`, '\uFEFF' + csv.join('\n'), 'utf-8');

    // Résumé affiché dans la page du run GitHub Actions
    if (process.env.GITHUB_STEP_SUMMARY) {
      const md = [`### ${this.scenario} (${this.environnement.toUpperCase()})`, '',
        '| Vérification | Attendu | Obtenu | Statut |', '|---|---|---|---|',
        ...this.lignes.map(l => `| ${l.verification} | ${l.attendu} | ${l.obtenu} | ${l.statut === 'OK' ? '✅' : '❌'} |`),
        ''];
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md.join('\n') + '\n');
    }
  }
}
