import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.schema";
import { UsersService } from "./user.service";
import { UsersController } from "./user.controller";

@Module({
    imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})

export class UsersModule {}