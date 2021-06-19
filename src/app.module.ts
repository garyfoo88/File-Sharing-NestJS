import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: "mongodb+srv://test:zzcjZysLNqoUbfyq@cluster0.fu0zw.mongodb.net/test?authSource=admin&replicaSet=atlas-13354n-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
        useCreateIndex: true,
      }),
    }),
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
