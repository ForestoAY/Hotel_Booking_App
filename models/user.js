'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Room, { through: models.Reservation });
      User.hasOne(models.Profile, {
        foreignKey: 'UserId',
        onDelete: 'CASCADE',
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username tidak boleh kosong"
        },
        notNull: {
          msg: "Username tidak boleh kosong"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'email',
        msg: 'Email sudah digunakan'
      },
      validate: {
        notEmpty: {
          msg: "Email tidak boleh kosong"
        },
        notNull: {
          msg: "Email tidak boleh kosong"
        },
        isEmail: {
          msg: "Harus dalam format Email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password tidak boleh kosong"
        },
        notNull: {
          msg: "Password tidak boleh kosong"
        },
        len: {
          args: [8],
          msg: "Password harus memiliki minimal 8 karakter"
        }
      }
    },
    role: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      async beforeCreate(instance, options){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(instance.password, salt);
        instance.password = hash;
        instance.role = 'customer';
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};