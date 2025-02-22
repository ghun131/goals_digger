import { FormEvent, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import EyeIcon from "../assets/icons/EyeIcon";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import banks from "./bank.json";

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    bankName: "",
    bankingNumber: "",
  });
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  // Filter banks based on search term
  // TODO: Bank infor should be in database
  const filteredBanks = banks.filter((bank) =>
    bank.bank_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close select dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!formData.bankName) {
      return setError("Please select your bank");
    }

    if (!formData.bankingNumber) {
      return setError("Please enter your banking number");
    }

    try {
      setError("");
      setLoading(true);

      // Create user account
      const userCredential = await signUp(formData.email, formData.password);
      const userId = userCredential.user.uid;

      // Save user data to Firestore
      await setDoc(doc(db, "users", userId), {
        email: formData.email,
        bankName: formData.bankName,
        bankingNumber: formData.bankingNumber,
        createdAt: new Date().getTime(),
      });

      navigate("/goals");
    } catch (err) {
      console.error(err);
      setError("Failed to create an account");
    } finally {
      setLoading(false);
    }
  };

  const handleBankSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, bankName: value });
    setSearchTerm(value);
    setIsSelectOpen(true);
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-[440px] p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Create an account
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8">
          Enter your details to get started
        </p>

        {error && (
          <div className="bg-red-500 bg-opacity-10 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="m@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="text-left">
            <label
              htmlFor="bankName"
              className="block text-sm font-medium text-white mb-2"
            >
              Select Bank
            </label>
            <div className="relative" ref={selectRef}>
              <input
                id="bankName"
                type="text"
                className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search for your bank..."
                value={formData.bankName}
                onChange={handleBankSearch}
                onFocus={() => setIsSelectOpen(true)}
              />

              {isSelectOpen && filteredBanks.length > 0 && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-black border border-zinc-700 rounded-lg shadow-lg">
                  <div className="max-h-60 overflow-auto bg-black">
                    {filteredBanks.map((bank) => (
                      <button
                        key={bank.bank_name}
                        type="button"
                        className="w-full px-4 py-2 text-left bg-black hover:bg-zinc-800 focus:outline-none !text-white"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            bankName: bank.bank_name,
                          });
                          setIsSelectOpen(false);
                          setSearchTerm(bank.bank_name);
                        }}
                      >
                        {bank.bank_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-left">
            <label
              htmlFor="bankingNumber"
              className="block text-sm font-medium white mb-2"
            >
              Banking Number
            </label>
            <input
              id="bankingNumber"
              type="text"
              required
              className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your banking number"
              value={formData.bankingNumber}
              onChange={(e) =>
                setFormData({ ...formData, bankingNumber: e.target.value })
              }
            />
          </div>

          <div className="text-left">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeIcon isVisible={showPassword} />
              </button>
            </div>
          </div>

          <div className="text-left">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <EyeIcon isVisible={showConfirmPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-white w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4 mb-2">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-white hover:text-gray-200">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
