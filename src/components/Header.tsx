import { LucideArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "@tanstack/react-router";

export default function Header() {
  const router = useRouter();
  return <header className="border-b mb-4">
    <div className="flex items-center h-12 gap-2">
      <Button onClick={() => router.history.back()} size="icon" variant="ghost">
        <LucideArrowLeft />
      </Button>
      <span></span>
    </div>
  </header>
}