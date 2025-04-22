import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/academics/')({
  component: RouteComponent,
  staticData: {
    title: 'Academics',
  },
})


function CourseCard(props: { name: string, code: string, progress: number, days: number, topic: string }) {
  return <Link to='/academics/course'>
    <Card>
      <CardHeader>
        <CardTitle>
          {props.code}
        </CardTitle>
        <CardDescription>
          {props.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-center gap-2'>
          <Progress value={props.progress} />
          <span className='text-xs'>{props.progress}%</span>
        </div>
      </CardContent>
      <CardFooter>
        <span className={cn('text-sm', props.days <= 2 ? 'text-destructive' : props.days <= 7 && 'text-yellow-500')}>{props.topic} - {props.days} days left</span>
      </CardFooter>
    </Card>
  </Link>
}

function RouteComponent() {
  return <div>
    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
      Academics
    </h2>
    <br />
    <div className='flex flex-col gap-3'>
      <CourseCard code='BITS F364' name='Human Computer Interaction' progress={75} topic="Assignment" days={2} />
      <CourseCard code='CS F303' name='Computer Networks' progress={50} topic="Quiz" days={4} />
      <CourseCard code='CS F363' name='Compiler Construction' progress={42} topic="Quiz" days={12} />
      <CourseCard code='CS F364' name='Design & Analysis of Algo' progress={33} topic="Compre" days={16} />
    </div>
  </div>
}
