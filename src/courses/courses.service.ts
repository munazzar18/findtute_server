import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './create-course.dto';
import { UserEntity } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Repository } from 'typeorm';


@Injectable()
export class CoursesService {
  constructor(@InjectRepository(Course) private courseRepo: Repository<Course>) { }

  async create(createCourseDto: CreateCourseDto, authUser: UserEntity) {
    try {
      const course = this.courseRepo.create({
        ...createCourseDto,
        user_id: authUser.id
      })
      const result = await this.courseRepo.save(course)
      return result
    } catch (error) {
      console.log(error)
      return error
    }
  }

  findAll() {
    return `This action returns all courses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseDto: CreateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
