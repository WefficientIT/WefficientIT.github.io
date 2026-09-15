const dataTitle = {
    "glpi":"Déploiement et configuration d'un Gestionnaire Libre de Parc Informatique   "
};
// ajout d'un champ "description" pour les devis
const data = new Map([
    ["glpi", new Map([
        ['base-serveur',    { group: 'base',         price: 700,     name: 'Déploiement serveur GLPI',              forfait: 'Forfait installation',    description: 'Déploiement sur serveur Debian, configuration initiale, sécurisation Nginx, certificat TLS.' }],
        ['inv-postes',      { group: 'inventaire',   price: 300,     name: 'Inventaire automatique des postes',     forfait: 'Forfait configuration',   description: 'Déploiement de l\'agent, paramétrage des remontées automatiques.'}],
        ['inv-reseau',      { group: 'inventaire',   price: 300,     name: 'Inventaire réseau / équipements actifs',forfait: 'Forfait configuration',   description: 'Scan et remontée d\'informations des équipements non compatibles avec l\'agent.'}],
        ['inv-atypique',    { group: 'inventaire',   price: 300,     name: 'Inventaire matériel atypique',          forfait: 'Forfait configuration',   description: 'Scripting et recherche de solutions pour l\'inventaire des équipements atypiques ou non identifiables. '}],
        ['inv-licences',    { group: 'inventaire',   price: 300,     name: 'Gestion des licences logicielles',      forfait: 'Forfait configuration',   description: 'Traitement des données remontées sur GLPI et détection des licences.'}],
        ['ticketing',       { group: 'organisation', price: 400,     name: 'Ticketing structuré',                   forfait: 'Forfait configuration',   description: 'Configuration de l\'outil de ticketing conformément à vos processus InternalServerError.'}],
        ['ldap',            { group: 'organisation', price: 230,     name: 'Intégration annuaire LDAP / AD',        forfait: 'Forfait configuration',   description: 'Création automatique des comptes utilisateurs/techniciens/administrateurs basés sur votre annuaire (LDAP, AD Windows, Azure AD).'}],
        ['formation',       { group: 'organisation', price: 600,     name: 'Formation équipe',                      forfait: 'Forfait formation',       description: 'Formation du personnel (utilisateurs et techniciens) à l\'utilisation de l\'outil.'}],
        ['ansible',         { group: 'avances',      price: 500,     name: 'Déploiement automatisé via Ansible',    forfait: 'Forfait avancé',          description: 'Automatisation de la mise à jour des agents avec la mise en place d\'un noeud de contrôle sensible'}],
        ['multi-entites',   { group: 'avances',      price: 400,     name: 'Architecture multi-entités',            forfait: 'Forfait avancé',          description: 'Architechture multi-entités permettant une gestion fine des permissions'}],
        ['migration',       { group: 'avances',      price: 450,     name: 'Migration depuis l\'existant',          forfait: 'Forfait avancé',          description: 'Migration depuis une autre instance GLPI'}],
    ])],
]);