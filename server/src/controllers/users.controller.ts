import {Body, Controller, Get, Logger, Post, Put, Req} from "@nestjs/common";
import {HttpResponse} from "../shared/user-dto";
import {HttpResponseService} from "../utils/http-response.service";
import {HttpStatusCodeEnum} from "../consts/http-status-code.enum";
import {UserRepository} from "../ORM/repositories/user.repository";


@Controller('users')
export class UsersController {

    constructor(private readonly userRepository: UserRepository,
                private httpResponseService: HttpResponseService) {
    }

    private context = UsersController.name;
    private logger = new Logger(this.context);

    @Post('login')
    async getUserByNameAndPassword(@Body() user: any): Promise<HttpResponse> {
        try {
            const res = await this.userRepository.getUserAndPreferencesById(user.username, user.password);
            if (res) {
                const message = `user ${user.username} fetched successfully`;
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

    @Post('register')
    async register(@Body() body: any) {
        try {
            const user = await this.userRepository.getUserByName(body.username);
            if (user) {
                const existMessage = `username: ${body.username} already exist.`;
                this.logger.log(existMessage, this.context);
                return this.httpResponseService.buildResponse(existMessage, HttpStatusCodeEnum.CONFLICT);
            }
            await this.userRepository.addUser(body);
            const newUser = await this.userRepository.getUserByNameAndPassword(body.username, body.password)
            const message = `user ${body.username} created successfully.`;
            this.logger.log(message, this.context);
            return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CREATED, newUser);
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('update')
    async update(@Body() body: any): Promise<any>{
        try {
            await this.userRepository.updatePreferences(body);
            const message = `user ${body.username} updated successfully.`
            this.logger.log(message, this.context);
            return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.CREATED, body)
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildResponse('error while updating user data', HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, err);
        }
    }

    /**
     *
     * @param req
     * @Return all users except selected
     */
    @Get('all')
    async getAllUsersAcceptGivenId(@Req() req){
        const id = req.query.userId;
        const users = await this.userRepository.getAllUsersExceptGivenId(id);
        return this.httpResponseService.buildResponse('all users fetched.', HttpStatusCodeEnum.OK, users)
    }

    @Get('all-and-pref-accept-given-id')
    async getAllUsersAndPrefAcceptGivenId(@Req() req){
        const id = req.query.userId;
        const a = await this.userRepository.getAllUsersAndPreferencesAcceptGivenId(id);
        console.log(a)
        return a;
    }
}