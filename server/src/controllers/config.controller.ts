import {Controller, Get, Logger} from "@nestjs/common";
import {FileSystemReader} from "../utils/file-system.reader";
import * as fs from 'fs';
import {HttpResponse} from "../shared/user-dto";
import {HttpStatusCodeEnum} from "../consts/http-status-code.enum";

@Controller('config')
export class ConfigController {

    fsReader: FileSystemReader;
    private readonly AVATARS_PATH = 'assets/avatars'

    private context = ConfigController.name;
    private logger = new Logger(this.context);

    @Get('avatars')
    async getAvatars(): Promise<HttpResponse> {

        this.logger.log(`get avatars started,`, this.context);
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
            this.logger.error(err, this.context);
            return err;
        }
        this.logger.log(`get avatars ended. got ${avatars.length} avatars`, this.context);
        return {
            value: avatars,
            statusCode: HttpStatusCodeEnum.OK
        } as HttpResponse
    }
}