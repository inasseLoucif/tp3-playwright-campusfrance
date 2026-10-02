import { test, expect } from '@playwright/test';

test('record - parcours chercheur', async ({ page }) => {
  await page.goto('https://www.campusfrance.org/en/user/register');

  // Bandeau cookies : on refuse et on attend qu'il disparaisse
  await page.locator('#tarteaucitronAllDenied2').click();
  await expect(page.locator('#tarteaucitronAlertBig')).toBeHidden();

  await page.getByRole('textbox', { name: 'monadresse@domaine.com' }).fill('chercheur.test@example.com');
  await page.getByRole('textbox', { name: 'My password*' }).fill('Test@Chercheur2026!');
  await page.getByRole('textbox', { name: 'Confirm password*' }).fill('Test@Chercheur2026!');

  // Radio recouvert par son libellé et l'en-tête fixe : clic envoyé directement à l'élément
  await page.locator('#edit-field-civilite-mme').dispatchEvent('click');
  await expect(page.locator('#edit-field-civilite-mme')).toBeChecked();

  await page.getByRole('textbox', { name: 'Nom*', exact: true }).fill('Martin');
  await page.getByRole('textbox', { name: 'Prénom*' }).fill('Claire');
  await page.getByRole('textbox', { name: 'Code postal' }).fill('75005');
  await page.getByRole('textbox', { name: 'Ville' }).fill('Paris');
  await page.getByRole('textbox', { name: 'Téléphone' }).fill('0600000000');

  await page.locator('#edit-field-publics-cibles-3').dispatchEvent('click');   // Researcher
  await expect(page.locator('#edit-field-publics-cibles-3')).toBeChecked();

  // Vérifications du TP
  await expect(page.getByText('Informations complémentaires', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Domaine d\'études' })).toBeVisible();
  await expect(page.getByRole('button', { name: /create an account/i })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'J’accepte que mes données' })).not.toBeChecked();
});