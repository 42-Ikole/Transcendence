import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

	getHello(): string {
		return 'Response Body!';
	}

	getIngmar(): string {
		return 'Hi, Ingmar!';
	}
}
