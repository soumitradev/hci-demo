import { LucideArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useMatches, useRouter } from "@tanstack/react-router";

export default function Header() {
  const router = useRouter();
  const matches = useMatches();
  return <header className="border-b mb-4">
    <div className="flex items-center h-12 gap-2">
      <Button onClick={() => router.history.back()} size="icon" variant="ghost">
        <LucideArrowLeft />
      </Button>
      <span>
        {/* @ts-ignore */}
        {matches.map((match) => match.staticData.title).filter(Boolean).join(" / ")}
      </span>
    </div>
  </header>
}