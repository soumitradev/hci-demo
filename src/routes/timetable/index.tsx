import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/timetable/')({
  component: RouteComponent,
  staticData: {
    title: 'Timetable',
  },
})

function RouteComponent() {
  return <div>Hello "/timetable/"!</div>
}
