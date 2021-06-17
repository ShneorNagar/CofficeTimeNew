import {Body, Controller, Post} from "@nestjs/common";
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

    @Post('login')
    async logIn(@Body() userDTO: UserDTO): Promise<any>{
        try {
            let logInRes = await this.usersDalService.logIn(userDTO)
            if (logInRes){
                const userObjRes = this.usersDalService.buildUserObject(logInRes);
                const message = `user: ${userDTO.username} fetched successfully`;
                return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.OK, userObjRes);
            } else {
                const message = 'username or password are incorrect.';
                return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CONFLICT);
            }
        } catch (err) {
            return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('register')
    async register(@Body() body: UserEntity): Promise<HttpResponse>{
        const UUID = this.uuidService.generateUUID();
        let user = await this.usersDalService.getUser(body.user.username);
        if (!user.username){
            return Promise.all([this.usersDalService.createUser(UUID, body), this.usersDalService.createPreference(UUID, body)])
                .then(()=>{
                    const message = `user ${body.user.username} created successfully.`;
                    return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CREATED, body)
                })
                .catch(err =>{
                    return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
                });

        } else {
            return this.httpResponseService.buildResponse('user already exist', HttpStatusCodeEnum.CONFLICT);
        }
    }

    // todo test it
    @Post('update')
    async update(@Body() body: UserEntity): Promise<HttpResponse>{
        try {
            await this.usersDalService.updateUser(body);
            await this.usersDalService.updatePreferences(body);
            return this.httpResponseService.buildResponse('user updated successfully', HttpStatusCodeEnum.CREATED, body)
        } catch (err) {
            return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
        }
    }

    // @Delete(':id')
    // delete(@Param() params): string {
    //     return `user deleted ${params.id}`;
    // }
}