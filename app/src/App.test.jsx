import { render, screen } from '@testing-library/react'
import App from './App.jsx'

test('renders app title', async () => {
  render(<App />)
  expect(await screen.findByRole('heading', { name: /caseeno blackjack/i })).toBeInTheDocument()
})
