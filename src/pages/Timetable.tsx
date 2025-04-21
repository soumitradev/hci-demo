import { useState, useEffect } from "react";
import { Plus, ChevronLeft } from "lucide-react";
import { useTimetableStore, Event } from "../stores/timetableStore";
import { useNavigate } from 'react-router-dom';
import AddEventModal from "../components/AddEventModal";
import { Button } from "../components/ui/button";

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


export default function TimetablePage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const events = useTimetableStore((state) => state.events);
  const addEvent = useTimetableStore((state) => state.addEvent);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Get unique categories from events
  const availableCategories = Array.from(new Set(events.map(event => event.category)));
  
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(availableCategories)
  );

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const toggleCategory = (category: string) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  const filteredEvents = events.filter(event => 
    selectedCategories.has(event.category)
  );

  // Group overlapping events
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

  return (
    <main className="flex flex-col h-screen bg-background">
      <div className="flex-none p-4 bg-background shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate(-1)}
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <ChevronLeft className="h-7 w-7" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Timetable</h1>
            </div>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              variant="ghost"
              size="icon"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {availableCategories.map(category => (
              <Button
                key={category}
                onClick={() => toggleCategory(category)}
                variant="ghost"
                className={`whitespace-nowrap text-foreground hover:text-foreground ${
                  selectedCategories.has(category) 
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
                    : 'hover:bg-accent/50'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

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

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addEvent}
      />
    </main>
  );
} 