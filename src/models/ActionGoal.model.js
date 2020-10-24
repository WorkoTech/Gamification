module.exports = (sequelize, DataTypes) => {
  const ActionGoal = sequelize.define(
    "actionGoal",
    //attributes
    {
		id:{
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		goal: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0,
		},
    },
    {
      //* Ne supprime pas l'entrée de la DB mais set l'attribut deletedAt à la date courrante (quand la suppression est faite).
      //paranoid: true,
      //* Conserve le nom de la table et empêche le comportement par défaut de sequelize
      freezeTableName: true,
    }
  );

//   ActionGoal.associate = (models) => {
// 	ActionGoal.belongsTo(models.action);
// 	ActionGoal.belongsTo(models.reward);
//   }

  return ActionGoal;
};
