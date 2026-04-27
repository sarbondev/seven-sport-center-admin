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

  const { data, isLoading, mutate } = useSWR<TrainerTypes[]>(
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
    } catch {
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

  return (
    <>
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#c4452d]">
              Jamoa
            </p>
            <h1 className="admin-display text-4xl leading-none">Трейнеры</h1>
          </div>
          <button
            className="admin-text-on-dark rounded-xl bg-[#101820] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition hover:bg-[#c4452d]"
            onClick={() => setIsModalActive(true)}
          >
            Новый трейнер
          </button>
        </div>

        {data && data?.length <= 0 ? (
          <div className="h-[30vh] flex items-center justify-center">
            <h1 className="text-xl text-[var(--admin-muted)]">
              Нет трейнеров
            </h1>
          </div>
        ) : (
          <div className="overflow-visible">
            <div className="overflow-hidden rounded-[1.25rem] border border-black/5 bg-white/75 shadow-lg backdrop-blur-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f4ede3] text-left">
                  <th className="p-3.5">Фото</th>
                  <th className="p-3.5">Имя</th>
                  <th className="p-3.5">Опыт</th>
                  <th className="p-3.5 text-right">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((trainer: TrainerTypes) => (
                  <tr key={trainer._id} className="border-t border-black/5 hover:bg-[#fcfaf7]">
                    <td className="p-3.5">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            typeof trainer.photo === "string"
                              ? trainer.photo
                              : "/placeholder.svg"
                          }
                          alt={trainer.fullName}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg?height=64&width=64";
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[var(--admin-ink)]">
                        {trainer.fullName}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[var(--admin-muted)]">
                        {trainer.experience} лет опыта
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="relative inline-block" ref={dropdownRef}>
                        <button
                          onClick={() => toggleDropdown(trainer._id)}
                          className="relative z-10 rounded-full p-2 transition-colors duration-200 hover:bg-black/5"
                          aria-label="Действия"
                        >
                          <MoreVertical
                            size={16}
                            className="text-[var(--admin-muted)]"
                          />
                        </button>

                        {activeDropdown === trainer._id && (
                          <div className="absolute right-0 z-50 mt-1 min-w-max w-48 rounded-2xl border border-black/5 bg-white p-1 shadow-lg">
                            <div className="py-1">
                              <button
                                onClick={() => handleEditTrainer(trainer._id)}
                                className="flex w-full items-center whitespace-nowrap rounded-xl px-4 py-2 text-sm text-[var(--admin-ink)] transition-colors duration-200 hover:bg-[#f6f1ea]"
                              >
                                <Edit size={14} className="mr-2" />
                                Изменить
                              </button>
                              <button
                                onClick={() => handleDeleteTrainer(trainer._id)}
                                className="flex w-full items-center whitespace-nowrap rounded-xl px-4 py-2 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50"
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
