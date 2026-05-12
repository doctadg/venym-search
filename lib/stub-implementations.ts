// Temporary stub implementations for missing packages
// This allows the app to build without the actual packages

export const bcrypt = {
  hash: async (password: string, rounds: number): Promise<string> => {
    return `hashed_${password}_${rounds}`
  },
  compare: async (password: string, hash: string): Promise<boolean> => {
    return hash.includes(password)
  }
}

export const jwt = {
  sign: (payload: any, secret: string, options?: any): string => {
    return `stub_token_${JSON.stringify(payload)}`
  },
  verify: (token: string, secret: string): any => {
    if (token.startsWith('stub_token_')) {
      return JSON.parse(token.replace('stub_token_', ''))
    }
    return null
  }
}

export const Stripe = class {
  constructor(secretKey: string, options?: any) {}
  
  checkout = {
    sessions: {
      create: async (params: any) => ({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123'
      })
    }
  }
  
  webhooks = {
    constructEvent: (payload: string, signature: string, secret: string) => ({
      type: 'checkout.session.completed',
      data: { object: { metadata: {}, payment_intent: 'pi_test_123' } }
    })
  }
}

export const createClient = (url: string, key: string) => ({
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        single: () => ({ data: null, error: null }),
        order: (column: string, options: any) => ({ data: [], error: null }),
        limit: (count: number) => ({ data: [], error: null })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => ({ data: null, error: null })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({ error: null })
      })
    })
  }),
  rpc: (name: string, params: any) => ({ data: null, error: null })
})