import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

describe('Database Integration Tests', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should connect to database', async () => {
    const result = await prisma.$queryRaw`SELECT 1 as result`
    expect(result).toBeDefined()
  })

  it('should create a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        passwordHash: 'test_hash',
        name: 'Test User',
      },
    })

    expect(user).toBeDefined()
    expect(user.email).toContain('test-')

    // Cleanup
    await prisma.user.delete({ where: { id: user.id } })
  })

  it('should create a product with MTG card', async () => {
    const product = await prisma.product.create({
      data: {
        type: 'MTG_SINGLE',
        name: 'Test Card',
        slug: `test-card-${Date.now()}`,
        category: 'Magic: The Gathering',
        mtgCard: {
          create: {
            scryfallId: `test-${Date.now()}`,
            oracleId: `oracle-${Date.now()}`,
            setCode: 'TEST',
            setName: 'Test Set',
            collectorNumber: '1',
            rarity: 'common',
            manaCost: '{1}',
            cmc: 1,
            colors: [],
            colorIdentity: [],
            typeLine: 'Artifact',
            legalities: {},
          },
        },
      },
      include: {
        mtgCard: true,
      },
    })

    expect(product.mtgCard).toBeDefined()
    expect(product.mtgCard?.setCode).toBe('TEST')

    // Cleanup
    await prisma.product.delete({ where: { id: product.id } })
  })
})