module.exports = (sequelize, DataTypes) => {
  const Avatar = sequelize.define(
    "avatar",
    //attributes
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      url: {
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

  Avatar.associate = (models) => {
    //Avatar.hasMany(models.profile);
    Avatar.hasMany(models.reward);
  };

  return Avatar;
};
