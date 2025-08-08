import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Basic fetch mock to avoid real network during tests
if (!global.fetch) {
  global.fetch = vi.fn()
}

beforeEach(() => {
  global.fetch.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ok: true, service: 'test', time: '1970-01-01T00:00:00.000Z' })
    })
  )
})

afterEach(() => {
  vi.clearAllMocks()
})
