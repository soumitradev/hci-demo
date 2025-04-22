import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
      Connected Services
    </h2>
    <p className="text-sm text-muted-foreground leading-7 [&:not(:first-child)]:mt-6">
      List of services connect to Lex to better track productivity and monitor additional data.
    </p>
    <br />
    <Accordion type='single' collapsible className='w-full'>
      <AccordionItem value='1'>
        <AccordionTrigger>
          SWD Pay
        </AccordionTrigger>
        <AccordionContent>
          <Button className='w-full'>Connect with your SWD account</Button>
          <p className='text-sm text-muted-foreground mt-2'>
            SWD Pay is a payment gateway for BITS students to pay for various facilities around campus.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='2'>
        <AccordionTrigger>
          Google Fit
        </AccordionTrigger>
        <AccordionContent>
          <Button className='w-full'>Connect with your Google Fit account</Button>
          <p className='text-sm text-muted-foreground mt-2'>
            Google Fit is a health-tracking platform that collects data from various devices and apps.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='3'>
        <AccordionTrigger>
          Google Calendar
        </AccordionTrigger>
        <AccordionContent>
          <Button className='w-full'>Connect with your Google Calendar account</Button>
          <p className='text-sm text-muted-foreground mt-2'>
            Google Calendar is a time-management and scheduling calendar service developed by Google.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='4'>
        <AccordionTrigger>
          Chronofactorem
        </AccordionTrigger>
        <AccordionContent>
          <Button className='w-full'>Connect with your Chronofactorem account</Button>
          <p className='text-sm text-muted-foreground mt-2'>
            Chronofactorem allows you to quickly import your timetable from BITS into Lex.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
}
