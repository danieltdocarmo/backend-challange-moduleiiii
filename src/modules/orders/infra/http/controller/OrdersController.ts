import { Request, Response } from 'express';

import { container } from 'tsyringe';

import OrderRepository from '../../typeorm/repositories/OrdersRepository';
import ProductRepository from '../../../../products/infra/typeorm/repositories/ProductsRepository';
import CostumerRepository from '../../../../customers/infra/typeorm/repositories/CustomersRepository';
import CreateOrderService from '@modules/orders/services/CreateOrderService';

import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
      const {id} = request.params;

      const orderRepository = new OrderRepository();
      const productRepository = new ProductRepository();
      const costumerRepository = new CostumerRepository();

      const findOrderService = new FindOrderService(orderRepository, productRepository, costumerRepository);
      
      const order = await findOrderService.execute(
        {
          id
        });
  
        return response.status(200).json(order);
      }

  public async create(request: Request, response: Response): Promise<Response> {
    
    const {customer_id, products} = request.body;
    
    const orderRepository = new OrderRepository();
    const productRepository = new ProductRepository();
    const costumerRepository = new CostumerRepository();
   
    const createOrderService = new CreateOrderService(orderRepository, productRepository, costumerRepository);
  
     const order =  await createOrderService.execute({
        customer_id,
        products
      });
      
      return response.status(200).json(order);
  
    }
}
