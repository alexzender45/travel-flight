import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './app.errors';
import { AppModule } from './app.module';
import { EnvironmentService } from './configs';

class Server {
  private static env = EnvironmentService.getAll();
  public static async start(): Promise<void> {
    const app = await NestFactory.create(AppModule, { cors: true });

    Server.mountMiddlewares(app);
    Server.swaggerSetup(app);

    await app.listen(EnvironmentService.getValue('PORT'));
    await app.startAllMicroservices();
  }

  private static swaggerSetup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Thrillers Travels Service APIs')
      .setDescription('Thrillers Travels Service API Documentation')
      .setVersion('1.0')
      .addTag('thrillers-travels', 'Thrillers Travels APIs')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);
  }

  private static mountMiddlewares(app: INestApplication): void {
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe());
  }
}

Server.start().then();
