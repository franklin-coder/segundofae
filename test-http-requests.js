const http = require('http')

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Test-Script/1.0'
      }
    }

    console.log(`\n🔍 Testing: ${path}`)
    console.log('=' .repeat(50))

    const req = http.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        console.log(`📊 Status Code: ${res.statusCode}`)
        console.log(`📋 Headers:`, res.headers)
        
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data)
            console.log(`✅ Success: Found ${jsonData.products?.length || 0} products`)
            if (jsonData.products && jsonData.products.length > 0) {
              console.log('📦 Products:')
              jsonData.products.forEach(product => {
                console.log(`  - ${product.name} (${product.category})`)
              })
            }
            console.log(`🔍 Query info:`, jsonData.query)
          } catch (e) {
            console.log(`📄 Response (first 200 chars):`, data.substring(0, 200))
          }
        } else {
          console.log(`❌ Error Response:`, data)
        }
        
        resolve({ statusCode: res.statusCode, data })
      })
    })

    req.on('error', (err) => {
      console.log(`❌ Request failed:`, err.message)
      reject(err)
    })

    req.setTimeout(10000, () => {
      console.log(`⏰ Request timeout`)
      req.destroy()
      reject(new Error('Request timeout'))
    })

    req.end()
  })
}

async function testAllEndpoints() {
  console.log('🚀 Testing HTTP requests to API endpoints...\n')

  const testPaths = [
    '/api/products',
    '/api/products?category=all',
    '/api/products?category=necklaces',
    '/api/products?category=earrings', 
    '/api/products?category=bracelets',
    '/api/products?category=and-more',
    '/api/products?category=anklets',
    '/api/products?category=invalid-category'
  ]

  for (const path of testPaths) {
    try {
      await makeRequest(path)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second between requests
    } catch (error) {
      console.log(`❌ Failed to test ${path}:`, error.message)
    }
  }

  console.log('\n✅ All tests completed!')
}

// Check if server is running first
makeRequest('/api/health')
  .then(() => {
    console.log('🟢 Server is running, proceeding with tests...')
    return testAllEndpoints()
  })
  .catch(() => {
    console.log('🔴 Server is not running. Please start the server first with:')
    console.log('npm run dev')
    process.exit(1)
  })
