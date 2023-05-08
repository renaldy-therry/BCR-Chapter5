const carRepository = require("../repositories/carRepository");
const userRepository = require("../repositories/userRepository");
const imageRepository = require("../repositories/imageRepository");


const formatCarData = async (car) => {
    const [img, creator, updater] = await Promise.all([
        imageRepository.find(car.image_id),
        userRepository.attributesFind(car.createdByUser, ["id", "name"]),
        userRepository.attributesFind(car.lastUpdatedByUser, ["id", "name"])
    ])

    return {
        id: car.id,
        name: car.name,
        size: car.size,
        rent_per_day: car.rent_per_day,
        image: img,
        createdByUser: creator,
        createdAt: car.createdAt,
        updatedBy: updater,
        updatedAt: car.updatedAt
    }
}

const formatDeletedCarData = async (car) => {
    const [img, creator, deleter] = await Promise.all([
        imageRepository.find(car.image_id),
        userRepository.attributesFind(car.createdByUser, ["id", "name"]),
        userRepository.attributesFind(car.deletedByUser, ["id", "name"])
    ])

    return {
        id: car.id,
        name: car.name,
        size: car.size,
        rent_per_day: car.rent_per_day,
        image: img,
        createdByUser: creator,
        createdAt: car.createdAt,
        deletedByUser: deleter,
        deletedAt: car.deletedAt
    }
}

module.exports = {
    create(requestBody) {
        return carRepository.create(requestBody);
    },

    update(id, user, requestBody) {
        return carRepository.update(id, {
            ...requestBody,
            updatedByUser: user.id
        });
    },

    async delete(id, user) {
        return Promise.all([
            carRepository.update(id, { deletedByUser: user.id }),
            carRepository.delete(id)
        ])
    },

    async permanentDelete(id) {
        return carRepository.permanentDelete(id);
    },

    async listDeleted() {
        try {
            const cars = await carRepository.findAll();
            const filteredCars = cars.filter(car => car.deletedAt !== null)
            const formattedCar = await Promise.all(filteredCars.map(car => formatDeletedCarData(car)))
            const carCount = formattedCar.length;

            return {
                data: formattedCar,
                count: carCount,
            };
        } catch (err) {
            throw err.message;
        }
    },

    async list() {
        try {
            const cars = await carRepository.findAll();
            const filteredCars = cars.filter(car => car.deletedAt === null)
            const formattedCar = await Promise.all(filteredCars.map(car => formatCarData(car)))
            const carCount = formattedCar.length;

            return {
                data: formattedCar,
                count: carCount,
            };
        } catch (err) {
            throw err;
        }
    },

    async get(id) {
        const car = await carRepository.find(id)
        if (car && car.deletedAt === null) {
            const formattedCar = await formatCarData(car)
            return formattedCar;
        }
        return null
    },

    async forceGet(id) {
        const car = await carRepository.find(id)
        if (car && car.deletedAt !== null) {
            const formattedCar = await formatDeletedCarData(car)
            return formattedCar;
        }
        return null
    },

    async restore(id, user) {
        const car = await carRepository.find(id)
        if (car.deletedAt !== null) {
            return carRepository.update(id, {
                deletedByUser: null,
                deletedAt: null,
                updatedByUser: user.id
            })
        }
        return null
    }
};
