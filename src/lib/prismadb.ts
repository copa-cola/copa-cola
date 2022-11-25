import { PrismaClient } from "@prisma/client"

declare global {
  var prismaInstance: PrismaClient | undefined
}

const client = globalThis.prismaInstance || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prismaInstance = client

const prisma = client

export { prisma }

export default client