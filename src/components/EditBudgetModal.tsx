import React, { useState } from 'react';
import { Category } from '../stores/financeStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  currentBudget: number;
  onUpdate: (category: Category, newBudget: number) => void;
}

const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ isOpen, onClose, category, currentBudget, onUpdate }) => {
  const [newBudget, setNewBudget] = useState(currentBudget);
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [threshold, setThreshold] = useState(80);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(category as Category, newBudget);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget for {category}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="budget">Budget Amount</Label>
              <span className="text-sm text-muted-foreground">
                Current: ₹{currentBudget.toLocaleString()}
              </span>
            </div>
            <Input
              type="number"
              id="budget"
              value={newBudget}
              onChange={(e) => setNewBudget(parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="alerts"
              checked={alertEnabled}
              onCheckedChange={(checked) => setAlertEnabled(checked as boolean)}
            />
            <Label htmlFor="alerts">Receive Alert</Label>
          </div>

          {alertEnabled && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="threshold">Alert Threshold</Label>
                <span className="text-sm text-muted-foreground">{threshold}%</span>
              </div>
              <Slider
                id="threshold"
                min={0}
                max={100}
                step={1}
                value={[threshold]}
                onValueChange={(value) => setThreshold(value[0])}
                className="w-full"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBudgetModal;