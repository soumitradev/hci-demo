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
      title: "CS F213 L2",
      location: "F-105",
      startTime: "14:00",
      endTime: "15:00",
      category: "CS F213",
      color: "#6D04DE"
    },
    {
      id: "2",
      title: "ISRO Panel Talk",
      location: "F-102",
      startTime: "14:00",
      endTime: "15:00",
      category: "Other",
      color: "#6D04DE"
    },
    {
      id: "3",
      title: "DE Shaw OA",
      location: "Online",
      startTime: "14:00",
      endTime: "15:00",
      category: "Other",
      color: "#6D04DE"
    },
    {
      id: "4",
      title: "Club Review Meet",
      location: "NEW FOOTBALL GROUND",
      startTime: "16:00",
      endTime: "17:00",
      category: "Other",
      color: "#91DE43"
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