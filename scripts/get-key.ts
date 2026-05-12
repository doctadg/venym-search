import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
    select: { id: true, email: true, apiKey: true, plan: true, credits: true }
  })
  console.log(JSON.stringify(users, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
