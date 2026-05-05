import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const spkId = 'c9e6d0e4-de78-49ba-8820-b312c59d318e';
  
  console.log('Checking Work Order...');
  const wo = await prisma.workOrder.findUnique({
    where: { id: spkId },
    include: {
      customer: true,
      vehicle: true,
      assignedMechanic: true
    }
  });
  
  if (wo) {
    console.log('Work Order Found:', wo.orderNumber);
    console.log('Status:', wo.status);
    console.log('Customer:', wo.customer?.name);
    console.log('Vehicle:', wo.vehicle?.licensePlate);
    console.log('Mechanic:', wo.assignedMechanic?.name || 'UNASSIGNED');
  } else {
    console.log('Work Order NOT FOUND');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
