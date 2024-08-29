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
    async create(@Body() grade: CreateGradeDTO, @Request() req) {
        try {
            const profileId = req.user.profile.id
            const createGrade = this.gradeService.create(grade, profileId)
            return sendJson(true, 'Grade created successfully', createGrade)
        } catch (error) {
            return sendJson(false, 'Failed to create grade', error)
        }


    }

    @Put('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async update(@Param('id') id: string, @Body() data: CreateGradeDTO, @Request() req) {
        try {
            const profileId = req.user.profile.id
            const updateGrade = this.gradeService.update(id, data, profileId)
            return sendJson(true, 'Grade updated successfully', updateGrade)
        } catch (error) {
            return sendJson(false, 'Failed to update grade', error)
        }
    }

    @Delete('/id/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async delete(@Param('id') id: string, @Request() req) {
        try {
            const profileId = req.user.profile.id
            const grade = await this.gradeService.delete(id, profileId)
            return sendJson(true, 'Grade deleted successfully', grade)
        } catch (error) {
            return sendJson(false, 'Failed to delete grade', error)
        }

    }
}
