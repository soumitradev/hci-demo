import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight } from 'lucide-react';

interface FitnessWidgetProps {
  steps: number;
  goal: number;
}

export default function FitnessWidget({ steps, goal }: FitnessWidgetProps) {
  const navigate = useNavigate();
  const progress = Math.min(Math.round((steps / goal) * 100), 100);

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate('/fitness')}
    >
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-semibold">Fitness</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray={`${progress}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-foreground">{progress}%</span>
            <span className="text-xs text-muted-foreground">Steps</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="mt-2 text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/fitness');
          }}
        >
          View All
          <ArrowRight className="w-3 h-3" />
        </Button>
      </CardContent>
    </Card>
  );
} 