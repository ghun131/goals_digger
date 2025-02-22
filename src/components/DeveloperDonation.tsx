import { useLocation } from 'react-router-dom';

interface LocationState {
  goal: string;
  amount: number;
}

export default function DeveloperDonation() {
  const location = useLocation();
  const goalData = location.state as LocationState;
  console.log("goalData:", goalData)

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-[440px] mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Thank You!
          </h1>
          <p className="text-base sm:text-lg text-gray-400">
            Your generosity means the world to us
          </p>
        </div>

        <div className="space-y-6 text-center">
          <div className="bg-zinc-800 rounded-xl p-6">
            <p className="text-gray-300 leading-relaxed">
              Dear valued user,
              <br /><br />
              I want to express my deepest gratitude for your generous contribution of{' '}
              <span className="text-white font-medium">
                {goalData.amount?.toLocaleString()} VND
              </span>
              . Your support not only helps maintain this platform but also motivates me to 
              continue improving and expanding our services.
              <br /><br />
              I promise to:
            </p>
            <ul className="text-left text-gray-300 mt-4 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Maintain the highest quality standards
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Continuously improve the platform
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Add new features to help you achieve your goals
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Provide reliable support when you need it
              </li>
            </ul>
          </div>

          <div className="text-gray-400">
            <p>With sincere appreciation,</p>
            <p className="font-medium text-white mt-2">Development team</p>
          </div>

          <div className="pt-6 border-t border-zinc-800">
            <p className="text-sm text-gray-400">
              Follow our journey and connect us on{' '}
              <a
                href="https://www.linkedin.com/in/hung-dang-72ba0078"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}