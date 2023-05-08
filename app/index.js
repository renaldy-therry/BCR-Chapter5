const express = require("express");
const morgan = require("morgan");
const router = require("../config/routes");
const fs = require('fs')
const path = require("path")
const cors = require('cors');
const controller = require("./controllers");

const app = express();

app.use(cors({
    origin: '*'
}));

app.use(morgan('combined'));
app.use(morgan("dev"))

/** Install JSON request parser */
app.use(express.json());

app.use(controller.api.main.onParseError)
app.use(controller.api.main.onError)

/** Install Router */
app.use(router);

module.exports = app;
