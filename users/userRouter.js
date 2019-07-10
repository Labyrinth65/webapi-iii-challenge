const express = require("express");

const usersDB = require("./userDb.js");
const postsDB = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, async (req, res) => {
	try {
		const user = await usersDB.insert(req.body);
		const newUser = await usersDB.getById(user.id);
		res.status(201).json(newUser);
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			error: "There was an error while adding the user to the database"
		});
	}
});

router.post("/:id/posts", (req, res) => {});

router.get("/", async (req, res) => {
	try {
		const users = await usersDB.get(req.query);
		res.status(200).json(users);
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			error: "The users information could not be retrieved."
		});
	}
});

router.get("/:id", validateUserId, async (req, res) => {
	try {
		// const user = await usersDB.getById(req.params.id);
		res.status(200).json(req.user);
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			error: "The user information could not be retrieved."
		});
	}
});

router.get("/:id/posts", async (req, res) => {});

router.delete("/:id", async (req, res) => {});

router.put("/:id", async (req, res) => {});

//custom middleware

async function validateUserId(req, res, next) {
	try {
		const user = await usersDB.getById(req.params.id);
		if (user) {
			req.user = user;
			next();
		} else {
			res.status(400).json({ message: "invalid user id" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "The user information could not be retrieved."
		});
	}
}

function validateUser(req, res, next) {
	if (Object.keys(req.body).length === 0)
		return res.status(400).json({ message: "missing user data" });
	const { name } = req.body;
	if (!name)
		return res.status(400).json({ message: "missing required name field" });
	next();
	// if (req.body) {
	// 	if (req.body.name) {
	// 		next();
	// 	} else {
	// 		res.status(400).json({ message: "missing required name field" });
	// 	}
	// } else {
	// 	res.status(400).json({ message: "missing user data" });
	// }
}

function validatePost(req, res, next) {
	!!req.body
		? !!req.body.text
			? next()
			: res.status(400).json({ message: "missing required text field" })
		: res.status(400).json({ message: "missing post data" });
}

module.exports = router;
