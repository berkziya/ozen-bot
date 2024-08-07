import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
declare const prisma: PrismaClient<{
    adapter: PrismaPg;
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export { prisma };
