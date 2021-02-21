import { Request, Response } from 'express';


import CreateProductService from '@modules/products/services/CreateProductService';
import ProductRepository from '../../typeorm/repositories/ProductsRepository';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    
    const {name, price, quantity} = request.body;
    
    const productRepository = new ProductRepository();
    const createProductService = new CreateProductService(productRepository);

    const product = await createProductService.execute({
      name,
      price,
      quantity
    });

    return response.status(200).json(product);

  }
}
