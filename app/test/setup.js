import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Ensure we can stub fetch regardless of env support
beforeEach(() => {
  if (!global.fetch) {
    global.fetch = vi.fn()
  }
  if (!vi.isMockFunction(global.fetch)) {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true, service: 'test', time: '1970-01-01T00:00:00.000Z' })
    })
  } else {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true, service: 'test', time: '1970-01-01T00:00:00.000Z' })
      })
    )
  }
})

afterEach(() => {
  vi.restoreAllMocks()
})
