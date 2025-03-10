import React, { useState } from "react";
import useSWR from "swr";
import { TrainerTypes } from "../Types/indexTypes";
import { fetcher } from "../middlewares/Fetcher";
import { Axios } from "../middlewares/Axios";
import TrainerEditModal from "../components/shared/TrainerEditModal";
import TrainerModal from "../components/shared/TrainerModal";

export const Trainers: React.FC = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    isEditing: false,
  });

  const { data, error, isLoading, mutate } = useSWR<TrainerTypes[]>(
    `/trainer`,
    fetcher
  );

  const handleDeleteTrainer = async (id: string) => {
    const isConfirmed = window.confirm(
      "Вы уверены, что хотите удалить трейнера?"
    );

    if (!isConfirmed) return;

    try {
      await Axios.delete(`/trainer/${id}`);
      alert("Трейнер успешно удален!");
      mutate((prevState) => prevState?.filter((trainer) => trainer._id !== id));
    } catch (error) {
      alert("Произошла ошибка при удалении трейнера.");
    }
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
            className="bg-black text-white px-4 py-2 rounded-md"
            onClick={() => setIsModalActive(true)}
          >
            Новый трейнер
          </button>
        </div>

        {data && data?.length <= 0 ? (
          <div className="h-[30vh] flex items-center justify-center">
            <h1>Нет трейнеров</h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.map((teamate: TrainerTypes) => (
              <div
                key={teamate._id}
                className="rounded-lg overflow-hidden relative bg-gray-200 shadow-lg"
              >
                <img
                  className="h-[300px] object-cover w-full"
                  src={teamate.photo}
                  alt={teamate.fullName}
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold truncate">
                    {teamate.fullName}
                  </h2>
                  <h3>{teamate.experience} лет опыта</h3>
                  <div className="flex justify-end">
                    <button
                      className="bg-red-600 text-white px-2 rounded-md"
                      onClick={() => handleDeleteTrainer(teamate._id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {isModalActive && <TrainerModal setIsModalActive={setIsModalActive} mutate={mutate}/>}
      {editData.isEditing && (
        <TrainerEditModal editData={editData} setEditData={setEditData} />
      )}
    </>
  );
};
