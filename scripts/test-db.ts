
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        console.log('Testing DB connection...');
        await prisma.$connect();
        console.log('Connected.');

        console.log('Testing VerificationCode table...');
        const count = await prisma.verificationCode.count();
        console.log('VerificationCode count:', count);

        const testEmail = 'ishimweghislain82@gmail.com';
        const testCode = '12345';
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        console.log('Testing Insert...');
        const newCode = await prisma.verificationCode.create({
            data: {
                email: testEmail,
                code: testCode,
                expiresAt
            }
        });
        console.log('Insert successful:', newCode);

        console.log('Testing Delete...');
        await prisma.verificationCode.delete({ where: { id: newCode.id } });
        console.log('Delete successful.');

        console.log('All DB tests passed!');
    } catch (e) {
        console.error('DB TEST FAILED:', e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
