import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  RequestWithUser,
  TwoFactorCodeDto,
  UserWithTwoFactor,
} from 'src/auth/auth.types';
import { TwoFactorService } from 'src/2FA/twofactor.service';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { OAuthGuard } from './oauth.guard';

@ApiTags('Auth')
@Controller('2fa')
export class TwoFactorController {
  constructor(private twoFactorService: TwoFactorService) {}

  private async validateCode(user: UserWithTwoFactor, code: string) {
    const isCodeValid = await this.twoFactorService.isTwoFactorCodeValid(
      code,
      user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException();
    }
  }

  @Post('register')
  @UseGuards(AuthenticatedGuard)
  async generateQrCode(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const { otpauthUrl } = await this.twoFactorService.generateTFASecret(
      request.user,
    );
    return this.twoFactorService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('enable')
  @UseGuards(AuthenticatedGuard)
  async enableTwoFactor(
    @Req() request: RequestWithUser,
    @Body() { twoFactorCode }: TwoFactorCodeDto,
  ) {
    await this.validateCode(request.user, twoFactorCode);
    await this.twoFactorService.enable(request.user.id);
  }

  @Patch('disable')
  @UseGuards(AuthenticatedGuard)
  async disableTwoFactor(@Req() request: RequestWithUser) {
    await this.twoFactorService.disable(request.user.id);
  }

  @Post('authenticate')
  @UseGuards(OAuthGuard)
  async authenticateTwoFactor(
    @Req() request: RequestWithUser,
    @Body() { twoFactorCode }: TwoFactorCodeDto,
  ) {
    const user = request.user;
    await this.validateCode(user, twoFactorCode);
    request.login({ id: user.id, twoFactorPassed: true }, (error) => {
      if (error) {
        console.error(error);
      }
    });
  }
}
