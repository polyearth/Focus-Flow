import React, { useState } from 'react';
import { Plus, Hash, StickyNote } from 'lucide-react';
import { QuickNote } from '../../types';

interface QuickCaptureProps {
  notes: QuickNote[];
  onAddNote: (note: Omit<QuickNote, 'id' | 'createdAt'>) => void;
  onDeleteNote: (id: string) => void;
}

export function QuickCapture({ notes, onAddNote, onDeleteNote }: QuickCaptureProps) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const parsedTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onAddNote({
      content: content.trim(),
      tags: parsedTags,
    });

    setContent('');
    setTags('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <StickyNote className="w-5 h-5 mr-2 text-amber-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Capture</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Capture your thoughts, ideas, or reminders..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Hash className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {notes.length > 0 && (
        <div className="mt-6 space-y-3 max-h-60 overflow-y-auto">
          {notes.slice(0, 5).map(note => (
            <div
              key={note.id}
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3"
            >
              <p className="text-sm text-gray-900 dark:text-white">{note.content}</p>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={() => onDeleteNote(note.id)}
                className="text-xs text-gray-500 hover:text-rose-500 mt-2 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}