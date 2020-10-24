module.exports = (sequelize, DataTypes) => {
  const Title = sequelize.define(
    "title",
    //attributes
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      //* Ne supprime pas l'entrée de la DB mais set l'attribut deletedAt à la date courrante (quand la suppression est faite).
      //paranoid: true,
      //* Conserve le nom de la table et empêche le comportement par défaut de sequelize
      freezeTableName: true,
    }
  );

  Title.associate = models => {
	//Title.hasMany(models.profile);
	Title.hasMany(models.reward);
  };

  return Title;
};
