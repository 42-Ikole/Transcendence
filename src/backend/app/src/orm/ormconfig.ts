
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"
import { User } from "./entities/user.entity"

export const config: PostgresConnectionOptions = {
	type:			"postgres",
	database:		"pong_db",
	host:			"postgres",
	port:			5432,
	username:		"root",
	password:		"root",
	entities:		[User],
	synchronize:	true
}
