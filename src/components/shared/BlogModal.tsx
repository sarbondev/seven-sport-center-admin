import React, { useState } from "react";
import { Axios } from "../../middlewares/Axios";
import { X } from "lucide-react";

type ModalProps = {
  setIsModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: any;
};

export default function BlogModal({ setIsModalActive, mutate }: ModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photos: [] as File[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);

    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));

    setFormData((prevData) => ({
      ...prevData,
      photos: [...prevData.photos, ...filesArray],
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      photos: prevData.photos.filter((_, i) => i !== index),
    }));

    setPreviews((prev) => prev.filter((_, i) => i !== index));

    setErrors((prev) => ({ ...prev, photos: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Название блога обязательно";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описание обязательно";
      isValid = false;
    }

    if (formData.photos.length === 0) {
      newErrors.photos = "Добавьте хотя бы одну фотографию";
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
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);

      formData.photos.forEach((photo) => {
        formDataToSend.append(`photos`, photo);
      });

      await Axios.post("/blog", formDataToSend);
      alert("Блог успешно добавлен!");
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

  React.useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div
      className="w-full h-screen fixed left-0 top-0 bg-black bg-opacity-75 backdrop-blur-md flex justify-end modal-overlay z-50"
      onClick={handleOutsideClick}
    >
      <form
        onSubmit={handleSubmit}
        className="h-full w-full md:max-w-lg flex flex-col gap-6 p-6 bg-white overflow-y-auto"
      >
        <h1 className="text-center text-xl font-bold">Добавить новый блог</h1>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>
            Введите название блога<span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            name="title"
            className={`outline-none border p-2 rounded-md ${
              errors.title ? "border-red-600" : "border-black"
            }`}
            value={formData.title}
            onChange={handleInputChange}
          />
          {errors.title && (
            <p className="text-red-600 text-sm">{errors.title}</p>
          )}
        </label>
        <label className="flex flex-col gap-2 text-[14px]">
          <p>
            Введите описание
            <span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            name="description"
            className={`outline-none border p-2 rounded-md ${
              errors.description ? "border-red-600" : "border-black"
            }`}
            value={formData.description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description}</p>
          )}
        </label>
        <div className="space-y-2">
          <label htmlFor="photo" className="block text-sm">
            Фотографии
            <span className="text-red-600">*</span>
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove photo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 relative flex justify-center items-center">
            <label
              htmlFor="photo"
              className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.photos ? "border-red-600" : "border-gray-600"
              }`}
            >
              <span className="text-sm text-gray-400">
                Загрузить фотографию
              </span>
              <input
                id="photo"
                type="file"
                name="photos"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          {errors.photos && (
            <p className="text-red-600 text-sm">{errors.photos}</p>
          )}
          {formData.photos.length > 0 && (
            <p className="text-sm text-gray-500">
              Выбрано файлов: {formData.photos.length}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-auto">
          <button
            type="button"
            onClick={() => setIsModalActive(false)}
            className="bg-red-600 text-white p-2 uppercase rounded-md text-sm"
          >
            Назад
          </button>
          <button
            type="submit"
            className="bg-black text-white p-2 uppercase rounded-md text-sm disabled:bg-gray-400"
            disabled={isUploading}
          >
            {isUploading ? "Загрузка..." : "Создать"}
          </button>
        </div>
      </form>
    </div>
  );
}
