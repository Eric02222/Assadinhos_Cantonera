Create database lanchos;

use lanchos;

create table usuarios(
	id int not null auto_increment primary key,
    nome varchar(255),
    cpf bigint,
    senha varchar(255),
    telefone bigint,
    email varchar(255),
    endereco varchar(255),
    ativo int DEFAULT 1,

    --  tipo_conta = 0 (CLIENTE) || tipo_conta = 1 (ADMIN)
    tipo_conta int DEFAULT 0 
);

create table lanches (
	id int not null auto_increment primary key,
    nome varchar(255),
    preco decimal(8,2),
    categoria varchar(255),
    quantidade bigint,
    disponivel boolean DEFAULT true
);


create table pedidos(
    id int not null auto_increment primary key,
    horarioPedido datetime,
    lanchePedido int,
    quantidadePedida bigint,
    enderecoPedido varchar(255),
    usuarioComprador int,
    foreign key (lanchePedido) references lanches(id),
    foreign key (usuarioComprador) references usuarios(id)
);

create table historico(
    id int not null auto_increment primary key,
    horarioPedido datetime,
    lanchePedido int,
    quantidadePedida bigint,
    enderecoPedido varchar(255),
    usuarioComprador int,
    acao varchar(50),
    foreign key (lanchePedido) references lanches(id),
    foreign key (usuarioComprador) references usuarios(id)
);

insert into usuarios (nome,cpf,senha,telefone,email,endereco,ativo,tipo_conta)
values
("andrei", 12371471713, "$2b$10$vu3/3XZ7Im//WL269b3kYuFStDUU7byZlMKBSgyW.PILMTs.HRHs6", 48918276917, "a@gmail.com", "rua das bananas 69", 1 , 0),
("felipe", 17420817287, "$2b$10$X.uJP.9cxTAHFjOVSP8C8.sEKWP38R56BUBLuyXqrILmKnIr4qIhG", 12912376178, "b@gmail.com", "rua das vacas 420", 1 , 0),
("admin", 00000000000, "$2b$10$5S/rTz1LhkSiN1Xi5kc2/ufIJEV5OgZYmrGhaZGC0.E3kp2sy9/OG", 00000000000, "admin@gmail.com", "endereco da loja", 1 , 1);

insert into lanches (nome,preco,categoria,quantidade,disponivel)
values
("coxinha",11.90,"frito",30,1),
("risole",10.90,"assado",40,1),
("Coxinha de costela", 14.90,"frito", 50, 0);

insert into pedidos ( horarioPedido,lanchePedido,quantidadePedida,enderecoPedido,usuarioComprador)
values
('2026-06-15 14:35:00', 1, 20,"rua das bananas 69", 1),
('2026-06-15 14:40:00', 2, 10,"rua das bananas 69", 1),
('2026-06-15 14:55:00', 2, 1,"rua das vacas 420", 2);

insert into historico ( horarioPedido,lanchePedido,quantidadePedida,enderecoPedido,usuarioComprador, acao)
values
('2026-04-26 12:30:00', 2, 12,"rua das bananas 69", 1, 'Pedido'),
('2026-01-12 16:55:00', 1, 15,"rua das bananas 69", 1, 'Pedido'),
('2026-03-11 09:32:00', 2, 3,"rua das vacas 420", 2, 'Pedido');