'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {
	getRandomInt,
	shuffle,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mock.json`;

const TITLES = [
	`Продам книги Стивена Кинга`,
	`Продам новую приставку Sony Playstation 5`,
	`Продам отличную подборку фильмов на VHS`,
	`Куплю антиквариат`,
	`Куплю породистого кота`,
];
const SENTENCES = [
	`Товар в отличном состоянии.`,
	`Пользовались бережно и только по большим праздникам.`,
	`Продаю с болью в сердце...`,
	`Бонусом отдам все аксессуары.`,
	`Даю недельную гарантию.`,
	`Если товар не понравится — верну всё до последней копейки.`,
	`Это настоящая находка для коллекционера!`,
	`Если найдёте дешевле — сброшу цену.`,
	`Таких предложений больше нет!`,
	`При покупке с меня бесплатная доставка в черте города.`,
];
const CATEGORIES = [
	`Книги`,
	`Разное`,
	`Посуда`,
	`Игры`,
	`Животные`,
	`Журналы`,
];
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

const generateOffers = (count) => (
	Array(count)
		.fill({})
		.map(() => ({
			category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
			description: shuffle(SENTENCES).slice(1, 5).join(` `),
			picture: getPictureFileName(getRandomInt(PICTURE_RESTRICT.MIN, PICTURE_RESTRICT.MAX)),
			title: TITLES[getRandomInt(0, TITLES.length - 1)],
			type: OFFER_TYPE[Object.keys(OFFER_TYPE)[Math.floor(Math.random() * Object.keys(OFFER_TYPE).length)]],
			sum: getRandomInt(SUM_RESTRICT.MIN, SUM_RESTRICT.MAX),
		}))
);

module.exports = {
	name: `--generate`,
	async run(args) {
		const [count] = args;

		if (count > MAX_COUNT) {
			return console.error(`Не больше 1000 объявлений`);
		}

		const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
		const content = JSON.stringify(generateOffers(countOffer));

		try {
			await fs.writeFile(FILE_NAME, content);
			console.info(chalk.green(`Operation success. File created.`));
		} catch (error) {
			console.error(chalk.red(`Can't write data to file...`));
		}
	}
};
