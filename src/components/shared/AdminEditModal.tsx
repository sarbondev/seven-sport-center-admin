import React, { useState, useEffect } from "react";
import { Axios } from "../../middlewares/Axios";
import useSWR from "swr";
import { fetcher } from "../../middlewares/Fetcher";
import { UserTypes } from "../../Types/indexTypes";

type EditDataTypes = {
  id: string;
  isEditing: boolean;
};

type ModalProps = {
  editData: EditDataTypes;
  setEditData: React.Dispatch<React.SetStateAction<EditDataTypes>>;
};

export const AdminEditModal: React.FC<ModalProps> = ({
  editData,
  setEditData,
}) => {
  const { data, error, isLoading, mutate } = useSWR<UserTypes[]>(
    `/admin`,
    fetcher
  );

  const [formData, setFormData] = useState<UserTypes>({
    _id: "",
    fullName: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });

  useEffect(() => {
    if (data) {
      const user = data.find((user) => user._id === editData.id);
      if (user) setFormData({ ...user, password: "" });
    }
  }, [data, editData.id]);

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
      newErrors.password = "Пароль обязателен";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать не менее 6 символов";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await Axios.put(`admin/${editData.id}`, formData);
      if (response.data) {
        setEditData((prevData) => ({ ...prevData, isEditing: false }));
        mutate();
      }
    } catch (error: any) {
      alert(error.response?.data.message || "Произошла ошибка");
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("modal-overlay")) {
      setEditData((prevData) => ({ ...prevData, isEditing: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="h-16 w-16 border-[6px] border-dotted border-black animate-spin rounded-full"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }

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
          Редактировать администратора
        </h1>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>
            Введите ваше полное имя <span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            name="fullName"
            onChange={handleInputChange}
            value={formData.fullName}
            className={`outline-none border p-2 rounded-md ${
              errors.fullName ? "border-red-600" : "border-black"
            }`}
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
            onChange={handleInputChange}
            value={formData.phoneNumber}
            className={`outline-none border p-2 rounded-md ${
              errors.phoneNumber ? "border-red-600" : "border-black"
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-red-600">{errors.phoneNumber}</p>
          )}
        </label>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>Введите новый пароль</p>
          <input
            type="password"
            name="password"
            onChange={handleInputChange}
            className={`outline-none border p-2 rounded-md ${
              errors.password ? "border-red-600" : "border-black"
            }`}
          />
          {errors.password && <p className="text-red-600">{errors.password}</p>}
        </label>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-red-600 text-white p-2 text-sm uppercase rounded-md"
            onClick={() =>
              setEditData((prevData) => ({ ...prevData, isEditing: false }))
            }
          >
            Отмена
          </button>
          <button
            type="submit"
            className="bg-black text-white p-2 text-sm uppercase rounded-md"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};
