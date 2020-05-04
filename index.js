const express = require('express');

const server = express();
const port = 5000;
server.use(express.json());

server.get('/', (req, res) => {
	res.send('Hello from Express');
});
const users = [];

server.post('/api/users', (req, res) => {
	const newUser = req.body;
	const { name, bio } = newUser;
	if (name.length !== 0 && bio.length !== 0) {
		users.push(newUser);
		newUser.id = users.length;
		if (users.find((item) => item.id === newUser.id)) {
			res.status(201).json(users);
		} else {
			res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
		}
	} else {
		res.status(500).json({ errorMessage: 'There was an error while saving the user to the database' });
	}
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

server.listen(port, () => console.log(`Api is running on port: ${port}`));
