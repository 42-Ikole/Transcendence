import { BadRequestException, Injectable } from '@nestjs/common';
import { UserWithTwoFactor } from 'src/auth/auth.types';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwoFactorService {
	constructor(
		private userService: UserService,
		private readonly configService: ConfigService) {}

	async generateTFASecret(user: UserWithTwoFactor) {
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(user.intraId.toString(), this.configService.get("APP_NAME"), secret);
		await this.userService.updateUser(user.id, { twoFactorSecret: secret });
		return {
			secret,
			otpauthUrl
		};
	}

	async isTwoFactorCodeValid(code: string, user: UserWithTwoFactor) {
		if (!user.twoFactorSecret) {
			throw new BadRequestException({ message: '2FA: User not registered:', user: user.username, id: user.id });
		}
		return authenticator.verify({
			token: code,
			secret: user.twoFactorSecret
		});
	}

	async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	async enable(id: number) {
		this.userService.updateUser(id, { twoFactorEnabled: true });
	}

	async disable(id: number) {
		this.userService.updateUser(id, { twoFactorEnabled: false });
	}
}
