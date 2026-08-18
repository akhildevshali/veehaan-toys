import { useState } from "react";
import { Mail, Lock, X, Eye, EyeOff } from 'lucide-react'
import { signIn, resetPassword } from "../lib/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onCreateAccount,
}: LoginModalProps) {
  const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [showPassword, setShowPassword] = useState(false)
const [emailError, setEmailError] = useState("")
const [passwordError, setPasswordError] = useState("")
const [isForgotPassword, setIsForgotPassword] = useState(false)
const [resetLoading, setResetLoading] = useState(false)
const [resetMessage, setResetMessage] = useState("")

  if (!isOpen) return null;
  const handleLogin = async () => {
  let valid = true

  setEmailError("")
  setPasswordError("")

  if (!email.trim()) {
    setEmailError("Email is required")
    valid = false
  }
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if (email.trim() && !emailRegex.test(email)) {
  setEmailError("Please enter a valid email")
  valid = false
}
  if (!password.trim()) {
    setPasswordError("Password is required")
    valid = false
  }

if (!valid) return;

const { error } = await signIn(email, password);

if (error) {
  alert(error.message);
  return;
}

onClose();
}

const handleForgotPassword = async () => {
  setEmailError("")
  setResetMessage("")

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.trim()) {
    setEmailError("Email is required")
    return
  }

  if (!emailRegex.test(email)) {
    setEmailError("Please enter a valid email")
    return
  }

  setResetLoading(true)

  const { error } = await resetPassword(
    email.trim(),
    `${window.location.origin}/reset-password`
  )

  setResetLoading(false)

  if (error) {
    setEmailError(error.message)
    return
  }

  setResetMessage(
    "If an account exists with this email, a password reset link has been sent. Please check your inbox."
  )
}


  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back 👋
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Login to your Veehaan Toys account
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
        <form
  className="p-6 space-y-5"
  onSubmit={(e) => {
    e.preventDefault();

    if (isForgotPassword) {
      handleForgotPassword();
    } else {
      handleLogin();
    }
  }}
>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <div className="flex items-center border rounded-xl px-4 py-3">
              <Mail size={18} className="text-gray-400 mr-3" />

              <input
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value)
    setEmailError("")
  }}
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

          {!isForgotPassword && (
  <>
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
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError("")
            }}
            placeholder="Enter your password"
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

    <div className="flex justify-end">
      <button
        type="button"
        onClick={() => {
          setIsForgotPassword(true)
          setEmailError("")
          setResetMessage("")
        }}
        className="text-sm text-red-500 hover:underline"
      >
        Forgot Password?
      </button>
    </div>
  </>
)}

{isForgotPassword && (
  <>
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-800">
        Forgot Password?
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        Enter your email and we'll send you a password reset link.
      </p>
    </div>

    {resetMessage && (
      <p className="text-sm text-green-600 text-center">
        {resetMessage}
      </p>
    )}

    <button
      type="button"
      onClick={handleForgotPassword}
      disabled={resetLoading}
      className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl transition"
    >
      {resetLoading ? "Sending..." : "Send Reset Link"}
    </button>

    <button
      type="button"
      onClick={() => {
        setIsForgotPassword(false)
        setResetMessage("")
        setEmailError("")
      }}
      className="w-full text-sm text-gray-600 hover:text-red-500"
    >
      ← Back to Login
    </button>
  </>
)}

          {!isForgotPassword && (
  <button
    type="submit"
    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
  >
    Login
  </button>
)}

          <div className="text-center text-sm text-gray-500">
            New Customer?

            <button
            type="button"
  onClick={onCreateAccount}
  className="ml-2 text-red-500 font-semibold hover:underline"
>
  Create Account
</button>
          </div>

        </form>

      </div>
    </div>
  );
}