import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>) {
    }

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async findByName(name: string): Promise<UserEntity> {
        const result = await this.userRepository.find({username: name});
        return result[0];
    }

    addUser(){
        let user = new UserEntity();
        user.username = 'shneor2';
        user.password = '123123';
        this.userRepository.manager.save(user).then(res => {
            console.log('success');
            console.log(res);
        });
    }
}