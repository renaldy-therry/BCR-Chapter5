const imageService = require("../../../services/imageService");

module.exports = {
    upload(req, res) {
        const fileBase64 = req.file.buffer.toString("base64");
        const file = `data:${req.file.mimetype};base64,${fileBase64}`;
        imageService.upload(file)
            .then(result => {
                res.status(201).json({
                    status: "success",
                    message: "Upload image successfully",
                    data: {
                        id: result.id,
                        url: result.url,
                        public_id: result.public_id
                    }
                });
            })
            .catch(err => {
                res.status(500)
                    .json({
                        status: "error",
                        message: err.message
                    })
            })
    },

    async delete(req, res) {
        try {
            if (isNaN(req.params.id)) throw new Error("Invalid parameter");
            const img = await imageService.get(req.params.id)

            if (!img) {
                res.status(404).json({
                    status: "failed",
                    message: "Image data not found"
                })
            } else {
                imageService.delete(req.params.id)
                    .then(() => {
                        res.status(200).json({
                            status: "success",
                            message: "Delete image data successfully"
                        })
                    })
                    .catch(err => {
                        console.error(err)
                        res.status(500).json({
                            status: "error",
                            message: err.message
                        })
                    })
            }
        } catch (err) {
            res.status(422).json({
                status: "failed",
                message: err.message
            })
        }
    },

    async show(req, res) {
        try {
            if (isNaN(req.params.id)) throw new Error("Invalid parameter");
            const img = await imageService.get(req.params.id)
            if (!img) {
                res.status(404).json({
                    status: "failed",
                    message: "Image data not found"
                })
            } else {
                res.status(200).json({
                    status: "success",
                    message: "Get image data successfully",
                    data: {
                        id: img.id,
                        url: img.url,
                        public_id: img.public_id
                    }
                })
            }
        } catch (err) {
            res.status(422).json({
                status: "failed",
                message: err.message
            })
        }
    }
}