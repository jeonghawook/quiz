export class LoginDto {
    userEmail: string;
    password: string;
}

export class SignupDto {
    nickname: string;
    userName: string;
    userEmail: string;
    password: string;
}

export class Tokens {
    accessToken: string;
    refreshToken: string;
}