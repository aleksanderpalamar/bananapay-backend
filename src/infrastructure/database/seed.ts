import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script para popular o banco de dados com dados de exemplo
 */
async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Cria usuários de exemplo
  const user1 = await prisma.user.upsert({
    where: { email: 'joao@example.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'joao@example.com',
      cpf: '12345678901'
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'maria@example.com' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'maria@example.com',
      cpf: '98765432100'
    }
  });

  console.log('✅ Usuários criados:', { user1, user2 });

  // Cria contatos de exemplo
  const contact1 = await prisma.contact.upsert({
    where: { 
      userId_name: {
        userId: user1.id,
        name: 'Mercado Central'
      }
    },
    update: {},
    create: {
      userId: user1.id,
      name: 'Mercado Central',
      pixKeys: {
        create: [
          {
            key: 'mercadocentral@example.com',
            keyType: 'EMAIL',
            isActive: true
          },
          {
            key: '11987654321',
            keyType: 'PHONE',
            isActive: true
          }
        ]
      }
    }
  });

  const contact2 = await prisma.contact.upsert({
    where: { 
      userId_name: {
        userId: user1.id,
        name: 'Padaria do Zé'
      }
    },
    update: {},
    create: {
      userId: user1.id,
      name: 'Padaria do Zé',
      pixKeys: {
        create: [
          {
            key: 'padariadoze@example.com',
            keyType: 'EMAIL',
            isActive: true
          }
        ]
      }
    }
  });

  console.log('✅ Contatos criados:', { contact1, contact2 });

  // Cria transações de exemplo
  const transaction1 = await prisma.transaction.upsert({
    where: { id: 'tx-example-1' },
    update: {},
    create: {
      id: 'tx-example-1',
      userId: user1.id,
      amount: 50.00,
      description: 'Compra no mercado',
      pixKey: 'mercadocentral@example.com',
      pixKeyType: 'EMAIL',
      status: 'EXECUTED',
      transactionType: 'IMMEDIATE',
      executedAt: new Date()
    }
  });

  const transaction2 = await prisma.transaction.upsert({
    where: { id: 'tx-example-2' },
    update: {},
    create: {
      id: 'tx-example-2',
      userId: user1.id,
      amount: 25.50,
      description: 'Pão e leite',
      pixKey: 'padariadoze@example.com',
      pixKeyType: 'EMAIL',
      status: 'PENDING',
      transactionType: 'IMMEDIATE'
    }
  });

  console.log('✅ Transações criadas:', { transaction1, transaction2 });

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 