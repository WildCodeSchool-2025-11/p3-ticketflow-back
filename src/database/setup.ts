import fs from "node:fs";
import path from "node:path";
import "dotenv/config";
import mysql from "mysql2/promise";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const action = process.argv[2];

// Fonction utilitaire pour charger un fichier SQL
const runSqlFile = async (connection: mysql.Connection, filename: string) => {
	const filePath = path.join(__dirname, filename); // ✔️ Remplacement de import.meta.dirname
	const sql = fs.readFileSync(filePath, "utf-8");

	const statements = sql
		.split(";")
		.map((s) => s.trim())
		.filter((s) => s.length > 0);

	for (const statement of statements) {
		await connection.query(statement);
	}
};

const migrate = async () => {
	const connection = await mysql.createConnection({
		host: DB_HOST,
		port: Number(DB_PORT),
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_NAME,
	});

	console.info("Running schema migration...");
	await runSqlFile(connection, "schema.sql");
	console.info("Migration complete.");

	await connection.end();
};

const seed = async () => {
	const connection = await mysql.createConnection({
		host: DB_HOST,
		port: Number(DB_PORT),
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_NAME,
	});

	console.info("Seeding database...");
	await runSqlFile(connection, "seed.sql");
	console.info("Seed complete.");

	await connection.end();
};

const setup = async () => {
	const connection = await mysql.createConnection({
		host: DB_HOST,
		port: Number(DB_PORT),
		user: DB_USER,
		password: DB_PASSWORD,
	});

	console.info(`Dropping database ${DB_NAME} if exists...`);
	await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);

	console.info(`Creating database ${DB_NAME}...`);
	await connection.query(`CREATE DATABASE \`${DB_NAME}\``);
	await connection.query(`USE \`${DB_NAME}\``);

	console.info("Running schema migration...");
	await runSqlFile(connection, "schema.sql");

	console.info("Seeding database...");
	await runSqlFile(connection, "seed.sql");

	console.info("Database setup complete.");
	await connection.end();
};

switch (action) {
	case "migrate":
		migrate();
		break;
	case "seed":
		seed();
		break;
	case "setup":
		setup();
		break;
	default:
		console.error("Usage: tsx src/database/setup.ts [migrate|seed|setup]");
		process.exit(1);
}
