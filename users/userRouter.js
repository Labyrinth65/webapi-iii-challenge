const express = require("express");

const usersDB = require("./userDb.js");
const postsDB = require("../posts/postDb.js");

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

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
	try {
		const post = await postsDB.insert({ ...req.body, user_id: req.params.id });
		res.status(201).json(post);
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			error: "There was an error while adding the post to the database"
		});
	}
});

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
		res.status(200).json(req.user);
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			error: "The user information could not be retrieved."
		});
	}
});

router.get("/:id/posts", validateUserId, async (req, res) => {
	try {
		const posts = await usersDB.getUserPosts(req.params.id);
		if (posts.length === 0) {
			res.status(201).json({
				message: "The user has no posts."
			});
		} else {
			res.status(200).json(posts);
		}
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			error: "The user information could not be retrieved."
		});
	}
});

router.delete("/:id", validateUserId, async (req, res) => {
	try {
		const count = await usersDB.remove(req.params.id);
		if (count > 0) {
			res.status(200).json(req.user);
		}
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			error: "The user could not be removed"
		});
	}
});

router.put("/:id", validateUserId, validateUser, async (req, res) => {
	try {
		const user = await usersDB.update(req.params.id, req.body);
		res.status(200).json(user);
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			error: "The user information could not be modified."
		});
	}
});

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
}

function validatePost(req, res, next) {
	if (Object.keys(req.body).length === 0) {
		res.status(400).json({ message: "missing post data" });
	} else if (!req.body.text) {
		res.status(400).json({ message: "missing required text field" });
	} else {
		next();
	}
}

module.exports = router;
