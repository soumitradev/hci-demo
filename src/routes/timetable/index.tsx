import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/timetable/')({
  component: RouteComponent,
  staticData: {
    title: 'Timetable',
  },
})

type Event = {
  id: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  category: "CS F213" | "CS F214" | "CS F222" | "Other";
  color: string;
};

const events = [
  {
    id: "1",
    title: "CS F213 L1",
    location: "F-102",
    startTime: "09:00",
    endTime: "10:00",
    category: "CS F213",
    color: "hsl(var(--primary))"
  },
  {
    id: "2",
    title: "CS F213 L2",
    location: "F-105",
    startTime: "14:00",
    endTime: "15:00",
    category: "CS F213",
    color: "hsl(var(--primary))"
  },
  {
    id: "3",
    title: "CS F213 Tutorial",
    location: "F-203",
    startTime: "11:00",
    endTime: "12:00",
    category: "CS F213",
    color: "hsl(var(--primary))"
  },
  {
    id: "4",
    title: "CS F214 L1",
    location: "F-104",
    startTime: "10:00",
    endTime: "11:00",
    category: "CS F214",
    color: "hsl(var(--primary))"
  },
  {
    id: "5",
    title: "CS F214 L2",
    location: "F-102",
    startTime: "15:00",
    endTime: "16:00",
    category: "CS F214",
    color: "hsl(var(--primary))"
  },
  {
    id: "6",
    title: "CS F214 Lab",
    location: "SWLab",
    startTime: "16:00",
    endTime: "19:00",
    category: "CS F214",
    color: "hsl(var(--primary))"
  },
  {
    id: "7",
    title: "CS F222 L1",
    location: "F-103",
    startTime: "12:00",
    endTime: "13:00",
    category: "CS F222",
    color: "hsl(var(--primary))"
  },
  {
    id: "8",
    title: "CS F222 L2",
    location: "F-105",
    startTime: "09:00",
    endTime: "10:00",
    category: "CS F222",
    color: "hsl(var(--primary))"
  },
  {
    id: "9",
    title: "CS F222 Tutorial",
    location: "F-201",
    startTime: "13:00",
    endTime: "14:00",
    category: "CS F222",
    color: "hsl(var(--primary))"
  },
  {
    id: "10",
    title: "ISRO Panel Talk",
    location: "F-102",
    startTime: "14:00",
    endTime: "15:00",
    category: "Other",
    color: "hsl(var(--primary))"
  },
  {
    id: "11",
    title: "DE Shaw OA",
    location: "Online",
    startTime: "14:00",
    endTime: "15:00",
    category: "Other",
    color: "hsl(var(--primary))"
  },
  {
    id: "12",
    title: "Club Review Meet",
    location: "NEW FOOTBALL GROUND",
    startTime: "16:00",
    endTime: "17:00",
    category: "Other",
    color: "hsl(var(--success))"
  }
];


// Helper function to convert time string to minutes since start of day
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to check if events overlap
const doEventsOverlap = (event1: Event, event2: Event) => {
  const start1 = timeToMinutes(event1.startTime);
  const end1 = timeToMinutes(event1.endTime);
  const start2 = timeToMinutes(event2.startTime);
  const end2 = timeToMinutes(event2.endTime);

  return start1 < end2 && start2 < end1;
};

// Helper function to group overlapping events
const groupOverlappingEvents = (events: Event[]) => {
  // Sort events by start time to ensure consistent grouping
  const sortedEvents = [...events].sort((a, b) =>
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  const groups: Event[][] = [];

  sortedEvents.forEach(event => {
    // Find a group where this event overlaps with any existing event
    const overlappingGroup = groups.find(group =>
      group.some(groupEvent => doEventsOverlap(event, groupEvent))
    );

    if (overlappingGroup) {
      overlappingGroup.push(event);
      // Sort the group by start time
      overlappingGroup.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    } else {
      groups.push([event]);
    }
  });

  return groups;
};

const earliestHour = 8; // 8 AM

const calculateEventPosition = (event: Event) => {
  const [startHours, startMinutes] = event.startTime.split(':').map(Number);
  const [endHours, endMinutes] = event.endTime.split(':').map(Number);

  const startInMinutes = startHours * 60 + startMinutes;
  const endInMinutes = endHours * 60 + endMinutes;
  const durationInMinutes = endInMinutes - startInMinutes;

  const startHour = startHours - earliestHour;
  const top = (startHour * 64) + (startMinutes / 60 * 64);
  const height = (durationInMinutes / 60) * 64;

  return { top, height };
};


function RouteComponent() {

  const [currentTime, setCurrentTime] = useState(new Date());

  // Get unique categories from events
  const availableCategories = Array.from(new Set(events.map(event => event.category)));


  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);


  const filteredEvents = events.filter(event =>
    new Set(availableCategories).has(event.category)
  );

  // Group overlapping events
  // @ts-ignore
  const eventGroups = groupOverlappingEvents(filteredEvents);

  // Calculate the time range based on events
  const eventTimes = filteredEvents.flatMap(event => [
    parseInt(event.startTime.split(':')[0]),
    parseInt(event.endTime.split(':')[0])
  ]);

  const earliestHour = Math.max(6, Math.min(8, ...eventTimes)) // Default to 8 AM if no earlier events
  const latestHour = Math.min(24, Math.max(20, ...eventTimes)) // Default to 8 PM if no later events

  const timeSlots = Array.from(
    { length: latestHour - earliestHour + 1 },
    (_, i) => {
      const hour = (i + earliestHour) % 12 || 12;
      const period = i + earliestHour < 12 ? "AM" : "PM";
      return `${hour} ${period}`;
    }
  );

  // Format current time for display
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}`;

  // Calculate position for current time indicator
  const currentHourOffset = hours - earliestHour;
  const currentMinuteOffset = minutes / 60;
  const timeIndicatorTop = (currentHourOffset + currentMinuteOffset) * 64;

  // Only show time indicator if current time is within the visible range
  const showTimeIndicator = hours >= earliestHour && hours <= latestHour;


  return <div>
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto relative">
        {showTimeIndicator && (
          <div
            className="absolute w-full"
            style={{
              top: `${timeIndicatorTop}px`,
              zIndex: 50
            }}
          >
            <div className="flex items-center">
              <div className="w-16 relative">
                <span className="absolute right-1 -translate-y-1/2 text-xs font-medium text-destructive bg-background pl-2 pr-1">{formattedTime}</span>
              </div>
              <div className="flex-1 h-0.5 bg-destructive"></div>
            </div>
          </div>
        )}

        {/* Time slots */}
        <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col bg-background z-10">
          {timeSlots.map((time, i) => (
            <div key={i} className="h-16 border-b border-border">
              <div className="h-full flex items-start pt-0 px-4">
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Grid and events */}
        <div className="ml-16 relative -mt-4">
          {/* Hour grid lines */}
          <div className="relative">
            {timeSlots.map((_, i) => (
              <div key={i} className="h-16 border-b border-border" />
            ))}

            {/* Events */}
            <div className="absolute inset-0">
              {eventGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="relative">
                  {group.map((event, eventIndex) => {
                    const { top, height } = calculateEventPosition(event);
                    const width = 100 / group.length;
                    const left = (eventIndex * width);

                    let bgColorClass = "bg-orange-500";
                    switch (event.category) {
                      case 'CS F213':
                        bgColorClass = "bg-blue-500";
                        break;
                      case 'CS F214':
                        bgColorClass = "bg-emerald-500";
                        break;
                      case 'CS F222':
                        bgColorClass = "bg-violet-500";
                        break;
                    }

                    return (
                      <div
                        key={`${groupIndex}-${eventIndex}`}
                        className="absolute px-0.5"
                        style={{
                          top: `${top}px`,
                          left: `${left}%`,
                          width: `${width}%`,
                          padding: '1px'
                        }}
                      >
                        <div
                          className={`rounded-lg p-2 shadow-sm ${bgColorClass}`}
                          style={{
                            height: `${height - 4}px`,
                            opacity: 0.9,
                            margin: '1px'
                          }}
                        >
                          <div className="h-full flex flex-col">
                            <h3 className="font-medium text-sm text-white line-clamp-1">{event.title}</h3>
                            <p className="text-xs text-white/90">{event.location}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}
