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
touch src/config/database.config.ts
```

## Add the configurations in database.config.ts

```typescript
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
export const typeormConfig = () => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  synchronize: false,
});

// Export the AppDataSource instance as well for direct use
export const AppDataSource = new DataSource(
  typeormConfig() as DataSourceOptions,
);
```

### Now Open app.module.ts <small>(or You main Module File )</small> and add the following configurations

```typescript
// import the ConfigModule and TypeOrmModule
import { ConfigModule } from '@nestjs/config';
import { AppDataSource, typeormConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    // Add this ConfigModule.forRoot() in your imports array
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => AppDataSource.options,
    }),

    // Your Other Modules Here
  ],
})
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
Email: [me@sanjay.works](mailto:me@sanjay.works)
