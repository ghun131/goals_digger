import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";

export default function GoalSetting() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    goal: "",
    deadline: "",
    time: "18:00", // Default time
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setError("");
      setLoading(true);

      // Convert deadline and time to timestamp
      const dateTime = new Date(`${formData.deadline}T${formData.time}`);
      const epochTimestamp = dateTime.getTime();

      // Create goal document
      const goalData = {
        goal: formData.goal,
        deadline: formData.deadline,
        time: formData.time,
        epochTimestamp,
        userId: currentUser?.uid,
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
          goalId: docRef.id
        }
      });

    } catch (err) {
      console.error(err);
      setError("Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-[440px] p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Set your goal
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8">
          What do you want to achieve?
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
              min={new Date().toISOString().split('T')[0]}
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