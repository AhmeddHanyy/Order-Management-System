import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super(); // Initialize PrismaClient
  }

  async onModuleInit() {
    try {
      await this.$connect(); // Connect to the database
      console.log('Prisma Client connected');
    } catch (error) {
      console.error('Error connecting to Prisma Client:', error);
      process.exit(1); // Exit the process if connection fails
    }
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Disconnect from the database when the module is destroyed
    console.log('Prisma Client disconnected');
  }
}
