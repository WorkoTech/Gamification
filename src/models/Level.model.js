module.exports = (sequelize, DataTypes) => {
  const Level = sequelize.define(
    "level",
    //attributes
    {
      xpThreshold: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      //* Ne supprime pas l'entrée de la DB mais set l'attribut deletedAt à la date courrante (quand la suppression est faite).
      //paranoid: true,
      //* Conserve le nom de la table et empêche le comportement par défaut de sequelize
      freezeTableName: true,
    }
  );

  return Level;
};
