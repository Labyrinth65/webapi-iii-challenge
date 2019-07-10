const express = require("express");
const helmet = require("helmet");

const userRouter = require("./users/userRouter.js");
const gate = require("./auth/gate-middleware.js");

const server = express();

server.get("/", (req, res) => {
	res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
	console.log(`${req.method} to ${req.path}`);
	next();
}

server.use(logger);
server.use(helmet());
server.use(express.json());

server.use("/api/users", gate, userRouter);

server.use(errorHandler);

function errorHandler(error, req, res, next) {
	console.log(error);
	res.status(500).json({ error: "Data could not be retrieved" });
}

module.exports = server;
