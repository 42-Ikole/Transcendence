
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"

const config: PostgresConnectionOptions = {
	type:			"postgres",
	database:		"pong_db",
	host:			"postgres",
	port:			5432,
	username:		"root",
	password:		"root",
	entities:		['dist/**/*.entity.js'],
	synchronize:	true		// zou tables kunnen droppen als ze niet in de schema staan
}

export default config;
