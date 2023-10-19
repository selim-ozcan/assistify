import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register({
      clients: [
        {
          name: 'AUTH_SERVICE',
          transport: Transport.TCP,
          options: { host: 'auth', port: 3003 },
        },
      ],
      isGlobal: true,
    }),
  ],
})
export class CommonAuthModule {}
