import { FormEvent, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import bankQR from "../assets/host_bank_qr.jpeg";

interface LocationState {
  goal: string;
  deadline: string;
  time: string;
  epochTimestamp: number;
  goalId: string;
}

export default function DepositBet() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const goalData = location.state as LocationState;
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    transactionId: "",
  });

  useEffect(() => {
    const checkExistingGoal = async () => {
      try {
        if (!currentUser?.uid) return;

        // Query goals collection for in_progress goals
        const goalsRef = collection(db, "goals");
        const q = query(
          goalsRef,
          where("userId", "==", currentUser.uid),
          where("status", "==", "in_progress")
        );

        const querySnapshot = await getDocs(q);

        // If user has an in_progress goal, redirect to timer
        if (!querySnapshot.empty) {
          const goalDoc = querySnapshot.docs[0];
          const goalData = goalDoc.data();

          navigate("/timer", {
            state: {
              goal: goalData.goal,
              deadline: goalData.deadline,
              time: goalData.time,
              epochTimestamp: goalData.epochTimestamp,
              goalId: goalDoc.id,
              amount: goalData.amount,
              transactionId: goalData.transactionId,
            },
            replace: true,
          });
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to check existing goals");
        setLoading(false);
      }
    };

    checkExistingGoal();
  }, [currentUser, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) < 10000) {
      setError("Please enter a valid amount (minimum 10,000 VND)");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Update goal document with deposit amount
      const goalRef = doc(db, "goals", goalData.goalId);
      await updateDoc(goalRef, {
        amount: Number(formData.amount),
        transactionId: formData.transactionId || null,
        updatedAt: new Date().getTime(),
      });

      // Navigate to waiting confirmation page
      navigate("/waiting-confirmation", {
        state: {
          ...goalData,
          amount: Number(formData.amount),
          transactionId: formData.transactionId,
        },
        replace: true,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to process deposit");
    } finally {
      setLoading(false);
    }
  };

  const deadlineDate = new Date(goalData?.epochTimestamp).toLocaleString();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-[440px] mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Bet on your goal
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8">
          Make a deposit to commit to your goal
        </p>

        {error && (
          <div className="bg-red-500 bg-opacity-10 text-black px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">Your Goal</h2>
          <div className="relative">
            <p
              onClick={() =>
                goalData?.goal?.length > 50 && setIsExpanded(!isExpanded)
              }
              className={`text-gray-400 ${!isExpanded && "line-clamp-1"} ${
                goalData?.goal?.length > 50
                  ? "cursor-pointer hover:text-gray-300"
                  : ""
              }`}
            >
              {goalData?.goal}
            </p>
            <p className="text-sm text-gray-500 mt-1">Due by: {deadlineDate}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">
            Make a transfer to:
          </h3>
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
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-white mb-2"
            >
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
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          <div className="text-left">
            <label
              htmlFor="transactionId"
              className="block text-sm font-medium text-white mb-2"
            >
              Transaction Reference (Optional)
            </label>
            <input
              id="transactionId"
              type="text"
              className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Transaction reference (Transfer message, etc.)"
              value={formData.transactionId}
              onChange={(e) =>
                setFormData({ ...formData, transactionId: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-white w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Confirm Deposit"}
          </button>
        </form>
      </div>
    </div>
  );
}
