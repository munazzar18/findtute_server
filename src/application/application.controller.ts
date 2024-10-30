import { Body, ClassSerializerInterceptor, Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { sendJson } from 'src/helpers/helpers';
import { StudentApplyDTO } from './application.dto';


@Controller('application')
export class ApplicationController {

    constructor(
        private readonly appliationService: ApplicationService
    ) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard)
    @Roles(Role.Student)
    @Post('student-apply')
    async studentApply(@Request() req, @Body() data: StudentApplyDTO) {
        const user = req.user
        const result = await this.appliationService.studentApplyOnApplication(user, data)
        return sendJson(true, 'Application submitted successfully', result)
    }

}
