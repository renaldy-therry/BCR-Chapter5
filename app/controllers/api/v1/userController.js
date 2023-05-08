const bcrypt = require("bcryptjs");
const userService = require("../../../services/userService");
const encryption = require("../../../../config/encryption");

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

// Register base handler
async function register(req, res, role) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(422).json({
            status: "error",
            message: "Missing required fields"
        });
    } else {
        const email = req.body.email;
        const userAlreadyExist = await userService.isUserExist(email);
        if (userAlreadyExist) {
            res.status(409).json({
                status: "failed",
                message: "email already registered"
            })
            return
        } else {
            const name = req.body.name;
            const encryptedPassword = await encryptPassword(req.body.password);
            userService.create({ name, email, encryptedPassword, role })
                .then(user => {
                    res.status(201).json({
                        status: "success",
                        message: "create user successfully",
                        data: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: role,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                        }
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        status: "error",
                        message: err.message
                    })
                })
        }

    }
}

module.exports = {
    async registerMember(req, res) {
        register(req, res, "member");
    },

    async registerAdmin(req, res) {
        register(req, res, "admin");
    },

    async whoAmI(req, res) {
        res.status(200).json({
            status: "success",
            message: "Get current user information successfully",
            data: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
            }
        });
    },

    async list(req, res) {
        userService
            .list()
            .then(({ data, count }) => {
                res.status(200).json({
                    status: "success",
                    message: "Get user list successfully",
                    data,
                    meta: { total: count },
                });
            })
            .catch((err) => {
                res.status(500).json({
                    status: "error",
                    message: err.message,
                });
            });
    }
}