import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/product.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (env: ConfigService) => ({
        type: 'postgres',
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        username: env.get('DB_USER'),
        password: env.get('DB_PASS'),
        database: env.get('DB_NAME'),
        seeds: ['database/seeds/**/*{.ts,.js}'],
        factories: ['database/factories/**/*{.ts,.js}'],
        entities: [env.get('TYPE_ORM_ENTITIES')],
        // migrations: [env.get("TYPE_ORM_MIGRATIONS")],
        // cli: {
        //   migrationsDir: 'database/migration',
        // },
        // migrationsTableName: 'migrations',
        // migrationsRun: false,
        synchronize: true,
        logging: Boolean(env.get('DB_DEBUG')),
        logger: 'file',
      }),
    }),
    ProductModule,
    KafkaModule,

  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
