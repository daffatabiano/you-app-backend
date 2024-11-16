import { Controller, Get, Put, Body, Param, UseGuards,  Post  } from "@nestjs/common";
import { UsersService } from "./user.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { User } from "./user.schema";

@Controller('users')
export class UsersController {
    constructor( private readonly usersService: UsersService){}

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id : string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: User): Promise<User> {
        return this.usersService.update(id, updateUserDto);
    }

}
