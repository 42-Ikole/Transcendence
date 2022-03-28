import { IsInt, IsNumberString } from "class-validator"

export class NumberIdParam {
	@IsNumberString()
	id: number;
};
