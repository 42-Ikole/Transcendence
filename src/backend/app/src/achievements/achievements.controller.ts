import { Controller, Get, Param, ParseIntPipe, Post, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AchievementService } from './achievements.service';
  
@ApiTags('achievements')
@Controller('achievements')
export class AchievementController {
	constructor(private readonly achievementService: AchievementService) {}

	@Get()
	async findAll() {
		return await this.achievementService.findAll({ relations: ["users"] });
	}

	@Post('test/:id')
	test(@Param('id', ParseIntPipe) id: number) {
		return this.achievementService.checkPongAchievements(id);
	}
}
