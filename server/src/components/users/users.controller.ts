import {Body, Controller, Get, Logger, Post, Put, Req} from "@nestjs/common";
import {UsersDalService} from "./users-dal.service";
import {HttpResponse, UserDTO, FullUserDTO} from "../../shared/user-dto";
import {HttpResponseService} from "../../services/http/http-response.service";
import {UUIDService} from "../../services/uuid-service";
import {HttpStatusCodeEnum} from "../../services/http/http-status-code.enum";
import {UserEntity} from "../../entities/user/user.entity";
import {UserService} from "../../entities/user/user.service";
import {UpdateResult} from "typeorm";

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UserService,
                private httpResponseService: HttpResponseService) {
    }

    // private httpResponseService: HttpResponseService,
    // private uuidService: UUIDService,

    private context = UsersController.name;
    private logger = new Logger(this.context);

    // done
    @Post('login')
    async getUserByNameAndPassword(@Body() user: UserDTO): Promise<HttpResponse> {
        try {
            const res = await this.userService.getUserByNameAndPassword(user.username, user.password);
            if (res) {
                const message = `user: ${user.username} fetched successfully`;
                this.logger.log(message, this.context);
                return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.OK, res);
            } else {
                const message = 'username or password are incorrect.';
                this.logger.log(`${message} username: ${user.username}`, this.context);
                return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CONFLICT);
            }
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
        }
    }

    // done
    @Put('update')
    async updateUsernameById(@Body() user: UserDTO): Promise<any> {
        const res =  await this.userService.updateUsernameById(user.username, user.userId);
        return res.affected;
    }

    @Post('register')
    async register(@Body() body: FullUserDTO) {
        const res = await this.userService.addUser(body);
        return res;
    }

    // @Post('register')
    // async register(@Body() body: UserDto) {
    //     const UUID = this.uuidService.generateUUID();
    //     try {
    //         this.logger.log(`register started`, this.context);
    //         const user = await this.usersDalService.getUser(body.user.username);
    //
    //         if (user) {
    //             const existMessage = `username: ${user.username} already exist.`;
    //             this.logger.log(existMessage, this.context);
    //             return this.httpResponseService.buildResponse(existMessage, HttpStatusCodeEnum.CONFLICT);
    //         }
    //
    //         await this.usersDalService.createUser(UUID, body);
    //         await this.usersDalService.createPreference(UUID, body);
    //         let newUser = await this.usersDalService.logIn(body.user);
    //         newUser = this.usersDalService.buildUserObject(newUser);
    //         const message = `user ${body.user.username} created successfully.`;
    //         this.logger.log(message, this.context);
    //         return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CREATED, newUser);
    //     } catch (err) {
    //         this.logger.error(err, this.context);
    //         return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
    //     }
    // }

    // @Post('update')
    // async update(@Body() body: UserDto): Promise<HttpResponse> {
    //     try {
    //         this.logger.log(`update started`, this.context);
    //         await this.usersDalService.updateUser(body);
    //         await this.usersDalService.updatePreferences(body);
    //
    //         const message = `user: username: ${body.user.username} with userId: ${body.user.userId} updated successfully.`
    //         this.logger.log(message, this.context);
    //         return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CREATED, body)
    //     } catch (err) {
    //         this.logger.error(err, this.context);
    //         return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // /**
    //  *
    //  * @param req
    //  * @Return all users accept selected
    //  */
    // @Get('allUsers')
    // async getAllUsers(@Req() req){
    //     const userId = req.query.userId;
    //     this.logger.log(`getAllUsers started. userId: ${userId}`, this.context);
    //     try {
    //         const users = await this.usersDalService.getAllUsers(userId);
    //         this.logger.log(`getAllUsers ended.`);
    //         return this.httpResponseService.buildResponse(null, HttpStatusCodeEnum.OK, users);
    //     } catch (err){
    //
    //     }
    // }
}