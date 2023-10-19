import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'src/constants/services';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: AUTH_SERVICE,
          useFactory: (configService: ConfigService) => {
            return {
              transport: Transport.TCP,
              options: {
                host: configService.get('AUTH_TCP_HOST'),
                port: +configService.get('AUTH_TCP_PORT'),
              },
            };
          },
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
  ],
})
export class CommonAuthModule {}
