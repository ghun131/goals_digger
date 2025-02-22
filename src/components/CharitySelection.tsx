import { useNavigate } from 'react-router-dom';

// Mock goal data (same as LoseOptions)
const mockGoal = {
  goal: "Learn to play guitar in 3 months",
  deadline: "2024-06-15",
  time: "18:00",
  epochTimestamp: 1718467200000,
  amount: "500000"
};

const CHARITIES = [
  {
    id: 'qtnvc',
    name: 'Quỹ trò nghèo vùng cao',
    description: 'Supporting education for children in highland areas',
  },
  {
    id: 'nuoiem',
    name: 'Nuôi em & Cặp lá yêu thương',
    description: 'Providing care and support for disadvantaged children',
  },
  {
    id: 'nhandao',
    name: 'Cổng nhân đạo quốc gia 1400',
    description: 'National humanitarian gateway for various causes',
  },
  {
    id: 'langtresos',
    name: 'Làng trẻ SOS',
    description: 'Providing homes and care for orphaned children',
  },
];

export default function CharitySelection() {
  const navigate = useNavigate();

  const handleSelect = (charityId: string) => {
    navigate('/donation-confirmation', { 
      state: { 
        charityId,
        amount: mockGoal.amount,
        goal: mockGoal.goal
      } 
    });
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-[440px] mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Select a Charity
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8">
          Choose where you'd like to make your impact
        </p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Your Goal</h2>
          <p className="text-gray-400">{mockGoal.goal}</p>
          <p className="text-sm text-gray-500 mt-1">
            Due by: {new Date(mockGoal.epochTimestamp).toLocaleString()}
          </p>
        </div>

        <div className="space-y-4">
          {CHARITIES.map((charity) => (
            <div
              key={charity.id}
              onClick={() => handleSelect(charity.id)}
              className="p-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-1">
                {charity.name}
              </h3>
              <p className="text-sm text-gray-400">
                {charity.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Donation amount: {mockGoal.amount} VND
        </p>
      </div>
    </div>
  );
}