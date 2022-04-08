import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

export async function downloadAvatar(url: string, httpService: HttpService) {
    console.log(url);
    const observable = await httpService.get(url);
    const value = await lastValueFrom(observable);
    console.log(typeof value.data);
    return {
        filename: url,
        data: value.data
    }
}
