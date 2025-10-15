import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { Task, TaskTag, TaskPeriod } from '../types/database';
import ConfirmPopup from '../components/ConfirmPopup';
import Notification from '../components/Notification';

export function TaskManagerPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<TaskTag[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<TaskPeriod | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskText, setTaskText] = useState('');
  const [taskPeriod, setTaskPeriod] = useState<TaskPeriod>('morning');
  const [taskTag, setTaskTag] = useState<string>('');
  const [taskDate, setTaskDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info" | "warning">();
  const [duration, setDuration] = useState(4000)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string>("");
  const [confirmHandler, setConfirmHandler] = useState<(() => void) | null>(null);

  const setNotification = (message: string, type: "success" | "error" | "info" | "warning" = "success", duration: number = 4000) => {
    setShow(true)
    setMessage(message)
    setType(type)
    setDuration(duration)
    setTimeout(() => setShow(false), duration)
  }

  const setConfirm = (onConfirm: () => void, message: string = "Are you sure?") => {
    setConfirmHandler(() => onConfirm); // store callback
    setConfirmMessage(message);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    confirmHandler && confirmHandler();
    setIsConfirmOpen(false);
  };

  const handleCancel = () => setIsConfirmOpen(false);


  useEffect(() => {
    if (user) {
      loadTags();
      loadTasks();
    }
  }, [user]);

  const loadTags = async () => {
    const { data, error } = await supabase
      .from('task_tag')
      .select('*')
      .eq('user_id', user!.id);

    if (!error && data) {
      setTags(data);
    }
  };

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from('task')
      .select('*')
      .eq('user_id', user!.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTasks(data);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const dateMatch = !selectedDate || task.date === selectedDate;
    const periodMatch = selectedPeriod === 'all' || task.task_period === selectedPeriod;
    const tagMatch = selectedTag === 'all' || task.task_tag === selectedTag;
    return dateMatch && periodMatch && tagMatch;
  });

  const handleCreateOrUpdate = async () => {
    if (!taskText.trim()) return;

    const taskData = {
      task: taskText,
      task_period: taskPeriod,
      task_tag: taskTag || null,
      date: taskDate,
      user_id: user!.id
    };

    if (editingTask) {
      const { error } = await supabase
        .from('task')
        .update(taskData)
        .eq('id', editingTask.id);

      const targetId = "tasks"
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn(`Element with id "${targetId}" not found.`);
      }
      setNotification("Successfully updated!")
      if (!error) {
        loadTasks();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('task')
        .insert([taskData]);
      const targetId = "tasks"
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn(`Element with id "${targetId}" not found.`);
      }
      setNotification("Successfully created!")
      if (!error) {
        loadTasks();
        resetForm();
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTaskText(task.task);
    setTaskPeriod(task.task_period);
    setTaskTag(task.task_tag || '');
    setTaskDate(task.date);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('task')
      .delete()
      .eq('id', id);

    setNotification("Successfully deleted!", "info")
    if (!error) {
      loadTasks();
    }
  };

  const resetForm = () => {
    setEditingTask(null);
    setTaskText('');
    setTaskPeriod('morning');
    setTaskTag('');
    setTaskDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6fa] to-[#dcdde1] dark:from-[#2f3640] dark:to-[#353b48] py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white text-center">
          {t('taskManager.title')}
        </h1> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                {t('taskManager.filters')}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('taskManager.date')}
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a8ff] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('taskManager.period')}
                  </label>
                  <div className="space-y-2">
                    {['all', 'morning', 'day', 'night'].map((period) => (
                      <label key={period} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="period"
                          checked={selectedPeriod === period}
                          onChange={() => setSelectedPeriod(period as TaskPeriod | 'all')}
                          className="w-4 h-4 text-[#00a8ff] focus:ring-[#00a8ff]"
                        />
                        <span className="text-gray-700 dark:text-gray-300 capitalize">
                          {t(`taskManager.${period}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('taskManager.tag')}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tag"
                        checked={selectedTag === 'all'}
                        onChange={() => setSelectedTag('all')}
                        className="w-4 h-4 text-[#00a8ff] focus:ring-[#00a8ff]"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {t('taskManager.all')}
                      </span>
                    </label>
                    {tags.map((tag) => (
                      <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tag"
                          checked={selectedTag === tag.id}
                          onChange={() => setSelectedTag(tag.id)}
                          className="w-4 h-4 text-[#00a8ff] focus:ring-[#00a8ff]"
                        />
                        <span
                          className="px-3 py-1 rounded-full text-white text-sm font-medium"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            
            
            
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                {editingTask ? t('taskManager.updateTask') : t('taskManager.createTask')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('taskManager.taskDescription')}
                  </label>
                  <textarea
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a8ff] transition-all"
                    rows={3}
                    placeholder={t('taskManager.taskDescription')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('taskManager.period')}
                    </label>
                    <select
                      value={taskPeriod}
                      onChange={(e) => setTaskPeriod(e.target.value as TaskPeriod)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a8ff] transition-all"
                    >
                      <option value="morning">{t('taskManager.morning')}</option>
                      <option value="day">{t('taskManager.day')}</option>
                      <option value="night">{t('taskManager.night')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('taskManager.tag')}
                    </label>
                    <select
                      value={taskTag}
                      onChange={(e) => setTaskTag(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a8ff] transition-all"
                    >
                      <option value="">{t('taskManager.selectTag')}</option>
                      {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('taskManager.date')}
                    </label>
                    <input
                      type="date"
                      value={taskDate}
                      onChange={(e) => setTaskDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00a8ff] transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateOrUpdate}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4cd137] to-[#44bd32] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    {editingTask ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {editingTask ? t('taskManager.save') : t('taskManager.createTask')}
                  </button>
                  {editingTask && (
                    <button
                      onClick={resetForm}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                      {t('taskManager.cancel')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6" id="tasks">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                Tasks ({filteredTasks.length})
              </h2>

              {filteredTasks.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  {t('taskManager.noTasks')}
                </p>
              ) : (
                <div className="space-y-6">
                  {/* Define task periods with colors */}
                  {[
                    { key: 'morning', color: 'text-yellow-500' },
                    { key: 'day', color: 'text-green-500' },
                    { key: 'night', color: 'text-purple-500' }
                  ].map(({ key, color }) => {
                    const tasksByPeriod = filteredTasks.filter(task => task.task_period === key);
                    if (tasksByPeriod.length === 0) return null;

                    return (
                      <div key={key}>
                        <h3 className={`text-xl font-semibold mb-4 capitalize ${color}`}>
                          {t(`taskManager.${key}`)}
                        </h3>
                        <div className="space-y-3">
                          {tasksByPeriod.map((task) => {
                            const tag = tags.find(t => t.id === task.task_tag);
                            return (
                              <div
                                key={task.id}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-102"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <p className="text-gray-800 dark:text-white font-medium mb-2">
                                      {task.task}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      <span className="px-3 py-1 bg-[#00a8ff] text-white text-xs rounded-full">
                                        {task.date}
                                      </span>
                                      {tag && (
                                        <span
                                          className="px-3 py-1 text-white text-xs rounded-full"
                                          style={{ backgroundColor: tag.color }}
                                        >
                                          {tag.name}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEdit(task)}
                                      className="p-2 text-[#00a8ff] hover:bg-[#00a8ff] hover:text-white rounded-lg transition-all transform hover:scale-110"
                                    >
                                      <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => setConfirm(() => handleDelete(task.id))}
                                      className="p-2 text-[#e84118] hover:bg-[#e84118] hover:text-white rounded-lg transition-all transform hover:scale-110"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {show && (
        <Notification
          message={message}
          type={type}
          duration={duration}
        />
      )}
      <ConfirmPopup
        isOpen={isConfirmOpen}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
