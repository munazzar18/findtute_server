import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role.guard';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/role.decorator';
import { sendJson } from 'src/helpers/helpers';
import { UserEntity } from 'src/user/user.entity';
import { ProfileDto } from './profile.dto';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('profile')
@ApiTags('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) { }


    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    async findAll() {
        const allProfiles = await this.profileService.findAll()
        return sendJson(true, 'All Profiles', allProfiles)
    }


    @Get('/id/:id')
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    async findOneById(@Param('id') id: string) {
        const profile = await this.profileService.findOneById(id)
        if (profile && profile !== null) {
            return sendJson(true, 'Profile by id fetched', profile)
        }
        else {
            return sendJson(false, 'Profile not found', null)
        }
    }


    @Get('/user-profile/:id')
    async findOneByUserId(@Request() req) {
        try {
            const user_id: UserEntity = req.user
            const profile = await this.profileService.findOneByUserId(user_id.id)
            return profile

        } catch (error) {
            console.log(error)
            return sendJson(false, 'Profile by user id fetch failed', error)
        }
    }


    @Post('create')
    async createProfile(@Body() data: ProfileDto, @Request() req) {
        try {
            const user_id: UserEntity = req.user
            const profile = await this.profileService.create(data, user_id)
            return sendJson(true, 'Profile created successfully', profile)
        } catch (error) {
            console.log(error)
            return sendJson(false, 'Profile creation failed', error)
        }

    }


    @Put('/update/:id')
    async updateProfile(@Param('id') id: string, @Body() data: ProfileDto, @Request() req) {
        try {
            const user_id: UserEntity = req.user
            const profile = await this.profileService.update(id, data, user_id)
            return sendJson(true, 'Profile updated successfully', profile)
        } catch (error) {
            console.log(error)
            return sendJson(false, 'Profile update failed', error)
        }
    }

    @Put('refresh-profile/:id')
    async refreshProfile(@Param('id') id: string, @Body() data: ProfileDto, @Request() req) {
        try {
            const user_id: UserEntity = req.user
            const profile = await this.profileService.updateDeleted(id, data, user_id)
            return sendJson(true, 'Profile refreshed successfully', profile)
        } catch (error) {
            console.log(error)
            return sendJson(false, 'Profile refresh failed', error)
        }
    }


    @Delete('/delete/:id')
    async deleteProfile(@Param('id') id: string, @Request() req) {
        try {
            const user_id: UserEntity = req.user
            const profile = await this.profileService.delete(id, user_id)
            return sendJson(true, 'Profile deleted successfully', profile)
        } catch (error) {
            console.log(error)
            return sendJson(false, 'Profile deletion failed', error)
        }
    }



}
