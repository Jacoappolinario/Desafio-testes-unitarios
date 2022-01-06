import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Show Profile User', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('Should be able to list user informations', async() => {

    await createUserUseCase.execute({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '12345'
    });

    const authentication = await authenticateUserUseCase.execute({
      email: "teste@teste.com.br",
      password: '12345'
    });

    const user_id = authentication.user.id;

    const userProfile = await showUserProfileUseCase.execute(user_id as string);


    expect(userProfile).toHaveProperty('id')

  });
});
