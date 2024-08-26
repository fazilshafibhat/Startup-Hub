import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, ModelDefinition } from '@nestjs/mongoose';
import { ConfigModule } from '../config/config.module'

@Module({
    // imports: [MongooseModule.forRoot('mongodb://127.0.0.1/udemymicro')]
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get('MONGODB_URI'),
                // uri:'mongodb://mongo:27017/udemymicro',
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {
    static forFeature(models: ModelDefinition[]) {
      return MongooseModule.forFeature(models);
    }
  }
