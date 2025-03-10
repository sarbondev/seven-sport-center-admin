import React, { useState } from "react";
import { Axios } from "../middlewares/Axios";

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
        await Axios.post<LoginResponse>("users/login", formData)
      ).data;
      if (response.token) {
        localStorage.setItem("token", response.token);
        window.location.href = "/";
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Что-то пошло не так, попробуйте ещё раз"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen p-4 bg-slate-200">
      <form
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
        className="w-full md:max-w-lg flex flex-col gap-6 px-8 py-16 bg-white rounded-md"
        onSubmit={handleFormSubmit}
      >
        <h1 className="text-center text-2xl font-bold">Вход</h1>
        {error && (
          <p className="text-red-600 text-center bg-red-100 py-2 rounded-md">
            {error}
          </p>
        )}
        <label className="flex flex-col gap-2">
          <p>
            Введите ваш номер телефона <span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            name="phoneNumber"
            className={`outline-none border text-sm p-2 ${
              errors.phoneNumber ? "border-red-600" : "border-black"
            } rounded-md`}
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          {errors.phoneNumber && (
            <p className="text-red-600 text-sm">{errors.phoneNumber}</p>
          )}
        </label>
        <label className="flex flex-col gap-2">
          <p>
            Введите ваш пароль <span className="text-red-600">*</span>
          </p>
          <input
            type="password"
            name="password"
            className={`outline-none border text-sm p-2 ${
              errors.password ? "border-red-600" : "border-black"
            } rounded-md`}
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password}</p>
          )}
        </label>
        <button
          type="submit"
          className={`bg-black text-white p-2 text-sm uppercase font-semibold rounded-md ${
            isLoading ? "opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Загрузка..." : "Войти"}
        </button>
      </form>
    </section>
  );
};
