import { ConfigService } from "@nestjs/config";
import { SessionUser } from "src/auth/auth.types";
import { parse } from 'cookie';
import * as cookieParser from 'cookie-parser';
import { getRepository } from "typeorm";
import { TypeORMSession } from "src/orm/entities/session.entity";
import { TypeormStore } from "connect-typeorm/out";
import * as util from 'util';

// TODO: more error checks
export async function decodeCookie(cookie: string, configService: ConfigService): Promise<SessionUser> {
	// Split the cookie into tokens
	const parsedCookie = parse(cookie);
	// Server-side options
	const name = configService.get('cookie.NAME');
	const secret = configService.get('cookie.SECRET');
	// Parse the Session ID from the Cookie Data
	const SID = cookieParser.signedCookie(parsedCookie[name], secret);
	if (!SID) {
		throw new Error("invalid cookie");
	}
	// Connect to the Session DB to retrieve the session usin the SID
	const store = new TypeormStore().connect(getRepository(TypeORMSession));
	const session = await util.promisify(store.get)(SID);
	return session.passport.user;
}
