# Setup NestJs with PG & TypeORM

## Install NestJs

```bash
npm i -g @nestjs/cli
nest new project-name
```

## Install TypeORM

```bash
npm i @nestjs/typeorm typeorm pg dotenv @nestjs/config
```

## Create .env file

```bash
DB_HOST=localhost # or your host
DB_PORT=5432 # or your port
DB_USERNAME=your-username  # or your username
DB_PASSWORD=your-password # or your password
DB_DATABASE=your-database # or your database
```

## Now Create Database Config File

```bash
mkdir -p src/config && touch src/config/database.config.ts

# If not working, try this manual
# mkdir src/config
# touch src/config/database.config.ts

```

## Add the configurations in database.config.ts

```typescript
// src/config/database.config.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const typeormConfig = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  synchronize: false,
});

export const AppDataSource = new DataSource(typeormConfig(new ConfigService()));

```

### Now Open app.module.ts <small>(or Your main Module File)</small> and add the following configurations

```typescript
// import the ConfigModule and TypeOrmModule
import { ConfigModule } from '@nestjs/config';
import { AppDataSource, typeormConfig } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

ConfigModule.forRoot({
  isGlobal: true,
}),
TypeOrmModule.forRootAsync({
  useFactory: async (configService: ConfigService) => {
    const dataSourceOptions = typeormConfig(configService);
    return {
      ...dataSourceOptions,
      entities: [User], // Add your entities here
    };
  },
  inject: [ConfigService],
}),
```

## Bonus Tip for TypeORM Migration

### Add the following scripts in your package.json

```json
"scripts": {
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
    "migration:run": "npm run typeorm -- migration:run -d ./src/config/database.config.ts",
    "migration:generate": "npm run typeorm -- migration:generate ./src/migrations/$npm_config_name -d ./src/config/database.config.ts",
    "migration:create": "npm run typeorm -- migration:create ./src/migrations/$npm_config_name",
    "migration:revert": "npm run typeorm -- migration:revert -d ./src/config/database.config.ts"
  }
```

#### Migration Usage Guide

```bash
# Create New Migration
npm run migration:create your-migration-name

# Generate Migration
npm run migration:generate your-migration-name

# Run Migration
npm run migration:run

# Revert Migration
npm run migration:revert
```

## That's it. You are good to go. Happy Coding!

Author: [Sanjay Kumar](https://sanjay.works)
Email: [Mail Me](mailto:sanjaykm.live@gmail.com)
