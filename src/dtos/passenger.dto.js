export class PassengerResponseDTO {
    constructor(passenger) {
        this.id = passenger.id;
        this.nome = passenger.nome;
        this.email = passenger.email;
        this.telefone = passenger.telefone;
        this.status = passenger.status;
    }
}

export class CreatePassengerDTO {
    constructor(body) {
        this.nome = body.nome;
        this.email = body.email;
        this.telefone = body.telefone;
        this.endereco = body.endereco;
        this.status = body.status || 'ativo';
    }
}