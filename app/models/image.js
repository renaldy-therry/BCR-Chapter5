'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Image.init({
    id_public: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
    timestamps: false,
  });
  return Image;
};
