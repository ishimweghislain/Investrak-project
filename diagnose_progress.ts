import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- SIMULATING PROGRESS API ---');
    const investors = await prisma.user.findMany({
        where: { role: 'INVESTOR' },
        select: {
            id: true,
            username: true,
            profileImage: true,
            investments: {
                select: {
                    amount: true,
                    status: true
                }
            },
            transactions: {
                where: {
                    type: 'PAYMENT',
                    status: 'COMPLETED',
                    investmentId: { not: null }
                },
                select: {
                    amount: true
                }
            }
        }
    });

    console.log(`Found ${investors.length} investors`);

    const progressData = investors.map((user: any) => {
        const totalInvestment = user.investments.reduce((sum: number, inv: any) => sum + inv.amount, 0);
        const totalPaid = user.transactions.reduce((sum: number, tx: any) => sum + tx.amount, 0);
        const progress = totalInvestment > 0 ? Math.min(Math.round((totalPaid / totalInvestment) * 100 * 10) / 10, 100) : 0;

        return {
            id: user.id,
            username: user.username,
            totalInvestment,
            totalPaid,
            progress
        };
    });

    console.log(JSON.stringify(progressData, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
