const Sequelize = require('sequelize');
const conn = new Sequelize('postgres://localhost/data_layer');
const { UUID, UUIDV4, DECIMAL, STRING } = Sequelize;

const uuidDefinition = {
	type: UUID,
	primaryKey: true,
	defaultValue: UUIDV4
};

const Product = conn.define('product', {
	id: uuidDefinition,
	name: {
		type: STRING,
		allowNull: false
	},
	suggestedPrice: {
		type: DECIMAL,
		allowNull: false
	}
});

const Company = conn.define('company', {
	id: uuidDefinition,
	name: {
		type: STRING,
		allowNull: false
	}
});

const Offering = conn.define('offering', {
	price: {
		type: DECIMAL,
		allowNull: false
	}
});

Offering.belongsTo(Company, { as: 'companyMoney' });
Company.hasMany(Offering, { foreignKey: 'companyMoneyId' });

Offering.belongsTo(Product, { as: 'productMoney' });
Product.hasMany(Offering, { foreignKey: 'productMoneyId' });

Product.belongsTo(Company);
Company.hasMany(Product);

const syncAndSeed = async () => {
	await conn.sync({ force: true });

	const products = [
		{ name: 'mary j', suggestedPrice: 20.0 },
		{ name: 'crack', suggestedPrice: 50.0 }
	];
	const [maryJ, crack] = await Promise.all(
		products.map(product => Product.create(product))
	);

	const companies = [{ name: 'Starbucks' }, { name: 'Barnes&Nobles' }];

	const [Starbucks, Barnes] = await Promise.all(
		companies.map(company => Company.create(company))
	);

	const offerings = [
		{ price: 30.0, companyMoneyId: Starbucks.id, productMoneyId: maryJ.id },
		{ price: 40.0, companyMoneyId: Barnes.id, productMoneyId: crack.id }
	];
	const [offeringM, offeringC] = await Promise.all(
		offerings.map(offering => Offering.create(offering))
	);
};

module.exports = {
	syncAndSeed,
	Product,
	Company,
	Offering
};
