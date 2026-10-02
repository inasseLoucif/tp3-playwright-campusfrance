// POM : Page Object de la page d'inscription.
// Les localisateurs sont déclarés UNE seule fois ici ; les tests n'en contiennent aucun.
import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Saisie } from '../utils/types';

const echapperRegex = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class RegisterPage extends BasePage {
  readonly formulaire: Locator;
  readonly bandeauCookies: Locator;
  readonly email: Locator;
  readonly motDePasse: Locator;
  readonly confirmationMotDePasse: Locator;
  readonly nom: Locator;
  readonly prenom: Locator;
  readonly paysResidence: Locator;
  readonly codePostal: Locator;
  readonly ville: Locator;
  readonly telephone: Locator;
  readonly boutonCreer: Locator;

  constructor(page: Page) {
    super(page);
    this.formulaire = page.locator('form#user-form');
    this.bandeauCookies = page.locator('#tarteaucitronAllDenied2');   // "Deny all cookies"

    // Ciblage par attribut "name" À L'INTÉRIEUR du formulaire :
    // le site réutilise les id "edit-name" et "edit-submit" dans le formulaire de connexion caché.
    const f = this.formulaire;
    this.email = f.locator('input[name="name"]');
    this.motDePasse = f.locator('input[name="pass[pass1]"]');
    this.confirmationMotDePasse = f.locator('input[name="pass[pass2]"]');
    this.nom = f.locator('input[name="field_nom[0][value]"]');
    this.prenom = f.locator('input[name="field_prenom[0][value]"]');
    this.paysResidence = f.locator('select[name="field_pays_concernes"]');
    this.codePostal = f.locator('input[name="field_code_postal[0][value]"]');
    this.ville = f.locator('input[name="field_ville[0][value]"]');
    this.telephone = f.locator('input[name="field_telephone[0][value]"]');
    this.boutonCreer = f.locator('input[type="submit"][name="op"]');
  }

  /** Libellé du formulaire dont le texte est exactement celui donné */
  libelle(texte: string): Locator {
    return this.formulaire.locator('label').filter({ hasText: new RegExp(`^\\s*${echapperRegex(texte)}\\s*\\*?\\s*$`) });
  }

  /** Champ associé à un libellé (gère les listes Selectize : "xxx-selectized" -> <select id="xxx">) */
  async champParLibelle(texte: string): Promise<Locator> {
    const cible = await this.libelle(texte).first().getAttribute('for');
    if (!cible) throw new Error(`Libellé "${texte}" introuvable ou sans attribut "for"`);
    return cible.endsWith('-selectized')
      ? this.formulaire.locator(`select#${cible.replace(/-selectized$/, '')}`)
      : this.formulaire.locator(`#${cible}`);
  }

  // ---------- Actions ----------
  async charger(chemin: string) {
    await this.ouvrir(chemin);
    await this.formulaire.waitFor();
    await this.cliquerSiPresent(this.bandeauCookies);
    await this.page.locator('#tarteaucitronAlertBig')
      .waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  async remplirInformationsConnexion(email: string, motDePasse: string) {
    await this.saisir(this.email, email);
    await this.saisir(this.motDePasse, motDePasse);
    await this.saisir(this.confirmationMotDePasse, motDePasse);
  }

  async remplirInformationsPersonnelles(s: Saisie) {
    await this.cocherRadio(await this.champParLibelle(s.civilite));
    await this.saisir(this.nom, s.nom);
    await this.saisir(this.prenom, s.prenom);
    await this.choisirDansListe(this.paysResidence, s.paysResidence);
    await this.saisir(this.codePostal, s.codePostal);
    await this.saisir(this.ville, s.ville);
    await this.saisir(this.telephone, s.telephone);
  }

  async choisirProfil(profil: string) {
    await this.cocherRadio(await this.champParLibelle(profil));
  }

  async remplirInformationsComplementaires(listes: Record<string, string>, textes: Record<string, string>) {
    for (const [libelle, valeur] of Object.entries(listes)) {
      await this.estVisible(this.libelle(libelle));          // attend l'affichage conditionnel
      await this.choisirDansListe(await this.champParLibelle(libelle), valeur);
    }
    for (const [libelle, valeur] of Object.entries(textes)) {
      await this.estVisible(this.libelle(libelle));
      await this.saisir(await this.champParLibelle(libelle), valeur);
    }
  }

  // ---------- Lectures pour les vérifications ----------
  async sectionVisible(titre: string): Promise<boolean> {
    return this.estVisible(this.page.getByText(titre, { exact: true }));
  }

  async champVisible(libelle: string): Promise<boolean> {
    return this.estVisible(this.libelle(libelle));
  }

  async libelleBouton(): Promise<string> {
    return (await this.boutonCreer.inputValue()).trim();    // <input type="submit"> : texte dans "value"
  }

  async caseEstCochee(libelle: string): Promise<boolean> {
    return this.formulaire.getByLabel(libelle, { exact: false }).isChecked();
  }
}
