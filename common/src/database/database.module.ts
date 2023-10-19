import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            uri: configService.get('MONGODB_URI'),
          }),
          inject: [ConfigService],
        }),
      ],
    };
  }

  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
