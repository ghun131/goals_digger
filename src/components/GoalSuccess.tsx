import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  goal: string;
  amount: string;
}

export default function GoalSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { goal, amount } = location.state as LocationState;

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-[440px] mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Congratulations!
          </h1>
          <p className="text-base sm:text-lg text-gray-400">
            You've achieved your goal
          </p>
        </div>

        <div className="bg-zinc-800 rounded-xl p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white mb-1">Goal Achieved</h2>
            <p className="text-sm text-gray-400">{goal}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Deposit Return</h2>
            <p className="text-sm text-gray-400">Amount: {amount} VND</p>
            <p className="text-sm text-gray-400 mt-2">
              Your deposit will be returned to your account within 24 hours
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/goals')}
          className="bg-white w-full py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-100"
        >
          Set a New Goal
        </button>
      </div>
    </div>
  );
} 