import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from '../categories/entities/category.entity';
import { Repository, DeleteResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  it('should find all categories', async () => {
    const result: Category[] = [
      { id: 1, name: 'Category 1', products: [] },
      { id: 2, name: 'Category 2', products: [] },
    ];

    jest.spyOn(categoryRepository, 'find').mockResolvedValue(result);

    const categories = await categoriesService.findAll();

    expect(categories).toEqual(result);
  });

  it('should create a category', async () => {
    const categoryToCreate: Category = {
      id: 1,
      name: 'New Category',
      products: [],
    };

    const createdCategory: Category = {
      id: 3, // Assuming it's a new category with ID 3
      ...categoryToCreate,
    };

    jest.spyOn(categoryRepository, 'save').mockResolvedValue(createdCategory);

    const result = await categoriesService.create(categoryToCreate);

    expect(result).toEqual(createdCategory);
  });

  it('should update a category', async () => {
    const categoryId = 1;
    const updatedCategoryData: Partial<Category> = { name: 'Updated Category Name' };
    const updatedCategory: Category = {
      id: categoryId,
      name: 'Updated Category Name',
      products: [],
    };

    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(updatedCategory);
    jest.spyOn(categoryRepository, 'save').mockResolvedValue(updatedCategory);

    const result = await categoriesService.update(categoryId, updatedCategoryData);

    expect(result).toEqual(updatedCategory);
  });

  it('should delete a category', async () => {
    const categoryId = 1;

    // Mock the delete method to return a Promise with a DeleteResult
    jest.spyOn(categoryRepository, 'delete').mockResolvedValue({ raw: {}, affected: 1 } as DeleteResult);

    await categoriesService.remove(categoryId);

    expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId);
  });
});
