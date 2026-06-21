export class UserResponseDTO {
    constructor(user) {
        this.id = user.id;
        this.nome = user.nome;
        this.email = user.email;
        this.login = user.login;
        this.role = user.role;
    }
}

export class LoginDTO {
    constructor(body) {
        this.login = body.login;
        this.senha = body.senha;
    }
}

export class AuthResponseDTO {
    constructor(user, token) {
        this.user = new UserResponseDTO(user);
        this.token = token;
        this.message = "Autenticação realizada com sucesso!";
    }
}
