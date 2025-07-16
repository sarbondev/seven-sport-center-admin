import type React from "react";
import { useState } from "react";
import { Axios } from "../../middlewares/Axios";

type ModalProps = {
  setIsModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: any;
};

export default function TrainerModal({ setIsModalActive, mutate }: ModalProps) {
  const [formData, setFormData] = useState({
    photo: null as File | null,
    fullName: "",
    experience: "",
    level: "",
    students: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        photo: "Файл должен быть изображением.",
      }));
      return;
    }

    setFormData((prevData) => ({ ...prevData, photo: file }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Полное имя обязательно";
      isValid = false;
    }

    if (!formData.level.trim()) {
      newErrors.level = "Уровень (пояс) обязателен";
      isValid = false;
    }

    if (!formData.students.trim() || isNaN(Number(formData.students))) {
      newErrors.experience = "Число студентов должен быть числом";
      isValid = false;
    }

    if (!formData.photo) {
      newErrors.photo = "Фото обязательно";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsUploading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("level", formData.level);
      formDataToSend.append("students", formData.students);
      if (formData.photo) formDataToSend.append("photo", formData.photo);

      await Axios.post("/trainer", formDataToSend);
      alert("Тренер успешно добавлен!");
      setIsModalActive(false);
      mutate();
    } catch (error: any) {
      alert(error.response?.data.message || "Произошла ошибка");
    } finally {
      setIsUploading(false);
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
          Добавить нового трейнера
        </h1>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>
            Введите полное имя трейнера<span className="text-red-600">*</span>
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
          {errors.fullName && (
            <p className="text-red-600 text-sm">{errors.fullName}</p>
          )}
        </label>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>
            Введите опыт трейнера (в годах)
            <span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            name="experience"
            className={`outline-none border p-2 rounded-md ${
              errors.experience ? "border-red-600" : "border-black"
            }`}
            value={formData.experience}
            onChange={handleInputChange}
          />
          {errors.experience && (
            <p className="text-red-600 text-sm">{errors.experience}</p>
          )}
        </label>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>
            Выберите уровень трейнера (пояс)
            <span className="text-red-600">*</span>
          </p>
          <select
            name="level"
            className={`outline-none border p-2 rounded-md ${
              errors.level ? "border-red-600" : "border-black"
            }`}
            value={formData.level}
            onChange={(e) => {
              setFormData((prevData) => ({
                ...prevData,
                level: e.target.value,
              }));
              setErrors((prevErrors) => ({ ...prevErrors, level: "" }));
            }}
          >
            <option value="">Выберите цвет пояса</option>
            <option value="Oq">Белый (Oq)</option>
            <option value="Sariq">Желтый (Sariq)</option>
            <option value="Apelsin">Оранжевый (Apelsin)</option>
            <option value="Yashil">Зеленый (Yashil)</option>
            <option value="Ko'k">Синий (Ko'k)</option>
            <option value="Jigarrang">Коричневый (Jigarrang)</option>
            <option value="Qora">Черный (Qora)</option>
          </select>
          {errors.level && (
            <p className="text-red-600 text-sm">{errors.level}</p>
          )}
        </label>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>
            количество студентов
            <span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            name="students"
            className={`outline-none border p-2 rounded-md ${
              errors.students ? "border-red-600" : "border-black"
            }`}
            value={formData.students}
            onChange={handleInputChange}
          />
          {errors.students && (
            <p className="text-red-600 text-sm">{errors.students}</p>
          )}
        </label>

        <div className="space-y-2">
          <label htmlFor="photo" className="block text-sm">
            Фотография
            <span className={`text-red-600`}>*</span>
          </label>
          <div className="space-y-4 relative flex justify-center items-center">
            <label
              htmlFor="photo"
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formData.photo ? (
                <img
                  src={
                    URL.createObjectURL(formData.photo) || "/placeholder.svg"
                  }
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-sm text-gray-400">
                  Загрузить фотографию
                </span>
              )}
              <input
                id="photo"
                type="file"
                name="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {formData.photo && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, photo: null })}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 absolute"
              >
                Убрать
              </button>
            )}
          </div>
          {errors.photo && (
            <p className="text-red-600 text-sm">{errors.photo}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setIsModalActive(false)}
            className="bg-red-600 text-white p-2 uppercase rounded-md text-sm"
          >
            Назад
          </button>
          <button
            type="submit"
            className="bg-black text-white p-2 uppercase rounded-md text-sm"
            disabled={isUploading}
          >
            Создать
          </button>
        </div>
      </form>
    </div>
  );
}
