import React from 'react';
import { Check, Flame, Trash2 } from 'lucide-react';
import { Habit } from '../../types';
import { format, isToday } from 'date-fns';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitItem({ habit, onToggle, onDelete }: HabitItemProps) {
  const todayString = format(new Date(), 'yyyy-MM-dd');
  const isCompletedToday = habit.completedDates.includes(todayString);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggle(habit.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isCompletedToday
                ? `bg-${habit.color}-500 border-${habit.color}-500`
                : `border-${habit.color}-300 hover:border-${habit.color}-500`
            }`}
            style={{
              backgroundColor: isCompletedToday ? habit.color : 'transparent',
              borderColor: habit.color,
            }}
          >
            {isCompletedToday && <Check className="w-4 h-4 text-white" />}
          </button>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{habit.name}</h4>
            {habit.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{habit.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-orange-500">
            <Flame className="w-4 h-4" />
            <span className="font-semibold">{habit.streak}</span>
          </div>
          
          <button
            onClick={() => onDelete(habit.id)}
            className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex space-x-1">
        {Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dateString = format(date, 'yyyy-MM-dd');
          const isCompleted = habit.completedDates.includes(dateString);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={i}
              className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs ${
                isCompleted
                  ? 'text-white'
                  : isCurrentDay
                  ? 'bg-gray-200 dark:bg-gray-600'
                  : 'bg-gray-100 dark:bg-gray-700'
              } ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}`}
              style={{
                backgroundColor: isCompleted ? habit.color : undefined,
              }}
            >
              {format(date, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
}