const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dv1ub4ivc",
    api_key: "867961632336442",
    api_secret: "iEOu8goIudiQZvsojZL7_kz6Ktk",
    secure: true,
});

// Edit where picture will be saved in cloudinary (folder)
const config = {
    dir: "bcr_car-management-api"
}

module.exports = { cloudinary, config };
