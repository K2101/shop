import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, UserEntity, OrderEntity]),
    ClientsModule.register([
      {
        name: 'ORDER_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'ORDER',
            brokers: ['pkc-1dkx6.ap-southeast-1.aws.confluent.cloud:9092'],
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: 'QF3BLWOX3UWI3WL2',
              password:
                'kXgINuX3c7y2nnl4h53OKege7FRMHvuAx1bcbEwaSTD/jMh1B6Ej7B+E8+eEFq71',
            },
          },
          consumer: {
            groupId: 'ORDER_CONSUMER',
          },
        },
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        url: 'postgres://khumhiran1995:XYkwhMqIP0F7@ep-delicate-haze-821089.ap-southeast-1.aws.neon.tech/order',
        ssl: true,
        type: 'postgres',
        // host: 'localhost',
        // port: 5432,
        // username: 'postgres',
        // password: '123456',
        // database: 'order',
        autoLoadEntities: true,
        // must be false in production and use migration instead.
        synchronize: true,
        entities: [ProductEntity, UserEntity, OrderEntity],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
