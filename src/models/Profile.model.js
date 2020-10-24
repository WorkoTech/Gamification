module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    "profile",
    //attributes
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },

      username: {
        type: DataTypes.STRING,
        allowBlank: true,
      },

      firstname: {
        type: DataTypes.STRING,
        allowBlank: true,
      },

      lastname: {
        type: DataTypes.STRING,
        allowBlank: true,
      },

      location: {
        type: DataTypes.STRING,
        allowBlank: true,
      },

      school: {
        type: DataTypes.STRING,
        allowBlank: true,
      },

      about: {
        type: DataTypes.TEXT,
        allowBlank: true,
      },
    },
    {
      //* Ne supprime pas l'entrée de la DB mais set l'attribut deletedAt à la date courrante (quand la suppression est faite).
      //paranoid: true,
      //* Conserve le nom de la table et empêche le comportement par défaut de sequelize
      freezeTableName: true,
    }
  );

  const ProfileReward = sequelize.define(
    "profileReward",
    {
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Profile.associate = (models) => {
    Profile.belongsTo(models.avatar);
    Profile.belongsTo(models.title);
    Profile.belongsToMany(models.action, {
      through: {
        model: models.profileAction,
      },
      targetKey: 'title',
    });
    Profile.belongsToMany(models.reward, {
      through: "profileReward",
    });
  };

  return Profile;
};
