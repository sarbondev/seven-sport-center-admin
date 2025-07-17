import React, { useState } from "react";
import { Axios } from "../../middlewares/Axios";

type ModalProps = {
  setIsModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: any;
};

export const AdminModal: React.FC<ModalProps> = ({
  setIsModalActive,
  mutate,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { fullName: "", phoneNumber: "", password: "" };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Введите ваше полное имя";
      valid = false;
    }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await Axios.post("auth/register", formData);
      if (response.data) {
        alert("Администратор успешно добавлен!");
        setIsModalActive(false);
        mutate();
      }
    } catch (error: any) {
      alert(error.response?.data.message || "Произошла ошибка");
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("modal-overlay")) {
      setIsModalActive(false);
    }
  };

  return (
    <div
      className="w-full h-screen fixed left-0 top-0 bg-black bg-opacity-75 backdrop-blur-md flex justify-end modal-overlay"
      onClick={handleOutsideClick}
    >
      <form
        onSubmit={handleSubmit}
        className="h-full w-full md:max-w-lg flex flex-col gap-6 p-6 bg-white"
      >
        <h1 className="text-center text-xl font-bold">
          Создать нового администратора
        </h1>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>
            Введите ваше полное имя <span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            name="fullName"
            className={`outline-none border p-2 rounded-md ${
              errors.fullName ? "border-red-600" : "border-black"
            }`}
            value={formData.fullName}
            onChange={handleInputChange}
          />
          {errors.fullName && <p className="text-red-600">{errors.fullName}</p>}
        </label>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>
            Введите ваш номер телефона <span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            name="phoneNumber"
            className={`outline-none border p-2 rounded-md ${
              errors.phoneNumber ? "border-red-600" : "border-black"
            }`}
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          {errors.phoneNumber && (
            <p className="text-red-600">{errors.phoneNumber}</p>
          )}
        </label>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>
            Введите ваш пароль <span className="text-red-600">*</span>
          </p>
          <input
            type="password"
            name="password"
            className={`outline-none border p-2 rounded-md ${
              errors.password ? "border-red-600" : "border-black"
            }`}
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="text-red-600">{errors.password}</p>}
        </label>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsModalActive(false)}
            className="bg-red-600 text-white px-2 rounded-md"
          >
            Назад
          </button>
          <button type="submit" className="bg-black text-white px-2 rounded-md">
            Создать
          </button>
        </div>
      </form>
    </div>
  );
};
