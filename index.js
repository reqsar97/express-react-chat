const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.send('Hello Wolrd');
});

app.listen(3000, () => {
	console.log('server start on port 3000');
});
