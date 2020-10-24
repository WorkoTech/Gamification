module.exports = (sequelize, DataTypes) => {
  const Reward = sequelize.define(
    "reward",
    //attributes
    {
      xpValue: {
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

  Reward.associate = (models) => {
    Reward.belongsTo(models.avatar, {
      foreignKey: {
        allowNull: true,
      },
    });
    Reward.belongsTo(models.title, {
      foreignKey: {
        allowNull: true,
      },
    });
    Reward.belongsToMany(models.profile, {
		through: "profileReward"
	});
    Reward.belongsToMany(models.action, {
      through: {
      model: models.actionGoal,
      unique: false,
      },
      targetKey: 'title',
	});
	// Reward.hasMany(models.actionGoal);
  };

  return Reward;
};
