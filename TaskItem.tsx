import React from 'react';
import { Check, Clock, Trash2, AlertCircle } from 'lucide-react';
import { Task } from '../../types';
import { format, isToday, isPast } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'border-emerald-200 dark:border-emerald-800',
  medium: 'border-amber-200 dark:border-amber-800',
  high: 'border-rose-200 dark:border-rose-800',
};

const priorityBadges = {
  low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  high: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const isOverdue = task.dueDate && isPast(task.dueDate) && !task.completed;
  const isDueToday = task.dueDate && isToday(task.dueDate);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 shadow-sm hover:shadow-md transition-all ${
      task.completed ? 'opacity-60' : priorityColors[task.priority]
    }`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
          }`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`font-medium ${
              task.completed
                ? 'line-through text-gray-500 dark:text-gray-400'
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h4>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityBadges[task.priority]}`}>
                {task.priority}
              </span>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
          )}

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {task.category}
            </span>
            
            {task.dueDate && (
              <div className={`flex items-center space-x-1 text-xs ${
                isOverdue
                  ? 'text-rose-600 dark:text-rose-400'
                  : isDueToday
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                <span>{format(task.dueDate, 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}