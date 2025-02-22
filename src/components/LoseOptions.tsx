import { doc } from 'firebase/firestore';
import { updateDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from '../config/firebase';

interface GoalLocationState {
  goal: string;
  amount: number;
  goalId: string;
  epochTimestamp: number;
}

export default function LoseOptions() {
  const navigate = useNavigate();
  const location = useLocation();
  const goalData = location.state as GoalLocationState;

  const handleOptionSelect = async (option: "developers" | "charity") => {
    if (option === "charity") {
      navigate("/charity-selection", { state: goalData });
    } else {
      await updateDoc(doc(db, "goals", goalData.goalId), {
        status: "failed",
        updatedAt: new Date().getTime(),
      });

      navigate("/developer-donation", { state: goalData });
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-[440px] mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Goal Not Achieved
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8">
          Your deposit can still make a difference
        </p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Your Goal</h2>
          <p className="text-gray-400">{goalData.goal}</p>
          <p className="text-sm text-gray-500 mt-1">
            Due by: {new Date(goalData.epochTimestamp).toLocaleString()}
          </p>
        </div>

        <div className="space-y-6">
          <div
            onClick={() => handleOptionSelect("developers")}
            className="p-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors text-left"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              Donate to Developers
            </h3>
            <p className="text-gray-400">
              Support the developers who built this platform to help people
              achieve their goals. Your contribution helps us:
            </p>
            <ul className="mt-3 space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Maintain and improve the platform for future goal-setters
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Develop new features to better support personal growth
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Create more tools to help people stay accountable
              </li>
            </ul>
          </div>

          <div
            onClick={() => handleOptionSelect("charity")}
            className="p-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors text-left"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              Donate to Charity
            </h3>
            <p className="text-gray-400">
              Make a meaningful impact by supporting one of our trusted charity
              partners:
            </p>
            <ul className="mt-3 space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Quỹ trò nghèo vùng cao
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Nuôi em & Cặp lá yêu thương
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Cổng nhân đạo quốc gia 1400
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Làng trẻ SOS
              </li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Select an option to proceed with your donation of {goalData.amount}{" "}
          VND
        </p>
      </div>
    </div>
  );
}
