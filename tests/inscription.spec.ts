// Scénarios : uniquement des appels au Page Object + des assertions.
// Entrées : .env (environnement) + data/input/*.json   |   Sorties : output/
import { expect, Page, test } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { chargerConfig, chargerProfil } from '../utils/dataLoader';
import { BASE_URL, ENV } from '../utils/environnement';
import { Rapport } from '../utils/rapport';
import { normaliser } from '../utils/texte';

const config = chargerConfig();

async function executerParcours(page: Page, nomProfil: string) {
  const profil = chargerProfil(nomProfil);
  const s = profil.saisie;
  const attendus = config.attendus;
  const rapport = new Rapport(profil.nomScenario, nomProfil, ENV);
  const inscription = new RegisterPage(page);

  const verifier = (nom: string, attendu: unknown, obtenu: unknown, ok = attendu === obtenu) => {
    rapport.ajouter(nom, attendu, obtenu, ok);
    expect.soft(ok, `${nom} → attendu : ${attendu} | obtenu : ${obtenu}`).toBe(true);
  };

  try {
    await test.step(`Ouvrir la page d'inscription (${BASE_URL}${config.chemin})`, async () => {
      await inscription.charger(config.chemin);
    });
    await test.step('Remplir les informations de connexion', async () => {
      await inscription.remplirInformationsConnexion(s.email, s.motDePasse);
    });
    await test.step('Remplir les informations personnelles', async () => {
      await inscription.remplirInformationsPersonnelles(s);
    });
    await test.step(`Choisir le profil "${s.profil}" et compléter`, async () => {
      await inscription.choisirProfil(s.profil);
      await inscription.remplirInformationsComplementaires(s.listesComplementaires, s.textesComplementaires);
      await inscription.capture(`${ENV}-${nomProfil}-formulaire-rempli`);
    });
    // Le formulaire n'est JAMAIS soumis : aucun vrai compte n'est créé
    await test.step('Vérifications', async () => {
      verifier(`Section "${attendus.titreSection}" affichée`, true,
        await inscription.sectionVisible(attendus.titreSection));
      for (const champ of profil.attendus.champsVisibles) {
        verifier(`Champ "${champ}" visible (${s.profil})`, true, await inscription.champVisible(champ));
      }
      const libelle = await inscription.libelleBouton();
      verifier('Libellé du bouton', attendus.libelleBouton, libelle,
        normaliser(libelle) === normaliser(attendus.libelleBouton));
      verifier('Case "J’accepte que mes données…" cochée', attendus.caseRgpdCochee,
        await inscription.caseEstCochee(attendus.libelleCaseRgpd));
    });
  } finally {
    rapport.ecrire();
  }
}

test.describe(`Inscription Campus France [${ENV.toUpperCase()}]`, () => {

  test.describe('Parcours étudiant', () => {
    test('Vérifications du formulaire @etudiant', async ({ page }) => {
      await executerParcours(page, 'etudiant');
    });
  });

  test.describe('Parcours chercheur', () => {
    test('Vérifications du formulaire @chercheur', async ({ page }) => {
      await executerParcours(page, 'chercheur');
    });
  });

});
