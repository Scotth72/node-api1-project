const express = require('express');
const users = require('./Users');
const uuid = require('uuid');

const logger = require('./Middleware');

const server = express();
const port = 5000;
server.use(express.json());

server.use(logger);

server.get('/', (req, res) => {
	res.send('Hello from Express');
});

server.post('/api/users', (req, res) => {
	const newUser = {
		name: req.body.name,
		bio: req.body.bio,
		id: uuid.v4()
	};

	if (!newUser.name || !newUser.bio) {
		return res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
	}

	users.push(newUser);
	res.json(users);
});

server.get('/api/users', (req, res) => {
	if (res.json(users)) {
		res.status(200);
	} else {
		res.status(500).json({ errorMessage: 'The users information could not be retrieved.' });
	}
});

server.get('/api/users/:id', (req, res) => {
	let id = req.params.id;
	const findUser = users.find((user) => user.id == id);

	if (findUser) {
		res.status(200).json(findUser);
	}
	if (!findUser) {
		res.status(404).json({ message: 'The user with the specified ID does not exist.' });
	} else {
		res.status(500).json({ errorMessage: 'The users information could not be retrieved.' });
	}
});

server.delete('/api/users/:id', (req, res) => {
	const id = req.params.id;
	const deleteUser = users.filter((user) => user.id !== id);

	if (deleteUser) {
		res.status(200).json(deleteUser);
	}
	if (!deleteUser) {
		res.status(404).json({ message: 'The user with the specified ID does not exist.' });
	} else {
		res.status(500).json({ errorMessage: 'The user could not be removed' });
	}
});

server.put('/api/users/:id', (req, res) => {
	const found = users.some((user) => user.id === parseInt(req.params.id));

	if (found) {
		const updateUser = req.body;
		users.forEach((user) => {
			if (user.id === parseInt(req.params.id)) {
				user.name = updateUser.name ? updateUser.name : user.name;
				user.bio = updateUser.bio ? updateUser.bio : user.bio;

				res.status(200).json(updateUser);
			}
		});
	} else {
		res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
	}
});

server.listen(port, () => console.log(`Api is running on port: ${port}`));
