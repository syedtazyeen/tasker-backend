import { getEnvPath } from '@/src/lib/utils';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: getEnvPath(),
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUri = process.env.MONGO_URI;
        const dbName = process.env.MONGO_DB_NAME;

        if (!mongoUri || !dbName) {
          throw new Error(
            'Mongo URI or DB name is not defined in environment variables',
          );
        }

        return {
          uri: mongoUri,
          dbName: dbName,
        };
      },
    }),
  ],
})
export class ConfigModule {}
