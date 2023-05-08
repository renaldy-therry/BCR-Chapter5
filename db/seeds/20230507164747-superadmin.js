'use strict';

const bcrypt = require("bcryptjs");
const superadmin = require("../../config/superadmin");
const encryption = require("../../config/encryption");

function encryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, encryption.SALT, (err, encryptedPassword) => {
      if (!!err) {
        reject(err);
        return;
      }

      resolve(encryptedPassword);
    });
  });
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const encryptedPassword = await encryptPassword(superadmin.password);

    return queryInterface.bulkInsert('Users', [{
      name: superadmin.name,
      email: superadmin.email,
      encryptedPassword: encryptedPassword,
      role: "superadmin"
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      role: "superadmin"
    }, {});
  }
};
