import React, { useState } from "react";
import type { AxiosError } from "axios";
import { ShieldCheck } from "lucide-react";
import { Axios } from "../middlewares/Axios";
import type { ApiErrorResponse } from "../Types/indexTypes";

interface LoginResponse {
  token: string;
  message: string;
}

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    phoneNumber: "",
    password: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { phoneNumber: "", password: "" };

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Введите номер телефона";
      valid = false;
    } else if (!/^\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Номер телефона должен содержать ровно 9 цифр";
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Введите пароль";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать не менее 6 символов";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = (
        await Axios.post<LoginResponse>("/auth/login", formData)
      ).data;

      if (response.token) {
        localStorage.setItem("ssctoken", response.token);
        window.location.href = "/";
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setError(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "Что-то пошло не так, попробуйте ещё раз"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-black/5 bg-white/75 shadow-xl backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="admin-text-on-dark hidden bg-[#101820] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <ShieldCheck className="h-6 w-6 text-[#d7ab52]" />
            </div>
            <h1 className="admin-display mt-6 text-5xl leading-none">Seven</h1>
            <p className="admin-text-on-dark-muted mt-2 text-[11px] uppercase tracking-[0.22em]">
              Sport Center Admin
            </p>
          </div>
          <p className="admin-text-on-dark-soft max-w-xs text-sm leading-6">
            Boshqaruv paneliga kirib murabbiylar, bloglar va administratorlar
            ma&apos;lumotlarini bir joydan boshqaring.
          </p>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="flex w-full flex-col gap-5 p-7 md:p-9"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#c4452d]">
              Xush kelibsiz
            </p>
            <h2 className="admin-display mt-2 text-4xl leading-none text-[var(--admin-ink)]">
              Tizimga kirish
            </h2>
            <p className="mt-3 text-sm text-[var(--admin-muted)]">
              Boshqaruv paneliga kirish uchun ma&apos;lumotlaringizni kiriting.
            </p>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <label className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              Номер телефона <span className="text-red-600">*</span>
            </p>
            <input
              type="text"
              name="phoneNumber"
              placeholder="90 123 45 67"
              className={`rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
                errors.phoneNumber
                  ? "border-red-600"
                  : "border-black/10 focus:border-[#c4452d]"
              }`}
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              Пароль <span className="text-red-600">*</span>
            </p>
            <input
              type="password"
              name="password"
              placeholder="EasyPass1234"
              className={`rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
                errors.password
                  ? "border-red-600"
                  : "border-black/10 focus:border-[#c4452d]"
              }`}
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </label>

          <button
            type="submit"
            className="admin-text-on-dark rounded-xl bg-[#c4452d] py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] transition hover:bg-[#8f2917] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Войти"}
          </button>
        </form>
      </div>
    </section>
  );
};
