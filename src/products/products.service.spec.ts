import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from '../products/entities/product.entity'; // Assuming you have an entity for Product
import { Repository , DeleteResult } from 'typeorm';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product), // Use your entity's token
          useClass: Repository, // Use the real TypeORM Repository
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  it('should find all products', async () => {
    const result: Product[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description for Product 1',
        category: {
          id: 1,
          name: 'Category 1',
          products: [], // You can include an empty array or mock it with products if needed
        },
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description for Product 2',
        category: {
          id: 2,
          name: 'Category 2',
          products: [],
        },
      },
    ];
     jest.spyOn(productRepository, 'find').mockResolvedValue(result);

    const products = await productsService.findAll();

    expect(products).toEqual(result);
  });

  it('should create a product', async () => {
    const productToCreate: Product = {
      id: 1,
      name: 'New Product',
      description: 'Description for New Product',
      category: { id: 1, name: 'Category 1', products: [] },
    };
    
    const createdProduct: Product = {
      id: 3, // Assuming it's a new product with ID 3
      ...productToCreate,
    };

    jest.spyOn(productRepository, 'save').mockResolvedValue(createdProduct);

    const result = await productsService.create(productToCreate);

    expect(result).toEqual(createdProduct);
  });

  

  // Add test cases for the patch (update) and delete methods
  it('should update a product', async () => {
    const productId = 1;
    const updatedProductData: Partial<Product> = { name: 'Updated Product Name' };
    const updatedProduct: Product = {
      id: productId,
      name: 'Updated Product Name',
      description: 'Description for Updated Product',
      category: { id: 1, name: 'Category 1', products: [] },
    };

    jest.spyOn(productRepository, 'findOne').mockResolvedValue(updatedProduct);
    jest.spyOn(productRepository, 'save').mockResolvedValue(updatedProduct);

    const result = await productsService.update(productId, updatedProductData);

    expect(result).toEqual(updatedProduct);
  });

  it('should delete a product', async () => {
    const productId = 1;

    // Mock the delete method to return a Promise with a DeleteResult
    jest.spyOn(productRepository, 'delete').mockResolvedValue({ raw: {}, affected: 1 } as DeleteResult );

    await productsService.remove(productId);

    expect(productRepository.delete).toHaveBeenCalledWith(productId);
  });
  // Add more test cases for other methods of ProductsService
});
