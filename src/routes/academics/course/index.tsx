import { Button } from '@/components/ui/button'
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createFileRoute } from '@tanstack/react-router'
import { LucideEllipsisVertical, LucidePlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/academics/course/')({
  component: RouteComponent,
})

function HandoutProgress() {
  const steps = [
    {
      step: 1,
      title: "To gain an overview of the course",
      description: "-",
    },
    {
      step: 2,
      title: "To learn the history of HCI",
      description: "R3 ch1",
    },
    {
      step: 3,
      title: "To learn about design of everyday objects",
      description: "T2 ch1",
    },
    {
      step: 4,
      title: "To learn about Human Centred Design",
      description: "T2 ch6",
    },
    {
      step: 5,
      title: "Peer learning",
      description: "-",
    },
    {
      step: 6,
      title: "To learn about the psychology behind human actions",
      description: "T2 ch 2, 3",
    }
  ];

  return <Stepper defaultValue={3} orientation="vertical">
    {steps.map(({ step, title, description }) => (
      <StepperItem
        key={step}
        step={step}
        className="relative items-start [&:not(:last-child)]:flex-1"
      >
        <StepperTrigger className="items-start pb-6 last:pb-0">
          <StepperIndicator />
          <div className="mt-0.5 space-y-0.5 px-2 text-left">
            <StepperTitle>{title}</StepperTitle>
            <StepperDescription>{description}</StepperDescription>
          </div>
        </StepperTrigger>
        {step < steps.length && (
          <StepperSeparator className="absolute inset-y-0 left-3 top-[calc(1.5rem+0.125rem)] -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
        )}
      </StepperItem>
    ))}
  </Stepper>
}

function HandoutProgressButton() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60); // 12 hours in seconds

  useEffect(() => {
    let timer: number;
    if (isCompleted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsCompleted(false);
            return 12 * 60 * 60; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCompleted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <Button
      className="w-full"
      disabled={isCompleted}
      onClick={() => setIsCompleted(true)}
    >
      {isCompleted
        ? `Chill for (${formatTime(timeLeft)}) to continue`
        : "Mark current step as completed"}
    </Button>
  );
}

function RouteComponent() {
  return <div>
    <p className='text-foreground-muted'>BITS F364</p>
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      Human Computer Interaction
    </h2>
    <br />
    <div className='flex items-center justify-between'>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Important Dates
      </h3>
      <Button size="icon" variant="ghost">
        <LucidePlusCircle />
      </Button>
    </div>
    <Table>
      <TableHeader>
        <TableHead>Event</TableHead>
        <TableHead>Date</TableHead>
        <TableHead className='w-4'></TableHead>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <del>Quiz 1</del>
          </TableCell>
          <TableCell>Feb 18, 2025</TableCell>
          <TableCell>
            <LucideEllipsisVertical className='size-4' />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <del>Midsem</del>
          </TableCell>
          <TableCell>Mar 6, 2025</TableCell>
          <TableCell>
            <LucideEllipsisVertical className='size-4' />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Assignment
          </TableCell>
          <TableCell>April 22, 2025</TableCell>
          <TableCell>
            <LucideEllipsisVertical className='size-4' />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Compre
          </TableCell>
          <TableCell>April 22, 2025</TableCell>
          <TableCell>
            <LucideEllipsisVertical className='size-4' />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <br />
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      Progress
    </h3>
    <div className='max-h-64 overflow-y-auto my-6'>
      <HandoutProgress />
    </div>
    <HandoutProgressButton />
  </div>
}
