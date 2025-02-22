import { useState, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

interface LocationState {
  goal: string;
  amount: number;
  goalId: string;
}

export default function GoalSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const goalData = location.state as LocationState;
  console.log("goalData:", goalData)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount) {
      return setError("Please enter the reimbursement amount");
    }

    try {
      setLoading(true);

      // Get latest goal data to verify amount
      const goalDoc = await getDoc(doc(db, "goals", goalData.goalId));
      if (!goalDoc.exists()) {
        setError("Goal not found");
        return;
      }

      const goalAmount = goalDoc.data().amount;

      if (Number(amount) !== goalAmount) {
        // TODO: Add a popup to contact us using social media
        setError(
          `If you received other than ${goalAmount.toLocaleString()} VND, find support at https://www.linkedin.com/in/hung-dang-72ba0078`
        );
        return;
      }

      // Update goal status to completed
      await updateDoc(doc(db, "goals", goalData.goalId), {
        status: "completed",
        updatedAt: new Date().getTime(),
      });

      // Navigate to goal setting page
      navigate("/goals", { replace: true });
    } catch (err) {
      console.error("Error verifying reimbursement:", err);
      setError("Failed to verify reimbursement");
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="text-lg font-semibold text-white mb-1">
              Goal Achieved
            </h2>
            <p className="text-sm text-gray-400">{goalData.goal}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">
              Your deposit is returned
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Your deposit will be returned to your account within 24 hours
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-white mb-2"
            >
              Be sure you received the correct amount by enter the amount below
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ₫
              </span>
              <input
                id="amount"
                type="number"
                required
                className="w-full pl-8 pr-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the amount you received"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-white w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </>
            ) : (
              "Set a new goal"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
