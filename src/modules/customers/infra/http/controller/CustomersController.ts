import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import CustomRepository from '../../../infra/typeorm/repositories/CustomersRepository';
import { container } from 'tsyringe';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    
    const { name, email } = request.body;

    const customRepository = new CustomRepository();
    const createCustomerService = new CreateCustomerService(customRepository);


    const custumer = await createCustomerService.execute({
      name,
      email
    });

    return response.status(200).json(custumer);
  
  }
}
