import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GradeService } from './grade.service';
import { CreateGradeDTO } from './grade.dto';
import { UserEntity } from 'src/user/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { sendJson } from 'src/helpers/helpers';

@Controller('grade')
@ApiTags('grade')
export class GradeController {
    constructor(
        private gradeService: GradeService
    ) { }

    @Get()
    async findAll() {
        return await this.gradeService.findAll()
    }

    @Get('/id/:id')
    async findOneById(@Param('id') id: string) {
        return await this.gradeService.findOneById(id)
    }

    @Get('/profile/:id')
    async findOneByProfileId(@Param('id') profileId: string) {
        return await this.gradeService.findOneByProfileId(profileId)
    }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async create(@Body() grade: CreateGradeDTO) {
        try {
            const createGrade = await this.gradeService.create(grade)
            return sendJson(true, 'Grade created successfully', createGrade)
        } catch (error) {
            return sendJson(false, 'Failed to create grade', error)
        }


    }

    @Put('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async update(@Param('id') id: string, @Body() updateData: Partial<CreateGradeDTO>) {
        try {
            const updatedGrade = await this.gradeService.update(id, updateData);
            return sendJson(true, 'Grade updated successfully', updatedGrade);
        } catch (error) {
            return sendJson(false, 'Failed to update grade', error);
        }
    }

    @Delete('/id/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async delete(@Param('id') id: string) {
        try {
            const result = await this.gradeService.delete(id);
            return sendJson(true, 'Grade deleted successfully', result);
        } catch (error) {
            return sendJson(false, 'Failed to delete grade', error);
        }
    }
}
