describe('Example Integration Tests', () => {
  it('should pass integration test', () => {
    // Simple test that doesn't need database
    const result = processOrder({ items: [], total: 0 })
    expect(result).toBeDefined()
  })
})

// Dummy function for testing
function processOrder(order: { items: unknown[], total: number }) {
  return {
    ...order,
    processed: true,
    timestamp: new Date().toISOString(),
  }
}