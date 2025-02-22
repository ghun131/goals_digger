import { useLocation } from 'react-router-dom';
import developerQR from '../assets/developer_bank_qr.jpeg';

interface LocationState {
  goal: string;
  amount: string;
}

export default function DeveloperDonation() {
  const location = useLocation();
  const { goal } = location.state as LocationState;

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-[440px] mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Support the Developers
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8">
          Your contribution helps us continue building tools for goal achievement
        </p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Your Goal</h2>
          <p className="text-gray-400">{goal}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Make a transfer to:</h3>
          <div className="bg-white p-4 rounded-lg flex justify-center">
            <img 
              src={developerQR} 
              alt="Developer Bank QR Code" 
              className="w-full max-w-[280px] h-auto rounded"
            />
          </div>
          <p className="text-sm text-gray-400 mt-4 text-center">
            Scan this QR code with your banking app to make the transfer
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">About the Team</h4>
            <p className="text-gray-400 text-sm">
              We're a small team of developers passionate about helping people achieve their goals 
              through technology and accountability.
            </p>
          </div>

          <div className="bg-zinc-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">How Your Support Helps</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>• Maintain and improve the platform</li>
              <li>• Develop new features and tools</li>
              <li>• Keep the service running for everyone</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}