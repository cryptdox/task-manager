import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { ToDoTask, TaskTag } from '../types/database';
import { FilterPanel } from '../components/taskStore/FilterPanel';
import { CreateForm } from '../components/taskStore/CreateForm';
import { TypeView } from '../components/taskStore/TypeView';
import { DoneModal } from '../components/taskStore/DoneModal';
import { ConfirmModal } from '../components/taskStore/ConfirmModal';

export function TaskStorePage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [tasks, setTasks] = useState<ToDoTask[]>([]);
  const [tags, setTags] = useState<TaskTag[]>([]);
  const [selectedTag, setSelectedTag] = useState('all');
  const [editingTask, setEditingTask] = useState<ToDoTask | null>(null);
  const [deletingTask, setDeletingTask] = useState<ToDoTask | null>(null);
  const [doneTask, setDoneTask] = useState<ToDoTask | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadTags();
      loadTasks();
    }
  }, [user]);

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('task_tag')
        .select('*')
        .eq('task_manager_user', user!.id);

      if (!error && data) {
        setTags(data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('to_do_task')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_on', { ascending: false });

      if (!error && data) {
        setTasks(data);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleSaveTask = async (task: Partial<ToDoTask>) => {
    if (!user) return;
    setLoading(true);

    try {
      if (editingTask) {
        const { error } = await supabase
          .from('to_do_task')
          .update(task)
          .eq('id', editingTask.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('to_do_task')
          .insert([{ ...task, user_id: user.id, archived: false }]);
        if (error) throw error;
      }
      await loadTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('to_do_task')
        .delete()
        .eq('id', taskId);
      if (error) throw error;
      await loadTasks();
      setDeletingTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async (task: ToDoTask, data: { date: string; period: 'morning' | 'day' | 'night' }) => {
    setLoading(true);
    try {
      const newTask = {
        task: task.description,
        task_period: data.period,
        date: data.date,
        task_tag: task.task_tag,
        task_manager_user: user!.id,
      };

      const { error: taskError } = await supabase
        .from('task')
        .insert([newTask]);
      if (taskError) throw taskError;

      if (task.to_do_type === 'one_time' || task.to_do_type === 'progress') {
        const { error: deleteError } = await supabase
          .from('to_do_task')
          .delete()
          .eq('id', task.id);
        if (deleteError) throw deleteError;
      }

      await loadTasks();
      setDoneTask(null);
    } catch (error) {
      console.error('Error marking task as done:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = selectedTag === 'all'
    ? tasks
    : tasks.filter(task => task.task_tag === selectedTag);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('nav.taskStore')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterPanel
              tags={tags}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <CreateForm
              editingTask={editingTask}
              tags={tags}
              onSave={handleSaveTask}
              onCancel={() => setEditingTask(null)}
            />

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">{t('taskStore.tasks')}</h2>

              <div className="space-y-8">
                <TypeView
                  type="one_time"
                  tasks={filteredTasks}
                  tags={tags}
                  onEdit={setEditingTask}
                  onDelete={(task) => setDeletingTask(task)}
                  onDone={(task) => setDoneTask(task)}
                />

                <TypeView
                  type="always"
                  tasks={filteredTasks}
                  tags={tags}
                  onEdit={setEditingTask}
                  onDelete={(task) => setDeletingTask(task)}
                  onDone={(task) => setDoneTask(task)}
                />

                <TypeView
                  type="progress"
                  tasks={filteredTasks}
                  tags={tags}
                  onEdit={setEditingTask}
                  onDelete={(task) => setDeletingTask(task)}
                  onDone={(task) => setDoneTask(task)}
                />

                {filteredTasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">{t('taskManager.noTasks')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {doneTask && (
        <DoneModal
          task={doneTask}
          onSubmit={(data) => handleMarkDone(doneTask, data)}
          onClose={() => setDoneTask(null)}
        />
      )}

      {deletingTask && (
        <ConfirmModal
          title={t('taskStore.deleteTask')}
          message={t('taskStore.deleteConfirmation')}
          onConfirm={() => handleDeleteTask(deletingTask.id)}
          onClose={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
}
