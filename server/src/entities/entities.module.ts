import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {UserService} from "./user.service";
import {UsersController} from "../components/users/users.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService],
    controllers: [UsersController],
    exports: [UserService]
})
export class EntitiesModule{}
