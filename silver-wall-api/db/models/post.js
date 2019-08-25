'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    postContent: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  });

  Post.associate = (models) => {
    // TODO Add associations.
    Post.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
      },
    });
  };

  return Post;
};