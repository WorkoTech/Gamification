# MS-GAMIFICATION

Ce service gère la partie gamification de la plateforme.

## Installation

Le service est lancé avec les autres micro-services, il n'y a donc pas besoin de l'exécuter seul. Cependant, il est possible de le faire dans le cadre du développement, de tests et de démonstration.

### Dépendences

L'utilisation de ms-gamification requiert :

- `nodejs`

- `npm` avec de quoi installer les packages :

  - body-parser
  - dotenv
  - express
  - pg
  - pg-hstore
  - sequelize

- `Docker` avec suffisemment de place pour :

  - image `postgres`
  - image `node:8`

### Ports

L'application utilise les ports suivants :

- 3000
- 5432

## Lancement

La base de donnée postgre doit être accessible au lancement de l'application. Pour cela, executer dans un terminal la commande :

`docker-compose -f docker-compose.yml up`

La base de donnée est prête lorsque le message `database system is ready to accept connections` s'affiche dans les logs du terminal.

Une fois la base de donnée prête, dans un **second terminal**, il est possible de lancer l'application à l'aide de la commande :

`npm run start`

L'application est prête lorsque le message `App listening on port 3000!` s'affiche dans le terminal.

## Utilisation

L'application tourne à l'adresse `localhost:3000`.
