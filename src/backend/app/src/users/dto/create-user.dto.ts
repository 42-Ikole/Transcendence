import { isString } from "util";

export class CreateUserDto {
    @isString()
    name: string;    
}
