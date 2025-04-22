import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Route as SettingsRoute } from './settings'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className='flex flex-col items-center justify-center min-h-svh'>
      <h1 className='text-6xl'>Lex</h1>
      <br />
      <Button>
        <Link to={SettingsRoute.to}>
          Login with BITS GMail
        </Link>
      </Button>
    </main>
  )
}
