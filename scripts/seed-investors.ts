
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up existing investors...');

    // Find all users with role INVESTOR
    const investors = await prisma.user.findMany({
        where: { role: 'INVESTOR' }
    });

    for (const investor of investors) {
        console.log(`Deleting investor: ${investor.username}`);

        // Delete related records
        const investments = await prisma.investment.findMany({ where: { userId: investor.id } });
        const investmentIds = investments.map(inv => inv.id);

        await prisma.return.deleteMany({ where: { investmentId: { in: investmentIds } } });
        await prisma.investment.deleteMany({ where: { userId: investor.id } });
        await prisma.transaction.deleteMany({ where: { userId: investor.id } });
        await prisma.report.deleteMany({ where: { userId: investor.id } });
        await prisma.notification.deleteMany({ where: { userId: investor.id } });
        await prisma.auditLog.deleteMany({ where: { userId: investor.id } });

        await prisma.user.delete({ where: { id: investor.id } });
    }

    console.log('Seeding 12 new investors...');

    const rwandanNames = [
        'Mugisha', 'Keza', 'Ishimwe', 'Kalisa',
        'Uwase', 'Gasana', 'Umutoni', 'Habimana',
        'Murenzi', 'Ganza', 'Rugamba', 'Kayitesi'
    ];

    const images = [
        '/images/investor1.png', '/images/investor2.png', '/images/investor3.png', '/images/investor4.png',
        '/images/images (1).jpg', '/images/investor6.png', '/images/images (2).jpg', '/images/investor8.png',
        '/images/images (3).jpg', '/images/investor10.png', '/images/images (4).jpg', '/images/investor12.png'
    ];

    const hashedPassword = await bcrypt.hash('123', 10);

    for (let i = 0; i < 12; i++) {
        const name = rwandanNames[i];
        const email = `${name.toLowerCase()}@gmail.com`;

        await prisma.user.create({
            data: {
                username: name,
                email: email,
                password: hashedPassword,
                company: 'Spark holding group',
                profileImage: images[i],
                role: 'INVESTOR'
            }
        });
        console.log(`Created investor: ${name}`);
    }

    // Ensure at least one admin exists
    const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!adminExists) {
        await prisma.user.create({
            data: {
                username: 'admin',
                email: 'admin@spark.rw',
                password: await bcrypt.hash('admin123', 10),
                role: 'ADMIN',
                company: 'Spark Leadership'
            }
        });
        console.log('Created default admin.');
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
