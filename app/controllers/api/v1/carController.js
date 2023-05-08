const { permanentDelete } = require("../../../repositories/carRepository");
const carService = require("../../../services/carService");

module.exports = {
    list(req, res) {
        carService
            .list()
            .then(({ data, count }) => {
                res.status(200).json({
                    status: "success",
                    message: "Get cars data successfully",
                    data,
                    meta: { total: count },
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    message: err.message,
                });
            });
    },

    listDeleted(req, res) {
        carService
            .listDeleted()
            .then(({ data, count }) => {
                res.status(200).json({
                    status: "success",
                    message: "Get archived cars data successfully",
                    data,
                    meta: { total: count },
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    message: err.message,
                });
            });
    },

    async show(req, res) {
        try {
            if (isNaN(req.params.id)) throw new Error("Invalid parameter");
            const id = req.params.id;
            const car = await carService.get(id)
            if (!car) {
                res.status(404).json({
                    status: "failed",
                    message: "Car data not found"
                })
            } else {
                carService
                    .get(id)
                    .then((car) => {
                        res.status(200).json({
                            status: "success",
                            message: "Get car data successfully",
                            data: car,
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            status: "error",
                            message: err.message,
                        });
                    });
            }
        } catch (err) {
            res.status(422).json({
                status: "failed",
                message: err.message,
            });
        }
    },

    async archiveShow(req, res) {
        try {
            if (isNaN(req.params.id)) throw new Error("Invalid parameter");
            const id = req.params.id;
            const car = await carService.forceGet(id)
            if (!car) {
                res.status(404).json({
                    status: "failed",
                    message: "Archived car data not found"
                })
            } else {
                carService
                    .forceGet(id)
                    .then((car) => {
                        res.status(200).json({
                            status: "success",
                            message: "Get archived car data successfully",
                            data: car,
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            status: "error",
                            message: err.message,
                        });
                    });
            }
        } catch (err) {
            res.status(422).json({
                status: "failed",
                message: err.message,
            });
        }
    },

    create(req, res) {
        if (!req.body.name || !req.body.size || !req.body.rent_per_day) {
            res.status(422).json({
                status: "failed",
                message: "Missing required fields",
            })
        } else {
            carService
                .create({
                    ...req.body,
                    createdByUser: req.user.id,
                    lastUpdatedByUser: req.user.id
                })
                .then((car) => {
                    res.status(201).json({
                        status: "success",
                        message: "Create car data successfully",
                        data: {
                            id: car.id,
                            name: car.name,
                            size: car.size,
                            rent_per_day: car.rent_per_day,
                            image_id: car.image_id
                        },
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        status: "error",
                        message: err.message,
                    });
                });
        }
    },

    async update(req, res) {
        try {
            if (isNaN(req.params.id)) throw new Error("Invalid parameter");
            const id = req.params.id;
            const car = await carService.get(id)
            if (!car) {
                res.status(404).json({
                    status: "failed",
                    message: "Car data not found"
                })
            } else {
                const allowedUpdate = ["name", "size", "rent_per_day", "image_id"]
                for (const key of Object.keys(req.body)) {
                    if (!allowedUpdate.includes(key)) {
                        res.status(422).json({
                            status: "failed",
                            message: "Invalid field",
                        })
                        return
                    }
                }
                carService
                    .update(req.params.id, req.user, req.body)
                    .then(() => {
                        res.status(200).json({
                            status: "success",
                            message: "Update car data successfully"
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            status: "error",
                            message: err.message,
                        });
                    });
            }
        } catch (err) {
            res.status(422).json({
                status: "failed",
                message: err.message,
            });
        }
    },

    async delete(req, res) {
        try {
            if (isNaN(req.params.id)) throw new Error("Invalid parameter");
            const id = req.params.id;
            const car = await carService.get(id)

            if (!car) {
                res.status(404).json({
                    status: "failed",
                    message: "Car data not found"
                })
            } else {
                carService.delete(id, req.user)
                    .then((result) => {
                        console.log(result)
                        res.status(200).json({
                            status: "success",
                            message: "Delete car data successfully"
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            status: "error",
                            message: err.message,
                        });
                    });
            }
        } catch (err) {
            res.status(422).json({
                status: "failed",
                message: err.message,
            });
        }
    },

    async permanentDelete(req, res) {
        try {
            if (isNaN(req.params.id)) throw new Error("Invalid parameter");
            const id = req.params.id;
            const car = await carService.forceGet(id)

            if (!car) {
                res.status(404).json({
                    status: "failed",
                    message: "Archived car data not found"
                })
            } else {
                carService.permanentDelete(id)
                    .then((result) => {
                        console.log(result)
                        res.status(200).json({
                            status: "success",
                            message: "Destroy car data successfully"
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            status: "error",
                            message: err.message,
                        });
                    });
            }
        } catch (err) {
            res.status(422).json({
                status: "failed",
                message: err.message,
            });
        }
    },

    async restore(req, res) {
        try {
            if (isNaN(req.params.id)) throw new Error("Invalid parameter");
            const id = req.params.id;
            const car = await carService.forceGet(id)

            if (!car) {
                res.status(404).json({
                    status: "failed",
                    message: "Archived car data not found"
                })
            } else {
                carService.restore(id, req.user)
                    .then((result) => {
                        console.log(result)
                        res.status(200).json({
                            status: "success",
                            message: "Restore car data successfully"
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            status: "error",
                            message: err.message,
                        });
                    });
            }
        } catch (err) {
            res.status(422).json({
                status: "failed",
                message: err.message,
            });
        }
    }
}