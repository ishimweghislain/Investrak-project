import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const username = 'Kayitesi';
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        console.log('User not found');
        return;
    }

    const inv = await prisma.investment.findFirst({ where: { userId: user.id } });
    if (!inv) {
        console.log('Investment not found');
        return;
    }

    console.log(`Trying to create transaction for ${username} (Inv: ${inv.id})...`);
    try {
        const tx = await prisma.transaction.create({
            data: {
                type: 'PAYMENT',
                amount: 1000,
                status: 'COMPLETED',
                description: 'Test payment',
                userId: user.id,
                investmentId: inv.id,
                date: new Date()
            }
        });
        console.log('Success! Created transaction:', tx.id);
    } catch (e: any) {
        console.error('FAILED to create transaction!');
        console.error(e);
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
