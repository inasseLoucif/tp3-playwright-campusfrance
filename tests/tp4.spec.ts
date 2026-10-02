// TP4 - Scénarios : uniquement des appels au Page Object + des assertions.
// Entrées : data/input/tp4/*.json   |   Sorties : output/resultats-tp4-*.csv / .json
import { expect, Page, test } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { chargerConfigTp4, chargerProfilTp4 } from '../utils/dataLoader';
import { Rapport } from '../utils/rapport';
import { normaliser } from '../utils/texte';

const config = chargerConfigTp4();

async function executerParcours(page: Page, nomProfil: string) {
  const profil = chargerProfilTp4(nomProfil);
  const s = profil.saisie;
  const attendus = config.attendus;
  const rapport = new Rapport(`TP4 - ${profil.nomScenario}`, `tp4-${nomProfil}`);
  const inscription = new RegisterPage(page);

  const verifier = (nom: string, attendu: unknown, obtenu: unknown, ok = attendu === obtenu) => {
    rapport.ajouter(nom, attendu, obtenu, ok);
    expect.soft(ok, `${nom} → attendu : ${attendu} | obtenu : ${obtenu}`).toBe(true);
  };

  try {
    await test.step('Ouvrir la page d\'inscription', async () => {
      await inscription.charger(config.url);
    });

    await test.step('Remplir l\'identité et choisir le profil', async () => {
      await inscription.remplirIdentite(s);
      await inscription.choisirProfil(s.profil);
    });

    await test.step('Vérifier le libellé "My email address"', async () => {
      const libelle = await inscription.texteLibelleEmail();
      const mot = attendus.motDansLibelleEmail;
      verifier(`Le libellé contient le mot "${mot}"`, `contient "${mot}"`, libelle,
        new RegExp(`\\b${mot}\\b`, 'i').test(libelle));
      verifier('Libellé complet du champ e-mail', attendus.libelleEmail, libelle,
        normaliser(libelle) === normaliser(attendus.libelleEmail));
    });

    await test.step('Vérifier le bouton "Add another item"', async () => {
      const texte = await inscription.texteBoutonAjout();
      verifier('Libellé du bouton', attendus.libelleBoutonAjout, texte,
        normaliser(texte) === normaliser(attendus.libelleBoutonAjout));
      verifier('Bouton visible et activé', true, await inscription.boutonAjoutUtilisable());
    });

    await test.step('Utiliser le bouton pour ajouter les nationalités', async () => {
      verifier('Nombre initial de champs nationalité', 1, await inscription.nombreChampsNationalite());
      await inscription.saisirNationalite(0, s.nationalites[0]);

      for (let i = 1; i < s.nationalites.length; i++) {
        const { avant, apres } = await inscription.ajouterNationalite();
        verifier(`Clic n°${i} : un champ ajouté`, avant + 1, apres);
        await inscription.saisirNationalite(i, s.nationalites[i]);
      }

      verifier('Nombre final de champs nationalité', profil.attendus.nombreChampsNationalite,
        await inscription.nombreChampsNationalite());

      const valeurs = await inscription.valeursNationalites();
      verifier('Valeurs saisies conservées', s.nationalites.join(' | '), valeurs.join(' | '));

      await inscription.capture(`tp4-${nomProfil}-nationalites`);
    });
    // Le formulaire n'est JAMAIS soumis : aucun vrai compte n'est créé
  } finally {
    rapport.ecrire();
  }
}

test.describe('TP4 - Inscription Campus France', () => {
  test('Parcours étudiant @tp4-etudiant', async ({ page }) => {
    await executerParcours(page, 'etudiant');
  });

  test('Parcours chercheur @tp4-chercheur', async ({ page }) => {
    await executerParcours(page, 'chercheur');
  });
});