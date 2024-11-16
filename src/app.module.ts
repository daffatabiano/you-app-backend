import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';

@Module({
  imports: [MongooseModule.forRoot("mongodb+srv://daffatabianoo:Daffatabiano14@cluster0.mrv4i.mongodb.net/youapp?retryWrites=true&w=majority"), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
