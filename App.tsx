import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  CheckSquare, 
  Target, 
  Clock, 
  Zap, 
  TrendingUp,
  Calendar,
  Moon,
  Sun,
  Activity
} from 'lucide-react';

import { Header } from './components/Layout/Header';
import { StatsCard } from './components/Dashboard/StatsCard';
import { TaskList } from './components/Tasks/TaskList';
import { AddTaskForm } from './components/Tasks/AddTaskForm';
import { PomodoroTimer } from './components/Pomodoro/PomodoroTimer';
import { HabitTracker } from './components/Habits/HabitTracker';
import { QuickCapture } from './components/QuickCapture/QuickCapture';

import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, Habit, Goal, QuickNote, Theme } from './types';

function App() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [notes, setNotes] = useLocalStorage<QuickNote[]>('notes', []);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Task functions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined
          }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Habit functions
  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (id: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;
      
      const isCompletedToday = habit.completedDates.includes(today);
      
      if (isCompletedToday) {
        // Remove today's completion
        return {
          ...habit,
          completedDates: habit.completedDates.filter(date => date !== today),
          streak: Math.max(0, habit.streak - 1),
        };
      } else {
        // Add today's completion
        const newCompletedDates = [...habit.completedDates, today].sort();
        return {
          ...habit,
          completedDates: newCompletedDates,
          streak: habit.streak + 1,
          lastCompleted: new Date(),
        };
      }
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  // Note functions
  const addNote = (noteData: Omit<QuickNote, 'id' | 'createdAt'>) => {
    const newNote: QuickNote = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalHabits = habits.length;
  const activeStreaks = habits.filter(habit => habit.streak > 0).length;
  const todayHabits = habits.filter(habit => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return habit.completedDates.includes(today);
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Completed Tasks"
            value={completedTasks}
            subtitle={`of ${tasks.length} total`}
            icon={CheckSquare}
            color="emerald"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Active Habits"
            value={todayHabits}
            subtitle={`of ${totalHabits} habits`}
            icon={Target}
            color="blue"
          />
          <StatsCard
            title="Current Streaks"
            value={activeStreaks}
            icon={Zap}
            color="amber"
          />
          <StatsCard
            title="Quick Notes"
            value={notes.length}
            icon={Activity}
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tasks Section */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <CheckSquare className="w-5 h-5 mr-2" />
                Tasks
              </h3>
              <div className="space-y-4">
                <AddTaskForm onAddTask={addTask} />
                <TaskList
                  tasks={tasks}
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                />
              </div>
            </section>

            {/* Habits Section */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Habit Tracker
              </h3>
              <HabitTracker
                habits={habits}
                onAddHabit={addHabit}
                onToggleHabit={toggleHabit}
                onDeleteHabit={deleteHabit}
              />
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pomodoro Timer */}
            <PomodoroTimer />

            {/* Quick Capture */}
            <QuickCapture
              notes={notes}
              onAddNote={addNote}
              onDeleteNote={deleteNote}
            />

            {/* Today's Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Today's Progress
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Tasks Completed</span>
                    <span className="text-gray-900 dark:text-white">{completedTasks}/{tasks.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Habits Completed</span>
                    <span className="text-gray-900 dark:text-white">{todayHabits}/{totalHabits}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalHabits > 0 ? (todayHabits / totalHabits) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;