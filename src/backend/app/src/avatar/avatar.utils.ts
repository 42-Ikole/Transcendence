import { BadRequestException } from "@nestjs/common";

export const imageFileFilter = (_req, file, callback) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
	  return callback(new BadRequestException('Only image files are allowed!'), false);
	}
	callback(null, true);
};
