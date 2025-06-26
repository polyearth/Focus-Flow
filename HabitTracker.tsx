import React from 'react';
import { Habit } from '../../types';
import { HabitItem } from './HabitItem';
import { AddHabitForm } from './AddHabitForm';

interface HabitTrackerProps {
  habits: Habit[];
  onAddHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
}

export function HabitTracker({ habits, onAddHabit, onToggleHabit, onDeleteHabit }: HabitTrackerProps) {
  return (
    <div className="space-y-4">
      <AddHabitForm onAddHabit={onAddHabit} />
      
      {habits.length > 0 ? (
        <div className="space-y-3">
          {habits.map(habit => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggle={onToggleHabit}
              onDelete={onDeleteHabit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No habits yet. Create your first habit to start tracking!</p>
        </div>
      )}
    </div>
  );
}