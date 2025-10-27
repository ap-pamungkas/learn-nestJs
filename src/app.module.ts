import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProjectsModule,

    // 2. MongooseModule: Menggunakan forRootAsync untuk membaca MONGO_URI
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configurationService: ConfigService) => {
        await Promise.resolve();

        return {
          uri: configurationService.get<string>('MONGO_URI'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
