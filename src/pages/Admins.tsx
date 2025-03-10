import React, { useState } from "react";
import useSWR from "swr";
import { UserTypes } from "../Types/indexTypes";
import { fetcher } from "../middlewares/Fetcher";
import { AdminModal } from "../components/shared/AdminModal";
import { AdminEditModal } from "../components/shared/AdminEditModal";
import { Axios } from "../middlewares/Axios";

export const Admins: React.FC = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    isEditing: false,
  });

  const { data, error, isLoading, mutate } = useSWR<UserTypes[]>(
    `/users`,
    fetcher
  );

  const handleDeleteAdmin = async (id: string) => {
    const isConfirmed = window.confirm(
      "Вы уверены, что хотите удалить администратора?"
    );

    if (!isConfirmed) return;

    try {
      await Axios.delete(`users/${id}`);
      alert("Администратор успешно удален!");
      mutate((prevState) => prevState?.filter((admin) => admin._id !== id));
    } catch (error) {
      alert("Произошла ошибка при удалении администратора.");
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
          <h1 className="text-2xl uppercase font-bold">Админы</h1>
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
            onClick={() => setIsModalActive(true)}
          >
            Новый админ
          </button>
        </div>
        <table className="w-full border-collapse border border-gray-200 shadow-md bg-white">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border border-gray-200">Имя</th>
              <th className="p-3 border border-gray-200">Номер телефона</th>
              <th className="p-3 border border-gray-200 text-right">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((admin: UserTypes) => (
              <tr key={admin._id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200">{admin.name}</td>
                <td className="p-3 border border-gray-200">
                  {admin.phoneNumber}
                </td>
                <td className="p-3 border border-gray-200 text-right">
                  <button
                    className="bg-black text-white px-2 rounded-md mr-2"
                    onClick={() =>
                      setEditData((prevData) => ({
                        ...prevData,
                        id: admin._id,
                        isEditing: true,
                      }))
                    }
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => handleDeleteAdmin(admin._id)}
                    className="bg-red-600 text-white px-2 rounded-md"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isModalActive && <AdminModal setIsModalActive={setIsModalActive} />}
      {editData.isEditing && (
        <AdminEditModal editData={editData} setEditData={setEditData} />
      )}
    </>
  );
};
