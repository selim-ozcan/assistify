import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'AUTH_SERVICE',
          useFactory: (configService: ConfigService) => {
            return {
              transport: Transport.TCP,
              options: {
                host: configService.get('AUTH_SERVICE_TCP_HOST'),
                port: +configService.get('AUTH_SERVICE_TCP_PORT'),
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
