import {Body, Controller, Get, Logger, Post, Put, Req} from "@nestjs/common";
import {HttpResponse, UserDTO, FullUserDTO} from "../shared/user-dto";
import {HttpResponseService} from "../services/http/http-response.service";
import {HttpStatusCodeEnum} from "../services/http/http-status-code.enum";
import {UserRepository} from "../ORM/repositories/user.repository";


@Controller('users')
export class UsersController {

    constructor(private readonly userRepository: UserRepository,
                private httpResponseService: HttpResponseService) {
    }

    private context = UsersController.name;
    private logger = new Logger(this.context);

    // done
    @Post('login')
    async getUserByNameAndPassword(@Body() user: UserDTO): Promise<HttpResponse> {
        try {
            const res = await this.userRepository.getUserAndPreferencesById(user.username, user.password);
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
    @Post('register')
    async register(@Body() body: FullUserDTO) {
        try {
            const user = await this.userRepository.getUserByName(body.user.username);
            if (user) {
                const existMessage = `username: ${body.user.username} already exist.`;
                this.logger.log(existMessage, this.context);
                return this.httpResponseService.buildResponse(existMessage, HttpStatusCodeEnum.CONFLICT);
            }
            const newUser = await this.userRepository.addUser(body);
            const message = `user ${body.user.username} created successfully.`;
            this.logger.log(message, this.context);
            return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CREATED, newUser);
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
        }
    }

    // done
    @Put('update')
    async update(@Body() body: FullUserDTO): Promise<any>{
        try {
            await this.userRepository.updateUser(body);
            const message = `user: username: ${body.user.username} updated successfully.`
            this.logger.log(message, this.context);
            return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CREATED, body)
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildResponse('error while updating user data', HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, err);
        }
    }

    @Get('all')
    async getAllUsers(){
        try {
            const users = await this.userRepository.getAllUsers();
            this.logger.log(`getAllUsers ended.`);
            return this.httpResponseService.buildResponse(null, HttpStatusCodeEnum.OK, users);
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildResponse('error while fetching users', HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, err);
        }
    }

    // done
    /**
     *
     * @param req
     * @Return all users accept selected
     */
    @Get('allUsers')
    getAllUsersAcceptGivenId(@Req() req){
        const id = req.query.userId;
        return this.userRepository.getAllUsersAcceptGivenId(id);
    }

    @Get('all-and-pref-accept-given-id')
    async getAllUsersAndPrefAcceptGivenId(@Req() req){
        const id = req.query.userId;
        const a = await this.userRepository.getAllUsersAndPreferencesAcceptGivenId(id);
        console.log(a)
        return a;
    }
}