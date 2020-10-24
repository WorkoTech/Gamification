module.exports = (sequelize, DataTypes) => {
	const ProfileAction = sequelize.define(
	  "profileAction",
	  //attributes
	  {
		currentValue: {
		  type: DataTypes.INTEGER,
		  allowNull: true,
		  defaultValue: 0,
		},
		maxValueReached: {
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
  
	return ProfileAction;
  };
  