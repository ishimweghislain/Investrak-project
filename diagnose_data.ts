import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- USERS ---');
    const users = await prisma.user.findMany({
        select: { id: true, username: true, role: true }
    });
    console.log(JSON.stringify(users, null, 2));

    console.log('\n--- INVESTMENTS ---');
    const investments = await prisma.investment.findMany({
        include: {
            user: {
                select: { username: true }
            }
        }
    });
    console.log(JSON.stringify(investments, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
