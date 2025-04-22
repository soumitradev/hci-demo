import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/fitness/')({
  component: RouteComponent,
  staticData: {
    title: 'Fitness',
  },
})

function RouteComponent() {
  return <div>Hello "/fitness/"!</div>
}
