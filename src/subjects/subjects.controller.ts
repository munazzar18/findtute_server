import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { sendJson } from 'src/helpers/helpers';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { SubjectsDto } from './subjects.dto';

@Controller('subjects')
@ApiTags('subjects')

export class SubjectsController {
    constructor(
        private subjectService: SubjectsService
    ) { }

    @Get()
    async findAll() {
        try {
            const allSubjects = await this.subjectService.findAll()
            return sendJson(true, 'All subjects', allSubjects)
        } catch (error) {
            return sendJson(false, 'Failed to get all subjects', error)
        }
    }


    @Get('/id/:id')
    async findOneById(@Param('id') id: string) {
        try {
            const subject = await this.subjectService.findOneById(id)
            return sendJson(true, 'Subject by id fetched', subject)
        } catch (error) {
            return sendJson(false, 'Failed to get subject by id', error)
        }
    }


    @Get('/subject/:subject')
    async findOneBySubject(@Param('subject') subject: string) {
        try {
            const BySubject = await this.subjectService.findOneBySubject(subject)
            return sendJson(true, 'Subject by subject fetched', BySubject)
        } catch (error) {
            return sendJson(false, 'Failed to get subject by subject', error)
        }
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post()
    async create(@Body() data: SubjectsDto) {
        try {
            const createSubject = await this.subjectService.create(data)
            return sendJson(true, 'Subject created successfully', createSubject)
        } catch (error) {
            return sendJson(false, 'Failed to create subject', error)
        }
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('/:id')
    async update(@Param('id') id: string, @Body() updateData: Partial<SubjectsDto>) {
        try {
            const subject = await this.subjectService.findOneById(id)

            if (!subject) {
                return sendJson(false, 'Subject not found', null)
            }

            const updatedSubject = await this.subjectService.update(id, updateData)

            return sendJson(true, 'Subject updated successfully', updatedSubject)

        } catch (error) {
            return sendJson(false, 'Failed to update subject', error)
        }
    }


    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Delete('/id/:id')
    async delete(@Param('id') id: string) {
        try {
            const result = await this.subjectService.delete(id)
            return sendJson(true, 'Subject deleted successfully', result)
        } catch (error) {
            return sendJson(false, 'Failed to delete subject', error)
        }
    }

}
