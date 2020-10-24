module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define(
    "action",
    //attributes
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      //* Ne supprime pas l'entrée de la DB mais set l'attribut deletedAt à la date courrante (quand la suppression est faite).
      //paranoid: true,
      //* Conserve le nom de la table et empêche le comportement par défaut de sequelize
      freezeTableName: true,
    }
  );

  Action.associate = (models) => {
    Action.belongsToMany(models.profile, {
      through: {
        model: models.profileAction,
      },
      foreignKey: 'actionTitle',
    });
    Action.belongsToMany(models.reward, {
      through: {
		model: models.actionGoal,
		unique: false,
      },
      foreignKey: 'actionTitle',
	});
	// Action.hasMany(models.actionGoal);
  };

  return Action;
};
