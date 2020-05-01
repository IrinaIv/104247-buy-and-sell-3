'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {
	getRandomInt,
	shuffle,
} = require(`../../utils`);

const TITLES_FILE_PATH = `./data/titles.txt`;
const SENTENCES_FILE_PATH = `./data/sentences.txt`;
const CATEGORIES_FILE_PATH = `./data/categories.txt`;

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mock.json`;

const OFFER_TYPE = {
	OFFER: `offer`,
	SALE: `sale`,
};
const SUM_RESTRICT = {
	MIN: 1000,
	MAX: 100000,
};
const PICTURE_RESTRICT = {
	MIN: 1,
	MAX: 16,
};

const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const generateOffers = (count, titles, categories, sentences) => (
	Array(count)
		.fill({})
		.map(() => ({
			category: [categories[getRandomInt(0, categories.length - 1)]],
			description: shuffle(sentences).slice(1, 5).join(` `),
			picture: getPictureFileName(getRandomInt(PICTURE_RESTRICT.MIN, PICTURE_RESTRICT.MAX)),
			title: titles[getRandomInt(0, titles.length - 1)],
			type: OFFER_TYPE[Object.keys(OFFER_TYPE)[Math.floor(Math.random() * Object.keys(OFFER_TYPE).length)]],
			sum: getRandomInt(SUM_RESTRICT.MIN, SUM_RESTRICT.MAX),
		}))
);

const readContent = async (filePath) => {
	try {
		const content = await fs.readFile(filePath, `utf8`);
		return content.split(`\n`);
	} catch (err) {
		console.error(chalk.red(err));
		return [];
	}
};

module.exports = {
	name: `--generate`,
	async run(args) {
		const [count] = args;

		if (count > MAX_COUNT) {
			return console.error(chalk.red(`Не больше 1000 объявлений`));
		}

		const sentences = await readContent(SENTENCES_FILE_PATH);
		const titles = await readContent(TITLES_FILE_PATH);
		const categories = await readContent(CATEGORIES_FILE_PATH);

		const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
		const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

		try {
			await fs.writeFile(FILE_NAME, content);
			console.info(chalk.green(`Operation success. File created.`));
		} catch (error) {
			console.error(chalk.red(`Can't write data to file...`));
		}
	}
};
