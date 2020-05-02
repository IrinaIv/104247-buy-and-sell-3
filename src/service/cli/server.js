'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const http = require(`http`);
const { HTTP_CODE } = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = `mock.json`;

const sendResponse = (res, statusCode, message) => {
	res.statusCode = statusCode;
	res.writeHead(statusCode, {
		'Content-Type': `text/html; charset=UTF-8`,
	});

	const html = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

	res.end(html);
};

const onClientConnect = async (req, res) => {
	const notFoundMessageText = `Not found`;

	switch (req.url) {
		case `/`:
			try {
				const fileContent = await fs.readFile(FILENAME);
				const mocks = JSON.parse(fileContent);
				const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
				sendResponse(res, HTTP_CODE.OK, `<ul>${message}</ul>`);
			} catch (err) {
				sendResponse(res, HTTP_CODE.NOT_FOUND, notFoundMessageText);
			}
			break;
		default:
			sendResponse(res, HTTP_CODE.NOT_FOUND, notFoundMessageText);
			break;
	}
};

module.exports = {
	name: `--server`,
	run(args) {
		const [customPort] = args;
		const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

		http.createServer(onClientConnect)
			.listen(port)
			.on(`listening`, (err) => {
				if (err) {
					console.error(chalk.red(`Ошибка при создании сервера`), err);
				} else {
					console.info(chalk.green(`Ожидаю соединений на ${port}`));
				}
			});
	}
};
