import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import RefreshIcon from "../assets/icons/RefreshIcon";

interface LocationState {
  goal: string;
  deadline: string;
  time: string;
  epochTimestamp: number;
  goalId: string;
  amount: number;
  transactionId: string;
}

export default function WaitingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const goalData = location.state as LocationState;
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "goals", goalData.goalId), (doc) => {
      const data = doc.data();
      if (data?.status === "in_progress") {
        navigate("/timer");
      }
    });

    return () => unsubscribe();
  }, [goalData, navigate]);

  const handleRefresh = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);

      // Get latest goal data
      const goalDoc = await getDoc(doc(db, "goals", goalData.goalId));
      const data = goalDoc.data();

      if (data?.status === "in_progress") {
        navigate("/timer", {
          state: {
            ...goalData,
          },
          replace: true,
        });
      }
    } catch (err) {
      console.error("Error checking goal status:", err);
    } finally {
      // Keep spinning for a short duration even if check is fast
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-[440px] mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Waiting for Confirmation
        </h1>

        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-lg">
            <p className="text-base sm:text-lg text-gray-400">
              We're confirming your deposit...
            </p>
            <button
              onClick={handleRefresh}
              className={`!p-0 text-gray-400 hover:text-white transition-all rounded-lg
                ${isRefreshing ? "animate-spin" : "hover:bg-zinc-800"}`}
            >
              <RefreshIcon />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Deposit Details
          </h2>
          <div className="space-y-2 text-gray-400">
            <p>Amount: {goalData.amount.toLocaleString()} VND</p>
            {goalData.transactionId && (
              <p>Transaction Reference: {goalData.transactionId}</p>
            )}
          </div>
        </div>

        <div className="animate-pulse flex justify-center items-center space-x-2 text-white">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>

        <p className="text-sm text-gray-400 mt-8 text-center">
          Please wait while we confirm your deposit. This may take a few
          minutes.
        </p>
      </div>
    </div>
  );
}
