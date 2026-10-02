// POM : méthodes génériques réutilisées par toutes les pages (les actions répétitives)
import { expect, Locator, Page } from '@playwright/test';
import path from 'path';
import { OUTPUT_DIR } from '../utils/dataLoader';

export class BasePage {
  constructor(protected readonly page: Page) {}

  /** Ouvre un chemin relatif ; l'URL de base vient de l'environnement (.env) */
  async ouvrir(chemin: string) {
    await this.page.goto(chemin, { waitUntil: 'domcontentloaded' });
  }

  async cliquerSiPresent(element: Locator, timeout = 4000) {
    try {
      await element.first().click({ timeout });
    } catch {
      /* élément absent : rien à faire */
    }
  }

  async saisir(champ: Locator, valeur: string) {
    await champ.fill(valeur);
  }

  async cocherRadio(radio: Locator) {
    try {
      await radio.check({ timeout: 3000 });
    } catch {
      // Radio recouvert (libellé stylé, en-tête fixe, bandeau) : clic envoyé directement
      await radio.dispatchEvent('click');
    }
    await expect(radio).toBeChecked();
  }

  /**
   * Choisit une option par son texte visible.
   * Gère les listes "Selectize" (le <select> d'origine est masqué) et les <select> classiques.
   */
  async choisirDansListe(liste: Locator, valeur: string) {
    const choisie = await liste.evaluate((el, cible) => {
      const norm = (t: unknown) => String(t ?? '')
        .replace(/\u2019/g, "'").replace(/\s+/g, ' ').trim()
        .replace(/^-+/, '').trim().toLowerCase();         // options Drupal préfixées par "-"
      const selectize = (el as any).selectize;
      const options: { v: string; t: string }[] = selectize
        ? Object.values(selectize.options).map((o: any) => ({
            v: String(o[selectize.settings.valueField]), t: String(o[selectize.settings.labelField]) }))
        : Array.from((el as HTMLSelectElement).options).map(o => ({ v: o.value, t: o.text }));
      const option = options.find(o => norm(o.t) === norm(cible));
      if (!option) return null;
      if (selectize) {
        selectize.setValue(option.v);                      // déclenche aussi l'événement "change"
      } else {
        (el as HTMLSelectElement).value = option.v;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return option.v;
    }, valeur);
    if (choisie === null) throw new Error(`Option "${valeur}" introuvable dans la liste`);
  }

  async estVisible(element: Locator, timeout = 5000): Promise<boolean> {
    return element.first().waitFor({ state: 'visible', timeout }).then(() => true).catch(() => false);
  }

  async capture(nom: string) {
    await this.page.screenshot({ path: path.join(OUTPUT_DIR, 'screenshots', `${nom}.png`), fullPage: true });
  }
}
