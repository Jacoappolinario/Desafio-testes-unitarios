import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTranferController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { user_id: recipient_id } = request.params;
    const { amount, description } = request.body;

    const createTranfer = container.resolve(CreateTransferUseCase)

    const transfer = await createTranfer.execute({
      sender_id,
      recipient_id,
      amount,
      description
    })

    return response.status(201).json(transfer)
  }
}
