const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function diagnoseIssue() {
  console.log('🔍 DIAGNOSTIC REPORT - CRUD Issue Analysis')
  console.log('=' .repeat(60))

  // 1. Test database connection
  console.log('\n1️⃣ Testing database connection...')
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful')
  } catch (error) {
    console.log('❌ Database connection failed:', error.message)
    return
  }

  // 2. Check database schema
  console.log('\n2️⃣ Checking database schema...')
  try {
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Product' 
      ORDER BY ordinal_position;
    `
    console.log('📋 Product table schema:')
    console.table(result)
  } catch (error) {
    console.log('❌ Schema check failed:', error.message)
  }

  // 3. Check existing data
  console.log('\n3️⃣ Checking existing data...')
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        created_at: true
      }
    })
    console.log('📦 Products in database:')
    console.table(products)
  } catch (error) {
    console.log('❌ Data check failed:', error.message)
  }

  // 4. Test category queries individually
  console.log('\n4️⃣ Testing individual category queries...')
  const categories = ['necklaces', 'earrings', 'bracelets', 'anklets']
  
  for (const category of categories) {
    try {
      console.log(`\n🔍 Testing category: ${category}`)
      const products = await prisma.product.findMany({
        where: { category: category }
      })
      console.log(`✅ Found ${products.length} products in category '${category}'`)
      
      if (products.length > 0) {
        products.forEach(p => console.log(`  - ${p.name}`))
      }
    } catch (error) {
      console.log(`❌ Query failed for category '${category}':`, error.message)
      console.log('Stack:', error.stack)
    }
  }

  // 5. Test the exact API logic
  console.log('\n5️⃣ Testing API logic simulation...')
  
  const testScenarios = [
    { url: '/api/products', category: null },
    { url: '/api/products?category=necklaces', category: 'necklaces' },
    { url: '/api/products?category=and-more', category: 'and-more' }
  ]

  for (const scenario of testScenarios) {
    try {
      console.log(`\n🧪 Scenario: ${scenario.url}`)
      
      // Simulate API logic
      const where = {}
      const category = scenario.category

      if (category && category !== 'all') {
        const categoryMap = {
          'and-more': 'anklets',
          'necklaces': 'necklaces',
          'earrings': 'earrings',
          'bracelets': 'bracelets'
        }
        
        const mappedCategory = categoryMap[category] || category
        where.category = mappedCategory
        console.log(`🔄 Mapped '${category}' to '${mappedCategory}'`)
      }

      console.log(`🔍 Query where:`, where)

      const products = await prisma.product.findMany({
        where,
        orderBy: { created_at: 'desc' }
      })

      console.log(`✅ Query successful: ${products.length} products found`)
      
    } catch (error) {
      console.log(`❌ API simulation failed:`, error.message)
      console.log('Error details:', error)
    }
  }

  // 6. Test potential edge cases
  console.log('\n6️⃣ Testing edge cases...')
  
  try {
    // Test with undefined category
    console.log('🧪 Testing undefined category...')
    const result1 = await prisma.product.findMany({
      where: { category: undefined }
    })
    console.log(`✅ Undefined category: ${result1.length} products`)
    
    // Test with empty where clause
    console.log('🧪 Testing empty where clause...')
    const result2 = await prisma.product.findMany({
      where: {}
    })
    console.log(`✅ Empty where: ${result2.length} products`)
    
    // Test with invalid category
    console.log('🧪 Testing invalid category...')
    const result3 = await prisma.product.findMany({
      where: { category: 'invalid-category' }
    })
    console.log(`✅ Invalid category: ${result3.length} products`)
    
  } catch (error) {
    console.log(`❌ Edge case test failed:`, error.message)
  }

  console.log('\n✅ DIAGNOSTIC COMPLETE')
}

diagnoseIssue()
  .catch((e) => {
    console.error('❌ Diagnostic failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
