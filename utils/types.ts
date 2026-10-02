export interface Config {
  url: string;
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

// ===== Commun =====
export interface Identite {
  email: string;
  motDePasse: string;
  civilite: string;
  nom: string;
  prenom: string;
}

// ===== TP4 =====
export interface ConfigTp4 {
  url: string;
  attendus: {
    libelleEmail: string;
    motDansLibelleEmail: string;
    libelleBoutonAjout: string;
  };
}

export interface SaisieTp4 extends Identite {
  profil: string;
  nationalites: string[];
}

export interface ProfilTp4 {
  nomScenario: string;
  saisie: SaisieTp4;
  attendus: { nombreChampsNationalite: number };
}