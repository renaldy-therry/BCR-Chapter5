const { User } = require("../models");

module.exports = {
    create(createArgs) {
        return User.create(createArgs);
    },

    delete(id) {
        return User.destroy({ where: { id } });
    },

    find(id) {
        return User.findByPk(id);
    },

    attributesFind(id, attributes) {
        return User.findByPk(id, { attributes })
    },

    findByEmail(email) {
        return User.findOne({ where: { email } })
    },

    findAll() {
        return User.findAll();
    },

    getTotalUser() {
        return User.count();
    },
};
