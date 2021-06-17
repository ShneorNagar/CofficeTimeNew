export class UserEntity {
    user: UserDTO;
    preferences: PreferencesDTO;
}

export class UserDTO {
    username: string;
    password?: string;
    userId: string;
}

export class PreferencesDTO {
    coffee?: number;
    sugar?: number;
    milk?: string;
    note?: string;
    tea?: string;
    drink_type?: string;
    avatar?: string;
}

export class HttpResponse {
    value: any;
    statusCode?: number;
    message?: string;
}