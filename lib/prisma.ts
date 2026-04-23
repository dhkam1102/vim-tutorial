import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const dbUrl = process.env.DATABASE_URL ?? ''
const separator = dbUrl.includes('?') ? '&' : '?'
const urlWithTimeout = dbUrl ? `${dbUrl}${separator}connect_timeout=5` : dbUrl

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: urlWithTimeout,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
