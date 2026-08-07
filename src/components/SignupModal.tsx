import { useState, useEffect } from "react";
import { Mail, Lock, X, Eye, EyeOff } from "lucide-react";
import { signUp } from "../lib/auth";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({
  isOpen,
  onClose,
}: SignupModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
const [passwordError, setPasswordError] = useState("");
const [confirmPasswordError, setConfirmPasswordError] = useState("");
useEffect(() => {
  if (!isOpen) {
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  }
}, [isOpen]);

  if (!isOpen) return null;
const handleSignup = async () => {


  let valid = true;

  setEmailError("");
  setPasswordError("");
  setConfirmPasswordError("");

  if (!email.trim()) {
    setEmailError("Email is required");
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email.trim() && !emailRegex.test(email)) {
    setEmailError("Please enter a valid email");
    valid = false;
  }

  if (!password.trim()) {
    setPasswordError("Password is required");
    valid = false;
  }

  if (!confirmPassword.trim()) {
    setConfirmPasswordError("Confirm Password is required");
    valid = false;
  }

  if (
    password.trim() &&
    confirmPassword.trim() &&
    password !== confirmPassword
  ) {
    setConfirmPasswordError("Passwords do not match");
    valid = false;
  }

  if (!valid) return;

  console.log("Signup started", email);
const result = await signUp(email, password);
console.log("USER:", result.data.user);
console.log("SESSION:", result.data.session);
console.log("FULL RESULT:", result);

if (result.error) {
  alert(result.error.message);
  return;
}

alert("Account created successfully! 🎉");

onClose();

};

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Create Account 🎉
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Create your Veehaan Toys account
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
<div className="p-6 space-y-5">

  {/* Email */}
  <div>
    <label className="block text-sm font-medium mb-2">
      Email
    </label>

    <div className="flex items-center border rounded-xl px-4 py-3">
      <Mail size={18} className="text-gray-400 mr-3" />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full outline-none"
      />
      {emailError && (
  <p className="mt-2 text-sm text-red-500">
    {emailError}
  </p>
)}
    </div>
  </div>

  {/* Password */}
  <div>
    <label className="block text-sm font-medium mb-2">
      Password
    </label>

    <div className="flex items-center border rounded-xl px-4 py-3">
      <Lock size={18} className="text-gray-400 mr-3" />

      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          className="w-full outline-none pr-10"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  </div>
{passwordError && (
  <p className="mt-2 text-sm text-red-500">
    {passwordError}
  </p>
)}
  <div>
  <label className="block text-sm font-medium mb-2">
    Confirm Password
  </label>

  <div className="flex items-center border rounded-xl px-4 py-3">
    <Lock size={18} className="text-gray-400 mr-3" />

    <input
      type={showPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Confirm your password"
      className="w-full outline-none"
    />
  </div>
</div>
{confirmPasswordError && (
  <p className="mt-2 text-sm text-red-500">
    {confirmPasswordError}
  </p>
)}    
<button
  onClick={handleSignup}
  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
>
  Create Account
</button>

</div>

      </div>
    </div>
  );
}