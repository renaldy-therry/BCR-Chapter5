const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require("../../../services/userService");
const authEncryption = require("../../../../config/encryption");

function checkPassword(encryptedPassword, password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, encryptedPassword, (err, isPasswordCorrect)=> {
            if(err) {
                reject(err);
                return;
            }
            resolve(isPasswordCorrect);
        });
    });
}

function createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || authEncryption.SIGNATURE_KEY);
}

async function authorize(req, res, next, roleAllowed) {
    try {
        const tokenBearer = req.headers.authorization;
        const token = tokenBearer.split("Bearer ")[1];
        const payloadToken = jwt.verify (
            token,
            process.env.JWT_SIGNATURE_KEY || authEncryption.SIGNATURE_KEY
        );

        const user = await userService.get(payloadToken.id);
        if(!roleAllowed.includes(user.role)) {
            throw new Error("Unauthorized")
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({
            status: "failed",
            message: "Unauthorized",
        });
    }
}

module.exports = {
     async login(req, res) {
        if (!req.body.email || !req.body.password) {
            res.status(422).json({
                status: "failed",
                message: "Missing fields required",
            });
        } else {
            const email = req.body.email.toLowerCase();
            const password = req.body.password;
            const user = await userService.getByEmail(email);

            if (!user) {
                res.status(401).json({
                    status: "failed",
                    message: "Email is not registered"
                });
                return;
            }

            const isPasswordCorrect = await checkPassword(
                user.encryptedPassword,
                password
            );

            if (!isPasswordCorrect) {
                res.status(401).json({
                    status: "failed",
                    message: "Wrong password"
                });
                return;
            }

            const token = createToken({
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });

            res.status(201).json({
                status: "success",
                message: "login successfully",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }
            });
        }
    },

    // Authorize middleware
    async authorizeMember(req, res, next) {
        authorize(req, res, next, ["member", "admin", "superadmin"]);
    },

    async authorizeAdmin(req, res, next) {
        authorize(req, res, next, ["admin", "superadmin"]);
    },

    async authorizeSuper(req, res, next) {
        authorize(req, res, next, ["superadmin"]);
    },
}