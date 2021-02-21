import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
 
   id: string;
   quantity: string;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    private ordersRepository: IOrdersRepository,
    private productsRepository: IProductsRepository,
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customerExists = await this.customersRepository.findById(customer_id);

    if(!customerExists){
      throw new AppError('Customer not found');
    }

    console.log(products);

    const existentProducts = await this.productsRepository.findAllById(products);

    if(!existentProducts.length){
      throw new AppError('Can not found any product')
    }

    const existentProductsIds = existentProducts.map(product => product.id);
    
    const checkInexistentProducts = products.filter(
      product => !existentProductsIds.includes(product.id)
    );

    if(checkInexistentProducts.length){
      throw new AppError('could not find products name tal')
    }

    // const findProductWithNoQuantityAvailable = products.filter(
    //   product => existentProducts.filter(p => p.id == product.id)
    // )
    // const order = await this.ordersRepository.create({
    //   customer,
    //   products
    // });

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: Number(product.quantity),
      price: existentProducts.filter(p => p.id == product.id)[0].price
    }));

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts
    })

    const { order_products } = order;

    const orderedProductsQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity: existentProducts.filter(p => p.id == product.id)[0].quantity - product.quantity
    })) 

    await this.productsRepository.updateQuantity(orderedProductsQuantity);

    return order;
  }
}

export default CreateOrderService;
