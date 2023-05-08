const { Car } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
    create(createArgs) {
        return Car.create(createArgs);
    },

    update(id, updateArgs) {
        return Car.update(updateArgs, {
            where: {
                id,
            },
            paranoid: false
        });
    },

    delete(id) {
        return Car.destroy({ where: { id } });
    },

    permanentDelete(id) {
        return Car.destroy({ where: { id }, force: true });
    },

    find(id) {
        return Car.findByPk(id, { paranoid: false });
    },

    findAll() {
        return Car.findAll({ paranoid: false });
    },

    getTotalCar() {
        return Car.count();
    },
};
