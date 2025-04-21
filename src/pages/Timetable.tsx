import { useState, useEffect } from "react";
import { Plus, ChevronLeft } from "lucide-react";
import { useTimetableStore, Event } from "../stores/timetableStore";
import { useNavigate } from 'react-router-dom';
import AddEventModal from "../components/AddEventModal";

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
    <main className="flex flex-col h-screen bg-gray-50">
      <div className="flex-none p-4 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/academics')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-[#0F172A]">Timetable</h1>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus size={28} />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {availableCategories.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategories.has(category)
                    ? "bg-[#0F172A] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {category}
              </button>
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
                  <span className="absolute right-1 -translate-y-1/2 text-xs font-medium text-red-600 bg-white pl-2 pr-1">{formattedTime}</span>
                </div>
                <div className="flex-1 h-0.5 bg-red-600"></div>
              </div>
            </div>
          )}

          {/* Time slots */}
          <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col bg-white z-10">
            {timeSlots.map((time, i) => (
              <div key={i} className="h-16 border-b border-gray-200">
                <div className="h-full flex items-start pt-0 px-4">
                  <span className="text-[10px] text-[#0F172A] whitespace-nowrap">{time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Grid and events */}
          <div className="ml-16 relative -mt-4">
            {/* Hour grid lines */}
            <div className="relative">
              {timeSlots.map((_, i) => (
                <div key={i} className="h-16 border-b border-gray-200" />
              ))}

              {/* Events */}
              <div className="absolute inset-0 px-1">
                {eventGroups.map((group, _) => 
                  group.map((event, eventIndex) => {
                    // Convert event time to pixels (assuming 1 hour = 64px)
                    const [startHours, startMinutes] = event.startTime.split(':').map(Number);
                    const [endHours, endMinutes] = event.endTime.split(':').map(Number);
                    
                    const startInMinutes = startHours * 60 + startMinutes;
                    const endInMinutes = endHours * 60 + endMinutes;
                    const durationInMinutes = endInMinutes - startInMinutes;
                    
                    const startHour = startHours - earliestHour;
                    const top = (startHour * 64) + (startMinutes / 60 * 64);
                    const height = (durationInMinutes / 60) * 64;

                    // Calculate width and position based on group size with smaller gap
                    const gap = 4; // 4px gap between events
                    const totalGaps = group.length - 1;
                    const width = `calc((100% - ${gap * totalGaps}px) / ${group.length})`;
                    const left = `calc(${eventIndex} * (100% / ${group.length}) + ${gap * eventIndex}px)`;

                    return (
                      <div
                        key={event.id}
                        className="absolute rounded-lg p-2"
                        style={{
                          left,
                          top: `${top}px`,
                          width,
                          height: `${height}px`,
                          backgroundColor: event.color,
                          color: event.color === "#91DE43" ? "#0F172A" : "white"
                        }}
                      >
                        <div className="text-sm font-medium truncate">{event.title}</div>
                        <div className="text-sm opacity-75 truncate">{event.location}</div>
                      </div>
                    );
                  })
                )}
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