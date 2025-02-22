import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

interface Goal {
  id: string;
  goal: string;
  deadline: string;
  time: string;
  epochTimestamp: number;
  userId: string;
  amount: number;
  transactionId: string;
  updatedAt: number;
  status: string;
  createdAt: number;
}

export default function GoalSetting() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    goal: "",
    deadline: "",
    time: "18:00", // Default time
  });

  useEffect(() => {
    const checkExistingGoals = async () => {
      try {
        if (!currentUser?.uid) return;

        // Query goals collection for active goals
        const goalsRef = collection(db, "goals");
        const q = query(
          goalsRef,
          where("userId", "==", currentUser.uid),
          where("status", "in", ["pending", "in_progress", "success"])
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const goals = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Goal[];

          for (const goal of goals) {
            switch (goal.status) {
              case "pending":
                navigate("/waiting-confirmation", {
                  state: {
                    goal: goal.goal,
                    deadline: goal.deadline,
                    time: goal.time,
                    epochTimestamp: goal.epochTimestamp,
                    goalId: goal.id,
                    amount: goal.amount,
                    transactionId: goal.transactionId,
                  },
                  replace: true,
                });
                break;

              case "in_progress":
                navigate("/timer", {
                  state: {
                    goal: goal.goal,
                    deadline: goal.deadline,
                    time: goal.time,
                    epochTimestamp: goal.epochTimestamp,
                    goalId: goal.id,
                    amount: goal.amount,
                    transactionId: goal.transactionId,
                  },
                  replace: true,
                });
                break;

              case "success":
                navigate("/goal-success", {
                  state: {
                    goal: goal.goal,
                    amount: goal.amount,
                    goalId: goal.id,
                  },
                  replace: true,
                });
                break;
            }
          }
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to check existing goals");
        setLoading(false);
      }
    };

    checkExistingGoals();
  }, [currentUser, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      // Convert deadline and time to timestamp
      const dateTime = new Date(`${formData.deadline}T${formData.time}`);
      const epochTimestamp = dateTime.getTime();

      //   for goal status:
      // pending mean created
      // in_progress mean deposited
      // success mean achieved goal but not reclaim
      // failed mean not achieved
      // completed mean achieved goal and reclaim money
      // Create goal document
      const goalData = {
        goal: formData.goal,
        deadline: formData.deadline,
        time: formData.time,
        epochTimestamp,
        userId: currentUser?.uid,
        amount: 0,
        transactionId: null,
        updatedAt: new Date().getTime(),
        status: "pending",
        createdAt: new Date().getTime(),
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "goals"), goalData);

      // Navigate to deposit page with goal data
      navigate("/deposit", {
        state: {
          goal: formData.goal,
          deadline: formData.deadline,
          time: formData.time,
          epochTimestamp,
          goalId: docRef.id,
        },
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-[440px] p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Set your goal
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8">
          What do you want to achieve or what habit you want to shape?
        </p>

        {error && (
          <div className="bg-red-500 bg-opacity-10 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-white mb-2"
            >
              Your Goal
            </label>
            <textarea
              id="goal"
              required
              rows={3}
              className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="e.g., Learn to play guitar"
              value={formData.goal}
              onChange={(e) =>
                setFormData({ ...formData, goal: e.target.value })
              }
            />
          </div>

          <div className="text-left">
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-white mb-2"
            >
              Deadline Date
            </label>
            <input
              id="deadline"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
            />
          </div>

          <div className="text-left">
            <label
              htmlFor="time"
              className="block text-sm font-medium text-white mb-2"
            >
              Deadline Time
            </label>
            <input
              id="time"
              type="time"
              required
              className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-white w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating goal..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
