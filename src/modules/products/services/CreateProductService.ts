import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';


interface IRequest {
  name: string;
  price: number;
  quantity: number;
}


class CreateProductService {
  constructor(private productsRepository: IProductsRepository) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
      const checkProduct = await this.productsRepository.findByName(name);

      if(checkProduct){
        throw new AppError('Can not create a new product with same name.')
      }

      const product = await this.productsRepository.create({
        name, 
        price,
        quantity
      });
  
      return product;
    }
}

export default CreateProductService;
