import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CommonAuthModule, DatabaseModule } from '@soassistify/common';
import { LoggerModule } from '@soassistify/common';
import { UserDocument, UserSchema } from 'src/users/models/user.schema';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    CommonAuthModule,
    DatabaseModule.forRoot(),
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
