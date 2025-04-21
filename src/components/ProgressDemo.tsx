import { useEffect, useState } from 'react';
import { Progress } from './ui/progress';

export function ProgressDemo() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 0;
        }
        return prevProgress + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
}
