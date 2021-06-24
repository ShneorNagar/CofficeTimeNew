import {Body, Controller, Logger, Post} from "@nestjs/common";
import {UsersDalService} from "./users-dal.service";
import {HttpResponse, UserDTO, UserEntity} from "../../shared/user-entity";
import {HttpResponseService} from "../../services/http/http-response.service";
import {UUIDService} from "../../services/uuid-service";
import {HttpStatusCodeEnum} from "../../services/http/http-status-code.enum";

@Controller('users')
export class UsersController {

    constructor(private usersDalService: UsersDalService,
                private httpResponseService: HttpResponseService,
                private uuidService: UUIDService) {
    }

    private context = UsersController.name;
    private logger = new Logger(this.context);

    @Post('login')
    async logIn(@Body() userDTO: UserDTO): Promise<any> {
        try {
            this.logger.log(`logIn started`, this.context);
            let logInRes = await this.usersDalService.logIn(userDTO)
            if (logInRes) {
                const userObjRes = this.usersDalService.buildUserObject(logInRes);
                const message = `user: ${userDTO.username} fetched successfully`;
                this.logger.log(message, this.context);
                return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.OK, userObjRes);
            } else {
                const message = 'username or password are incorrect.';
                this.logger.log(`${message} username: ${userDTO.username}`, this.context);
                return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CONFLICT);
            }
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('register')
    async register(@Body() body: UserEntity) {
        const UUID = this.uuidService.generateUUID();
        try {
            this.logger.log(`register started`, this.context);
            const user = this.usersDalService.getUser(body.user.username);
            if (!user){
                await this.usersDalService.createUser(UUID, body);
                await this.usersDalService.createPreference(UUID, body);
                let newUser = await this.usersDalService.logIn(body.user);
                newUser = this.usersDalService.buildUserObject(newUser);
                const message = `user ${body.user.username} created successfully.`;
                this.logger.log(message, this.context);
                return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CREATED, newUser);
            }
            const existMessage = `username: ${body.user.username} with userId: ${body.user.userId} already exist.`;
            this.logger.log(existMessage, this.context);
            return this.httpResponseService.buildResponse(existMessage, HttpStatusCodeEnum.CONFLICT);
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
        }
    }

    // todo test it
    @Post('update')
    async update(@Body() body: UserEntity): Promise<HttpResponse> {
        try {
            this.logger.log(`update started`, this.context);
            await this.usersDalService.updateUser(body);
            await this.usersDalService.updatePreferences(body);

            const message = `user: username: ${body.user.username} with userId: ${body.user.userId} updated successfully.`
            this.logger.log(message, this.context);
            return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CREATED, body)
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
        }
    }

    // @Delete(':id')
    // delete(@Param() params): string {
    //     return `user deleted ${params.id}`;
    // }
}