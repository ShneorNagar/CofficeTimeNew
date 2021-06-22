import {Controller, Get} from "@nestjs/common";
import {FileSystemReader} from "../services/file-system.reader";
import * as fs from 'fs';
import {HttpResponse} from "../shared/user-entity";
import {HttpStatusCodeEnum} from "../services/http/http-status-code.enum";

@Controller('config')
export class ConfigController {

    fsReader: FileSystemReader;
    private readonly AVATARS_PATH = 'assets/avatars'

    constructor() {
    }

    @Get('avatars')
    async getAvatars(): Promise<HttpResponse> {

        let avatars: {fileName: string, content: string }[] = [];
        this.fsReader = new FileSystemReader(this.AVATARS_PATH);

        try {
            const filenames = await this.fsReader.list();
            for (let filename of filenames) {
                let avatarBase64 = fs.readFileSync(`${this.AVATARS_PATH}\\${filename}`, 'base64');
                avatars.push({
                    fileName: filename,
                    content: `data:image/png;base64,${avatarBase64}`
                });
            }
        } catch (err) {
            return err;
        }
        return {
            value: avatars,
            statusCode: HttpStatusCodeEnum.OK
        } as HttpResponse
    }
}