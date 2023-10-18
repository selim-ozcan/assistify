import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@soassistify/common';
import { LoggerModule } from '@soassistify/common';
import { UserDocument, UserSchema } from 'src/models/user.schema';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    DatabaseModule.forRoot(ConfigService),
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
