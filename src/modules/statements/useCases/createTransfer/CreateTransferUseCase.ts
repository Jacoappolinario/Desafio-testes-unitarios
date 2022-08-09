import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTranferDTO } from "./ICreateTransferDTO";

export enum OperationType {
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ){}

  async execute({ sender_id, recipient_id, amount, description }: ICreateTranferDTO) {
    const sender = await this.usersRepository.findById(sender_id);

    if (!sender) {
      throw new CreateTransferError.SenderNotFound();
    }

    const recipient = await this.usersRepository.findById(recipient_id);

    if (!recipient) {
       throw new CreateTransferError.RecipientNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }


    await this.statementsRepository.create({
      user_id: sender_id,
      amount,
      description,
      type: OperationType.WITHDRAW
    })

    const transferOperation = await this.statementsRepository.create({
      user_id: recipient_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER
    })

    return transferOperation;
  }
}
