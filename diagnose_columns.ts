import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- CHECKING TRANSACTION TABLE COLUMNS ---');
    try {
        const tx = await prisma.transaction.findFirst();
        console.log('Sample transaction keys:', Object.keys(tx || {}));
    } catch (e: any) {
        console.error('Error fetching transactions:', e.message);
    }

    console.log('\n--- CHECKING INVESTMENT TABLE COLUMNS ---');
    try {
        const inv = await prisma.investment.findFirst();
        console.log('Sample investment keys:', Object.keys(inv || {}));
    } catch (e: any) {
        console.error('Error fetching investments:', e.message);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
