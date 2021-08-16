export class UserEntity {
  username: string;
  password?: string;
  id: string;
  preferences: PreferencesDTO
}

export class UserDTO {
  username: string;
  password?: string;
  id: string;
}

export class PreferencesDTO {
  coffee?: number;
  tea?: string;
  sugar?: number;
  milk?: string;
  note?: string;
  drink_type?: string;
  avatar?: string;
}
