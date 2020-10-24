const Sequelize = require("sequelize");

module.exports = function(app) {
  const connectionString = app.get("postgres");
  const sequelize = new Sequelize(connectionString, {
    dialect: "postgres",
    logging: false,
    define: {
      freezeTableName: true
	},
	returning: true
  });
};