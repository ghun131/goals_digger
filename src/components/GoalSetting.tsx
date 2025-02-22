import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoalSetting() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    goal: '',
    deadline: '',
    time: '12:00' // Default to noon
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Combine date and time into a single timestamp
    const dateTimeString = `${formData.deadline}T${formData.time}`;
    const epochTime = new Date(dateTimeString).getTime();
    
    // Navigate to deposit page with goal data
    navigate('/deposit', {
      state: {
        goal: formData.goal,
        deadline: formData.deadline,
        time: formData.time,
        epochTimestamp: epochTime
      }
    });
  };

  return (
    <div className="h-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-[440px] p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Set your goal
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8">
          Define your goal and when you want to achieve it
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label htmlFor="goal" className="block text-sm font-medium text-white mb-2">
              What's your goal?
            </label>
            <textarea
              id="goal"
              required
              rows={3}
              className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="e.g., Learn to play the guitar"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            />
          </div>

          <div className="text-left space-y-4">
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-white mb-2">
                Target Date
              </label>
              <input
                id="deadline"
                type="date"
                required
                className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:dark]"
                min={new Date().toISOString().split('T')[0]}
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-white mb-2">
                Target Time
              </label>
              <input
                id="time"
                type="time"
                required
                className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:dark]"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-white w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-100"
          >
            Set Goal
          </button>
        </form>
      </div>
    </div>
  );
} 