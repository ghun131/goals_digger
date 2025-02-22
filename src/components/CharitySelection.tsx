import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  DocumentReference,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

interface GoalLocationState {
  goal: string;
  amount: number;
  goalId: string;
  epochTimestamp: number;
}

interface Donation {
  amount: number;
  status: "pending" | "completed";
  org_id: string;
  org_name: string;
  org_description: string;
  org_link: string;
  message: string;
  userRef: DocumentReference;
  goalRef: DocumentReference;
  createdAt: number;
  updatedAt: number;
}

const CHARITIES = [
  {
    id: "qtnvc",
    name: "Quỹ trò nghèo vùng cao",
    description:
      "The Trò Nghèo Vùng Cao Fund (formerly the Cơm Có Thịt Program) is a non-profit charity supporting underprivileged students in Vietnam’s highland areas. The fund provides nutritious meals, warm clothing, school supplies, dormitories, and other essential assistance to improve their learning and living conditions.",
    link: "https://tnvc.vn/",
  },
  {
    // id should be short in lowercase
    id: "ccumctekt",
    name: "Chắp cánh ước mơ cho trẻ em khuyết tật",
    description:
      'The "Chắp cánh ước mơ cho trẻ em khuyết tật" program calls for collective support to provide scholarships, rehabilitation assistance, medical care, and opportunities for disabled children to pursue their dreams and build a brighter future.',
    link: "https://1400.vn/chuong-trinh/trien-khai-chuong-trinh--chap-canh-uoc-mo-cho-tre-em-khuyet-tat-pass1255",
  },
  {
    id: "qbttevn",
    name: "Quỹ bảo trợ trẻ em Việt Nam",
    description:
      'The "Quỹ bảo trợ trẻ em Việt Nam" was established to mobilize voluntary contributions from organizations and individuals domestically and internationally, as well as international aid and state budget support when necessary, to achieve government-prioritized goals for child welfare.',
    link: "https://nfvc.molisa.gov.vn/contact",
  },
  {
    id: "vteemkttvn",
    name: "Vì trẻ em khuyết tật Việt Nam",
    description:
      'The "Vì trẻ em khuyết tật Việt Nam" serves as a bridge to coordinate support activities, seeking contributions and collaboration from organizations and individuals both domestically and internationally. The fund aims to improve the physical and mental well-being of disabled children, ensure their rights, and inspire hope for a brighter future.',
    link: "https://vitreemkhuyettat.org/dong-hanh.html",
  },
  {
    id: "qttcd",
    name: "Quỹ từ thiện vì Cộng Đồng",
    description:
      'The "Quỹ từ thiện vì Cộng Đồng" is a non-profit organization that mobilizes resources to support charitable programs, assist disadvantaged Vietnamese citizens, promote public health, and aid in disaster recovery, contributing to a sustainable future.',
    link: "https://comfunds.vn/",
  },
];

export default function CharitySelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const goalData = location.state as GoalLocationState;
  console.log("goalData:", goalData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [existingDonation, setExistingDonation] = useState<Donation | null>(
    null
  );

  useEffect(() => {
    const checkExistingDonation = async () => {
      try {
        if (!currentUser?.uid || !goalData?.goalId) return;

        const donationsRef = collection(db, "donations");
        const q = query(
          donationsRef,
          where("userRef", "==", doc(db, "users", currentUser.uid)),
          where("goalRef", "==", doc(db, "goals", goalData.goalId))
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const donationData = querySnapshot.docs[0].data() as Donation;

          if (donationData.status === "completed") {
            navigate("/goals", { replace: true });
            return;
          }

          setExistingDonation(donationData);
        }
      } catch (err) {
        console.error("Error checking donations:", err);
        setError("Failed to check donation status");
      } finally {
        setLoading(false);
      }
    };

    checkExistingDonation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = async (charityId: string) => {
    try {
      setLoading(true);
      setError("");

      const selectedCharity = CHARITIES.find(
        (charity) => charity.id === charityId
      );
      if (!selectedCharity) {
        throw new Error("Charity not found");
      }

      // Update goal status to donating
      await updateDoc(doc(db, "goals", goalData.goalId), {
        status: "donating",
        updatedAt: new Date().getTime(),
      });

      // Create donation record
      const donationData = {
        status: "pending", // pending, completed
        org_id: selectedCharity.id,
        org_name: selectedCharity.name,
        org_description: selectedCharity.description,
        org_link: selectedCharity.link,
        message: `${currentUser?.email} supports ${selectedCharity.name}`,
        userRef: doc(db, "users", currentUser?.uid || ""),
        goalRef: doc(db, "goals", goalData.goalId),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      };

      await addDoc(collection(db, "donations"), donationData);
      setExistingDonation(donationData as Donation);
    } catch (err) {
      console.error("Error processing donation:", err);
      setError("Failed to process donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async () => {
    try {
      setLoading(true);
      setError("");

      // Get the donation document reference
      const donationsRef = collection(db, "donations");
      const q = query(
        donationsRef,
        where("userRef", "==", doc(db, "users", currentUser?.uid || "")),
        where("goalRef", "==", doc(db, "goals", goalData.goalId))
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Update donation status to completed
        await updateDoc(querySnapshot.docs[0].ref, {
          status: "completed",
          updatedAt: new Date().getTime(),
        });

        // Update goal status to failed
        await updateDoc(doc(db, "goals", goalData.goalId), {
          status: "failed",
          updatedAt: new Date().getTime(),
        });

        navigate("/goals", { replace: true });
      }
    } catch (err) {
      console.error("Error confirming donation:", err);
      setError("Failed to confirm donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (existingDonation) {
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Thank You!
            </h1>
            <p className="text-base sm:text-lg text-gray-400">
              Your donation is being processed
            </p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Donation Details
            </h2>
            <div className="space-y-2">
              <p className="text-gray-400">
                Amount:{" "}
                <span className="text-white">
                  {existingDonation.amount.toLocaleString()} VND
                </span>
              </p>
              <p className="text-gray-400">
                Organization:{" "}
                <span className="text-white">{existingDonation.org_name}</span>
              </p>
              <p className="text-gray-400">
                Organization Link:{" "}
                <span className="text-white">
                  <a
                    href={existingDonation.org_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {existingDonation.org_link}
                  </a>
                </span>
              </p>
              <p className="text-gray-400">
                Message:{" "}
                <span className="text-white">{existingDonation.message}</span>
              </p>
              <p className="text-gray-400">
                Status:{" "}
                <span className="text-white capitalize">
                  {existingDonation.status}
                </span>
              </p>
            </div>
          </div>

          <div className="text-gray-400 text-sm">
            Use the <span className="font-bold">message</span> to confirm you
            have checked with the organization to make sure your donation is
            valid.
          </div>
          <button
            onClick={handleConfirmation}
            disabled={loading}
            className={`bg-white mt-3 w-full py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-100 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Confirming...
              </div>
            ) : (
              "Confirmed!"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-[440px] mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Select a Charity
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8">
          Choose where you'd like to make your impact
        </p>

        {error && (
          <div className="bg-red-500 bg-opacity-10 text-black px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {CHARITIES.map((charity) => (
            <div
              key={charity.id}
              onClick={() => !loading && handleSelect(charity.id)}
              className={`p-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <h3 className="text-lg font-semibold text-white mb-1">
                {charity.name}
              </h3>
              <p className="text-sm text-gray-400 text-justify">
                {charity.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Donation amount:{" "}
          <span className="text-white font-bold">
            {goalData?.amount?.toLocaleString()} VND
          </span>
        </p>
      </div>
    </div>
  );
}
