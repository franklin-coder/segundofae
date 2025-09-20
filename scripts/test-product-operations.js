// scripts/test-product-operations.js
// Script para probar las operaciones de productos

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testHealthCheck() {
  console.log('\n=== Testing Health Check ===')
  try {
    const response = await fetch(`${BASE_URL}/api/health`)
    const data = await response.json()
    console.log('Health Check Status:', response.status)
    console.log('Health Check Data:', JSON.stringify(data, null, 2))
    return response.ok
  } catch (error) {
    console.error('Health Check Failed:', error.message)
    return false
  }
}

async function testProductCreation() {
  console.log('\n=== Testing Product Creation ===')
  
  const testProduct = {
    name: `Test Product ${Date.now()}`,
    price: 25.99,
    description: 'This is a test product created by the debugging script',
    longDescription: 'This is a longer description for the test product with more details about its features and benefits.',
    category: 'necklaces',
    images: [
      'https://i0.wp.com/athenshistorical.org/wp-content/uploads/woocommerce-placeholder.png?fit=600%2C600&ssl=1',
      'https://i.ytimg.com/vi/8wuLyuR5PFA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD1qlRNFkabLV20Ndvbt81FV8yjiw'
    ],
    featured: false,
    inStock: true,
    materials: ['Test Material 1', 'Test Material 2'],
    dimensions: 'Test dimensions',
    care_instructions: 'Test care instructions'
  }

  try {
    console.log('Creating product:', testProduct.name)
    const response = await fetch(`${BASE_URL}/api/products/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProduct),
    })

    const data = await response.json()
    console.log('Creation Response Status:', response.status)
    console.log('Creation Response Data:', JSON.stringify(data, null, 2))

    if (data.success && data.product) {
      console.log('✅ Product created successfully:', data.product.id)
      return data.product.id
    } else {
      console.log('❌ Product creation failed:', data.error)
      return null
    }
  } catch (error) {
    console.error('❌ Product Creation Error:', error.message)
    return null
  }
}

async function testProductRetrieval(productId) {
  console.log('\n=== Testing Product Retrieval ===')
  
  if (!productId) {
    console.log('⚠️ No product ID provided, skipping retrieval test')
    return false
  }

  try {
    console.log('Retrieving product:', productId)
    const response = await fetch(`${BASE_URL}/api/products/${productId}`)
    const data = await response.json()
    
    console.log('Retrieval Response Status:', response.status)
    console.log('Retrieval Response Data:', JSON.stringify(data, null, 2))

    if (data.success && data.product) {
      console.log('✅ Product retrieved successfully:', data.product.name)
      return true
    } else {
      console.log('❌ Product retrieval failed:', data.error)
      return false
    }
  } catch (error) {
    console.error('❌ Product Retrieval Error:', error.message)
    return false
  }
}

async function testFlexibleSearch() {
  console.log('\n=== Testing Flexible Search ===')
  
  // Test cases for flexible search
  const testCases = [
    'necklaces-933153',  // The problematic ID from the user's report
    'necklaces',         // Partial match
    'test',              // Name-based search
    'nonexistent-id'     // Should fail gracefully
  ]

  for (const testId of testCases) {
    try {
      console.log(`\nTesting search for: "${testId}"`)
      const response = await fetch(`${BASE_URL}/api/products/${testId}`)
      const data = await response.json()
      
      console.log(`Search Status for "${testId}":`, response.status)
      
      if (data.success) {
        console.log(`✅ Found product: ${data.product.id} (${data.product.name})`)
        console.log(`Search strategy: ${data.meta?.searchStrategy || 'unknown'}`)
      } else {
        console.log(`❌ Product not found: ${data.error}`)
      }
    } catch (error) {
      console.error(`❌ Search Error for "${testId}":`, error.message)
    }
  }
}

async function runAllTests() {
  console.log('🚀 Starting Product Operations Test Suite')
  console.log('Base URL:', BASE_URL)
  
  // Test 1: Health Check
  const healthOk = await testHealthCheck()
  
  // Test 2: Product Creation
  const productId = await testProductCreation()
  
  // Test 3: Product Retrieval
  const retrievalOk = await testProductRetrieval(productId)
  
  // Test 4: Flexible Search
  await testFlexibleSearch()
  
  // Summary
  console.log('\n=== Test Summary ===')
  console.log('Health Check:', healthOk ? '✅ PASS' : '❌ FAIL')
  console.log('Product Creation:', productId ? '✅ PASS' : '❌ FAIL')
  console.log('Product Retrieval:', retrievalOk ? '✅ PASS' : '❌ FAIL')
  
  if (healthOk && productId && retrievalOk) {
    console.log('\n🎉 All core tests passed!')
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above for details.')
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error)
}

module.exports = {
  testHealthCheck,
  testProductCreation,
  testProductRetrieval,
  testFlexibleSearch,
  runAllTests
}
