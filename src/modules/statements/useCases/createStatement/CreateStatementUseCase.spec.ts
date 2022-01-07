import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "./CreateStatementController";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;


describe('User Statements', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('Should be able to create a new deposit', async () => {
    const user: ICreateUserDTO = {
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '12345',
    };

    await createUserUseCase.execute(user);

    const authentication = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    const user_id = authentication.user.id as string;

    const deposit = await createStatementUseCase.execute({
      user_id,
      type: 'deposit' as OperationType,
      amount: 3600.00,
      description: 'deposit'
    });

    expect(deposit).toHaveProperty('id')
  });

  it('Should be able to create a new withdraw', async () => {
    const user: ICreateUserDTO = {
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '12345'
    };

    await createUserUseCase.execute(user);

    const authentication = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    const user_id = authentication.user.id as string;

    await createStatementUseCase.execute({
      user_id,
      type: 'deposit' as OperationType,
      amount: 3600.00,
      description: 'deposit'
    });

    const withdraw = await createStatementUseCase.execute({
      user_id,
      type: 'withdraw' as OperationType,
      amount: 1000.00,
      description: 'withdraw'
    });

    expect(withdraw).toHaveProperty('id')
  });

});
