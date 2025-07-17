import type React from "react";
import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import type { TrainerTypes } from "../Types/indexTypes";
import { fetcher } from "../middlewares/Fetcher";
import { Axios } from "../middlewares/Axios";
import TrainerEditModal from "../components/shared/TrainerEditModal";
import TrainerModal from "../components/shared/TrainerModal";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

export const Trainers: React.FC = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    isEditing: false,
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading, mutate } = useSWR<TrainerTypes[]>(
    `/trainer`,
    fetcher
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteTrainer = async (id: string) => {
    const isConfirmed = window.confirm(
      "Вы уверены, что хотите удалить трейнера?"
    );
    if (!isConfirmed) return;

    try {
      await Axios.delete(`/trainer/${id}`);
      alert("Трейнер успешно удален!");
      mutate((prevState) => prevState?.filter((trainer) => trainer._id !== id));
      setActiveDropdown(null);
    } catch (error) {
      alert("Произошла ошибка при удалении трейнера.");
    }
  };

  const handleEditTrainer = (trainerId: string) => {
    setEditData((prevData) => ({
      ...prevData,
      id: trainerId,
      isEditing: true,
    }));
    setActiveDropdown(null);
  };

  const toggleDropdown = (trainerId: string) => {
    setActiveDropdown(activeDropdown === trainerId ? null : trainerId);
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
    <>
      <section className="p-4">
        <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
          <h1 className="text-2xl uppercase font-bold">Трейнеры</h1>
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
            onClick={() => setIsModalActive(true)}
          >
            Новый трейнер
          </button>
        </div>

        {data && data?.length <= 0 ? (
          <div className="h-[30vh] flex items-center justify-center">
            <h1 className="text-xl text-gray-500">Нет трейнеров</h1>
          </div>
        ) : (
          <div className="overflow-visible">
            <table className="w-full border-collapse border border-gray-200 shadow-md bg-white">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border border-gray-200">Фото</th>
                  <th className="p-3 border border-gray-200">Имя</th>
                  <th className="p-3 border border-gray-200">Опыт</th>
                  <th className="p-3 border border-gray-200 text-right">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((trainer: TrainerTypes) => (
                  <tr key={trainer._id} className="hover:bg-gray-50">
                    <td className="p-3 border border-gray-200">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        <img
                          className="w-full h-full object-cover"
                          src={trainer.photo || "/placeholder.svg"}
                          alt={trainer.fullName}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg?height=64&width=64";
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200">
                      <div className="font-semibold text-gray-900">
                        {trainer.fullName}
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200">
                      <span className="text-gray-600">
                        {trainer.experience} лет опыта
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200 text-right">
                      <div className="relative inline-block" ref={dropdownRef}>
                        <button
                          onClick={() => toggleDropdown(trainer._id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative z-10"
                          aria-label="Действия"
                        >
                          <MoreVertical size={16} className="text-gray-600" />
                        </button>

                        {activeDropdown === trainer._id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-max">
                            <div className="py-1">
                              <button
                                onClick={() => handleEditTrainer(trainer._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
                              >
                                <Edit size={14} className="mr-2" />
                                Изменить
                              </button>
                              <button
                                onClick={() => handleDeleteTrainer(trainer._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 whitespace-nowrap"
                              >
                                <Trash2 size={14} className="mr-2" />
                                Удалить
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isModalActive && (
        <TrainerModal setIsModalActive={setIsModalActive} mutate={mutate} />
      )}

      {editData.isEditing && (
        <TrainerEditModal editData={editData} setEditData={setEditData} />
      )}
    </>
  );
};
