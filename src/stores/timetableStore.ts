import { create } from "zustand";

export type Event = {
  id: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  category: "CS F213" | "CS F214" | "CS F222" | "Other";
  color: string;
};

type TimetableStore = {
  events: Event[];
  addEvent: (event: Omit<Event, "id">) => void;
};

export const useTimetableStore = create<TimetableStore>((set) => ({
  events: [
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
  ],
  addEvent: (event) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          ...event,
          id: Math.random().toString(36).substring(7),
        },
      ],
    })),
})); 