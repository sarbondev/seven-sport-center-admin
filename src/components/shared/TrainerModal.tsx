import React, { useState } from "react";
import { Axios } from "../../middlewares/Axios";
import { Trash } from "lucide-react";

type ModalProps = {
  setIsModalActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TrainerModal({ setIsModalActive }: ModalProps) {
  const [formData, setFormData] = useState({
    photo: "",
    fullname: "",
    experience: "",
    achievements: [] as string[],
  });

  const [errors, setErrors] = useState({
    fullname: "",
    experience: "",
    photo: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        console.error("No file selected");
        return;
      }

      const formImageData = new FormData();
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        console.error("Selected file is not an image");
        return;
      }

      formImageData.append("file", file);
      setIsUploading(true);

      const { data } = await Axios.post("upload", formImageData);

      setFormData((prevCourse) => ({
        ...prevCourse,
        photo: data.filename,
      }));

      setIsUploading(false);
    } catch (err) {
      console.error("Error uploading file:", err);
      setIsUploading(false);
    }
  };

  const handleAchievementChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = e.target.value;
    setFormData((prevData) => ({ ...prevData, achievements: newAchievements }));
  };

  const addAchievementField = () => {
    setFormData((prevData) => ({
      ...prevData,
      achievements: [...prevData.achievements, ""],
    }));
  };

  const removeAchievementField = (index: number) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, achievements: newAchievements }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullname: "", experience: "", photo: "" };

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Полное имя обязательно";
      isValid = false;
    }

    if (!formData.experience.trim() || isNaN(Number(formData.experience))) {
      newErrors.experience = "Опыт должен быть числом и не может быть пустым";
      isValid = false;
    }

    if (!formData.photo) newErrors.photo = "Фото обязательно.";

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await Axios.post("trainers", formData);
      if (response.data) {
        alert("Трейнер успешно добавлен!");
        setIsModalActive(false);
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
          Добавить нового трейнера
        </h1>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>
            Введите полное имя трейнера<span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            name="fullname"
            className={`outline-none border p-2 rounded-md ${
              errors.fullname ? "border-red-600" : "border-black"
            }`}
            value={formData.fullname}
            onChange={handleInputChange}
          />
          {errors.fullname && (
            <p className="text-red-600 text-sm">{errors.fullname}</p>
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
        <div className="flex flex-col gap-2">
          <p>Достижения:</p>
          {formData.achievements.map((achievement, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                className="outline-none border p-2 rounded-md border-black flex-1"
                value={achievement}
                onChange={(e) => handleAchievementChange(e, index)}
              />
              <button
                type="button"
                onClick={() => removeAchievementField(index)}
                className="bg-red-600 text-white p-2 rounded-md text-sm"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAchievementField}
            className="bg-blue-600 text-white p-2 rounded-md"
          >
            Добавить достижение
          </button>
        </div>
        {/* =============== */}

        <div className="space-y-2">
          <label htmlFor="photo" className="block text-sm font-medium">
            Фотография
            <span className={`text-red-600`}>*</span>
          </label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="photo"
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formData.photo ? (
                <img
                  src={formData.photo}
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
                onClick={() => setFormData({ ...formData, photo: "" })}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Убрать
              </button>
            )}
          </div>
          {errors.photo && (
            <span className="text-red-500 text-sm">{errors.photo}</span>
          )}
        </div>

        {/* ============== */}
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
