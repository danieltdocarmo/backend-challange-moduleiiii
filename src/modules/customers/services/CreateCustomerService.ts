
import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}


class CreateCustomerService {
  constructor(private customersRepository: ICustomersRepository) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {

    const checkEmailExists = await this.customersRepository.findByEmail(email);
    
    console.log(checkEmailExists);
    if(checkEmailExists){
      throw new AppError('Can not create costumer with email already exists');
    }
    
    const costumer = await this.customersRepository.create({
      name,
      email
    });

    return costumer;
  
    }
}

export default CreateCustomerService;
