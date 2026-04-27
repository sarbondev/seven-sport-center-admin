import type React from "react";
import { useState } from "react";
import { Axios } from "../../middlewares/Axios";
import type { ApiErrorResponse } from "../../Types/indexTypes";
import type { AxiosError } from "axios";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordDialog = ({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      console.log({
        title: "Xatolik",
        description: "Yangi parollar mos kelmaydi",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      console.log({
        title: "Xatolik",
        description: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await Axios.post("auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      console.log({
        title: "Muvaffaqiyat",
        description: "Parol muvaffaqiyatli o'zgartirildi",
      });
      onOpenChange(false);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.log({
        title: "Xatolik",
        description:
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "Parolni o'zgartirishda xatolik",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[var(--admin-ink)]">
            Parolni o'zgartirish
          </h2>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">
            Yangi parolni kiriting. Parol kamida 6 ta belgidan iborat bo'lishi
            kerak.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {/* Current Password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-1 block text-sm font-medium text-[var(--admin-ink)]"
              >
                Joriy parol
              </label>
              <input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Joriy parolni kiriting"
              />
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="mb-1 block text-sm font-medium text-[var(--admin-ink)]"
              >
                Yangi parol
              </label>
              <input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Yangi parolni kiriting"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-[var(--admin-ink)]"
              >
                Yangi parolni tasdiqlang
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Yangi parolni qayta kiriting"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[var(--admin-ink)] transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-text-on-dark flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <svg
                  className="admin-text-on-dark -ml-1 mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              O'zgartirish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordDialog;
