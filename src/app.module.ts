import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Property } from './entities/property.entity';
import { PropertyImage } from './entities/property-image.entity';
import { ViewingRequest } from './entities/viewing-request.entity';
import { ViewingLog } from './entities/viewing-log.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { ViewingRequestsModule } from './viewing-requests/viewing-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Property, PropertyImage, ViewingRequest, ViewingLog],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    PropertiesModule,
    ViewingRequestsModule,
  ],
})
export class AppModule {}