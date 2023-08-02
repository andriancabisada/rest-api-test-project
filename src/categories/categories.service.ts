// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOneBy({
      id: id,
    })
  }

  async create(categoryData: Partial<Category>): Promise<Category> {
    return this.categoryRepository.save(categoryData);
  }

  async update(id: number, categoryData: Partial<Category>): Promise<Category> {
    await this.categoryRepository.update(id, categoryData);
    return this.categoryRepository.findOneBy({
      id: id,
    })
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
