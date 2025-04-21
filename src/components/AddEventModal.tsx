import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Event } from "../stores/timetableStore";

type EventCategory = "CS F213" | "CS F214" | "CS F222" | "Other";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Omit<Event, 'id'>) => void;
}

export default function AddEventModal({ isOpen, onClose, onAdd }: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("Other");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const getEventColor = (cat: EventCategory) => {
      switch (cat) {
        case 'CS F213':
          return 'bg-blue-500';
        case 'CS F214':
          return 'bg-emerald-500';
        case 'CS F222':
          return 'bg-violet-500';
        default:
          return 'bg-orange-500';
      }
    };

    onAdd({
      title,
      category,
      location,
      startTime,
      endTime,
      color: getEventColor(category).replace('bg-', '#') // Convert Tailwind class to hex
    });
    onClose();
    // Reset form
    setTitle("");
    setCategory("Other");
    setLocation("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
              className="bg-background text-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">Category</Label>
            <Select 
              value={category} 
              onValueChange={(value: EventCategory) => setCategory(value)}
            >
              <SelectTrigger className="bg-background text-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CS F213">CS F213</SelectItem>
                <SelectItem value="CS F214">CS F214</SelectItem>
                <SelectItem value="CS F222">CS F222</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Event location"
              required
              className="bg-background text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-foreground">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="bg-background text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-foreground">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="bg-background text-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="text-foreground">
              Cancel
            </Button>
            <Button type="submit" variant="secondary">Add Event</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 