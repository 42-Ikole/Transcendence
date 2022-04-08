import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Body,
	UseGuards,
	Req,
	NotFoundException,
	Res,
	StreamableFile,
	ParseIntPipe,
  } from '@nestjs/common';
  import { ApiParam, ApiTags } from '@nestjs/swagger';
  import { AvatarService } from './avatar.service';
  import { Readable } from 'stream';
	import { Response } from 'express';

  @ApiTags('avatar')
  @Controller('avatar')
  export class AvatarController {
	constructor(private readonly avatarService: AvatarService) {}
  
	////////////
	// Create //
	////////////

	@Get(':id')
  	async getDatabaseFileById(@Res({ passthrough: true }) response: Response, @Param('id', ParseIntPipe) id: number) {
		const file = await this.avatarService.getAvatarById(id);
	
		const stream = Readable.from(file.data);

		response.set({
			'Content-Disposition': `inline; filename="${file.filename}"`,
			'Content-Type': 'image'
		  })
	  
    	return new StreamableFile(stream);
	}
  

	/////////////
	// Getters //
	/////////////
  

  
	////////////
	// Update //
	////////////

  
	/////////////
	// Getters //
	/////////////
  

  }
  