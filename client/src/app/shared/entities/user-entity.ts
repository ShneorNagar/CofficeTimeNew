export class UserEntity {
  user: UserDTO;
  preferences: PreferencesDTO
}

export class UserDTO {
  username: string;
  password?: string;
  userId: string;
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
