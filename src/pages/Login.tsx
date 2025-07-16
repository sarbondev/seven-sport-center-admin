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
        await Axios.post<LoginResponse>("auth/login", formData)
      ).data;
      if (response.token) {
        localStorage.setItem("ssctoken", response.token);
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
    <section className="flex justify-center items-center h-screen p-4 bg-slate-100">
      <form
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
        className="w-full md:max-w-md flex flex-col gap-6 p-10 bg-white rounded-md"
        onSubmit={handleFormSubmit}
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-500">
            7sportcenter
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Войдите, чтобы получить доступ к панели управления
          </p>
        </div>
        {error && (
          <p className="text-red-600 text-center bg-red-100 py-2 rounded-md">
            {error}
          </p>
        )}
        <label className="flex flex-col gap-2">
          <p className="text-sm">
            Номер телефона
            <span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            name="phoneNumber"
            placeholder="90 123 45 67"
            className={`outline-none border text-sm p-2 ${
              errors.phoneNumber ? "border-red-600" : "border-gray-500"
            } rounded-md`}
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          {errors.phoneNumber && (
            <p className="text-red-600 text-sm">{errors.phoneNumber}</p>
          )}
        </label>
        <label className="flex flex-col gap-2">
          <p className="text-sm">
            Пароль <span className="text-red-600">*</span>
          </p>
          <input
            type="password"
            name="password"
            placeholder="EasyPass1234"
            className={`outline-none border text-sm p-2 ${
              errors.password ? "border-red-600" : "border-gray-500"
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
          className={`bg-red-600 text-white py-3 text-sm uppercase font-semibold rounded-md ${
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
