import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/finances/')({
  component: RouteComponent,
  staticData: {
    title: 'Finances',
  },
})

function RouteComponent() {
  return <div>Hello "/finances/"!</div>
}
