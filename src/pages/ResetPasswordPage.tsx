import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { updatePassword } from "../lib/auth";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [recoverySession, setRecoverySession] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkRecoverySession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        setRecoverySession(true);
      }

      setCheckingSession(false);
    };

    checkRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY" && session) {
        setRecoverySession(true);
        setCheckingSession(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async () => {
    setPasswordError("");
    setSuccessMessage("");

    if (!newPassword.trim()) {
      setPasswordError("New password is required");
      return;
    }

    if (!confirmPassword.trim()) {
      setPasswordError("Please confirm your password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(newPassword);

    setLoading(false);

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setSuccessMessage(
      "Your password has been updated successfully."
    );

    setNewPassword("");
    setConfirmPassword("");
  };

  if (checkingSession) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-gray-500">Verifying reset link...</p>
      </div>
    );
  }

  if (!recoverySession) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Reset Link Invalid
          </h1>

          <p className="text-gray-500 mt-3">
            This password reset link is invalid or has expired.
            Please request a new reset link.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Password Updated
          </h1>

          <p className="text-green-600 mt-3">
            {successMessage}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-6 border-b text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Reset Password
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Enter your new password below.
          </p>
        </div>

        <div className="p-6 space-y-5">

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>

            <div className="flex items-center border rounded-xl px-4 py-3">
              <Lock size={18} className="text-gray-400 mr-3" />

              <div className="relative w-full">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter new password"
                  className="w-full outline-none pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>

            <div className="flex items-center border rounded-xl px-4 py-3">
              <Lock size={18} className="text-gray-400 mr-3" />

              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Confirm new password"
                  className="w-full outline-none pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {passwordError && (
            <p className="text-sm text-red-500">
              {passwordError}
            </p>
          )}

          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </div>
      </div>
    </div>
  );
}