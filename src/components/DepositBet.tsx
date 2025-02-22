import { useState, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bankQR from '../assets/host_bank_qr.jpeg';

interface LocationState {
  goal: string;
  deadline: string;
  time: string;
  epochTimestamp: number;
}

export default function DepositBet() {
  const location = useLocation();
  const navigate = useNavigate();
  const goalData = location.state as LocationState;
  const [isExpanded, setIsExpanded] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    transactionId: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Bet submitted:', {
      ...formData,
      goalData
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const deadlineDate = new Date(goalData?.epochTimestamp).toLocaleString();

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-[440px] mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Back your goal
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8">
          Make a deposit to commit to your goal
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">Your Goal</h2>
          <div className="relative">
            <p 
              onClick={() => goalData?.goal?.length > 50 && setIsExpanded(!isExpanded)}
              className={`text-gray-400 ${
                !isExpanded && 'line-clamp-1'
              } ${
                goalData?.goal?.length > 50 ? 'cursor-pointer hover:text-gray-300' : ''
              }`}
            >
              {goalData?.goal}
            </p>
            <p className="text-sm text-gray-500 mt-1">Due by: {deadlineDate}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Make a transfer to:</h3>
          <div className="bg-white p-4 rounded-lg flex justify-center">
            <img 
              src={bankQR} 
              alt="Bank QR Code" 
              className="w-full max-w-[280px] h-auto rounded"
            />
          </div>
          <p className="text-sm text-gray-400 mt-4 text-center">
            Scan this QR code with your banking app to make the transfer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label htmlFor="amount" className="block text-sm font-medium text-white mb-2">
              Deposit Amount (VND)
            </label>
            <input
              id="amount"
              type="number"
              required
              min="10000"
              step="10000"
              className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100,000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div className="text-left">
            <label htmlFor="transactionId" className="block text-sm font-medium text-white mb-2">
              Transaction Reference (Optional)
            </label>
            <input
              id="transactionId"
              type="text"
              className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter transaction reference"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="bg-white w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-100"
          >
            Confirm Deposit
          </button>
        </form>
      </div>
    </div>
  );
} 