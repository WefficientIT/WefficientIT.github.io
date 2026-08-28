const dataTitle = {
    "glpi":"Déploiement et configuration d'un Gestionnaire Libre de Parc Informatique   "
};
// ajout d'un champ "description" pour les devis
const data = new Map([
    ["glpi", new Map([
        ['base-serveur',    { group: 'base',         price: 700,     name: 'Déploiement serveur GLPI',              forfait: 'Forfait installation',    description: 'Déploiement sur serveur Debian, configuration initiale, sécurisation Nginx, certificat TLS.' }],
        ['inv-postes',      { group: 'inventaire',   price: 300,     name: 'Inventaire automatique des postes',     forfait: 'Forfait configuration',   description: 'Déploiement de l\'agent, paramétrage des remontées automatiques.'}],
        ['inv-reseau',      { group: 'inventaire',   price: 300,     name: 'Inventaire réseau / équipements actifs',forfait: 'Forfait configuration',   description: ''}],
        ['inv-atypique',    { group: 'inventaire',   price: 300,     name: 'Inventaire matériel atypique',          forfait: 'Forfait configuration',   description: ''}],
        ['inv-licences',    { group: 'inventaire',   price: 300,     name: 'Gestion des licences logicielles',      forfait: 'Forfait configuration',   description: ''}],
        ['ticketing',       { group: 'organisation', price: 400,     name: 'Ticketing structuré',                   forfait: 'Forfait configuration',   description: ''}],
        ['ldap',            { group: 'organisation', price: 230,     name: 'Intégration annuaire LDAP / AD',        forfait: 'Forfait configuration',   description: ''}],
        ['formation',       { group: 'organisation', price: 600,     name: 'Formation équipe',                      forfait: 'Forfait formation',       description: ''}],
        ['ansible',         { group: 'avances',      price: 500,     name: 'Déploiement automatisé via Ansible',    forfait: 'Forfait avancé',          description: ''}],
        ['multi-entites',   { group: 'avances',      price: 400,     name: 'Architecture multi-entités',            forfait: 'Forfait avancé',          description: ''}],
        ['migration',       { group: 'avances',      price: 450,     name: 'Migration depuis l\'existant',          forfait: 'Forfait avancé',          description: ''}],
    ])],
]);