export class FullUserDTO {
    username: string;
    password?: string;
    id: string;
    preferences: PreferencesDTO;
}

export class UserDTO {
    username: string;
    password?: string;
    id: string;
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