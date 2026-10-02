export interface Config {
  chemin: string;
  attendus: {
    titreSection: string;
    libelleBouton: string;
    libelleCaseRgpd: string;
    caseRgpdCochee: boolean;
  };
}

export interface Saisie {
  email: string;
  motDePasse: string;
  civilite: string;
  nom: string;
  prenom: string;
  paysResidence: string;
  codePostal: string;
  ville: string;
  telephone: string;
  profil: string;
  listesComplementaires: Record<string, string>;
  textesComplementaires: Record<string, string>;
}

export interface Profil {
  nomScenario: string;
  saisie: Saisie;
  attendus: { champsVisibles: string[] };
}
