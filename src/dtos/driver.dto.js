export class DriverResponseDTO {
    constructor(driver) {
        this.id = driver.id;
        this.nome = driver.nome;
        this.email = driver.email;
        this.telefone = driver.telefone;
        this.placa = driver.placa;
        this.modelo = driver.modelo;
        this.status = driver.status;
    }
}

export class CreateDriverDTO {
    constructor(body) {
        this.nome = body.nome;
        this.email = body.email;
        this.telefone = body.telefone;
        this.cpf = body.cpf;
        this.cnh = body.cnh;
        this.placa = body.placa;
        this.modelo = body.modelo;
        this.status = body.status || 'ativo';
    }
}