import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './create-course.dto';
import { UserEntity } from 'src/user/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { sendJson } from 'src/helpers/helpers';
import { ApiTags } from '@nestjs/swagger';

@Controller('courses')
@ApiTags('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
    try {
      const user_id: UserEntity = req.user
      const course = await this.coursesService.create(createCourseDto, user_id)
      sendJson(true, 'Course created successfully', course)
    } catch (error) {
      sendJson(false, 'Course creation failed', error)
    }
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: CreateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
