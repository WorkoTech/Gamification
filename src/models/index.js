'use strict';

const dotenv = require('dotenv').config()
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = 'development';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
sequelize = new Sequelize(
    process.env.DATABASE_NAME || config.database,
    process.env.DATABASE_USER || config.username,
    process.env.DATABASE_PASSWORD || config.password,
    {
        host: process.env.DATABASE_HOST || config.host,
        dialect: "postgres",
        define: {
            freezeTableName: true
        }
    }
);

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
