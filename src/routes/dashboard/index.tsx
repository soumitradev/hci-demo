import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardTitle } from '@/components/ui/card'
import { ShineBorder } from '@/components/ui/shine-border'
import { createFileRoute, Link } from '@tanstack/react-router'
import { LucideBook, LucideHeartPulse, LucideWallet } from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      Welcome back, <span className='text-primary'>Mudit</span>
    </h1>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
      Here is your progress for today!
    </p>
    <br />
    <div className='grid grid-cols-2 gap-4'>

      <Link to='/leaderboard' className='col-span-2'>
        <Alert className='relative overflow-hidden'>
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
          <AlertTitle className='text-lg'>#4</AlertTitle>
          <AlertDescription className='inline'>
            You're are doing better than <b>93%</b> of other students!
          </AlertDescription>
        </Alert>
      </Link>
      <Link to='/academics'>
        <Card className='p-4'>
          <div className='flex justify-between items-center'>
            <LucideBook className='size-8' />
            <span>227PP</span>
          </div>
          <CardTitle>Academics</CardTitle>
        </Card>
      </Link>
      <Link to='/fitness'>
        <Card className='p-4'>
          <div className='flex justify-between items-center'>
            <LucideHeartPulse className='size-8' />
            <span>120PP</span>
          </div>
          <CardTitle>Fitness</CardTitle>
        </Card>
      </Link>
      <Link to='/finances' className='col-span-2'>
        <Card className='p-4'>
          <div className='flex justify-between items-center'>
            <LucideWallet className='size-8' />
            <span>₹4,829/<span className='text-sm text-foreground-muted'>₹5,000</span></span>
          </div>
          <CardTitle>Finances</CardTitle>
        </Card>
      </Link>
      <Card className='p-4 col-span-2'>
        <CardTitle>Today's Schedule</CardTitle>
        <div className='grid grid-cols-2 items-center gap-2'>
          <span>14:00</span>
          <div>
            <p>CS F213 L2</p>
            <span className='text-sm text-muted-foreground'>F105</span>
          </div>
          <span>15:00</span>
          <div>
            <p>ISRO Panel Talk</p>
            <span className='text-sm text-muted-foreground'>F102</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
}
