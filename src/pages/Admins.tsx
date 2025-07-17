import type React from "react";
import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import type { UserTypes } from "../Types/indexTypes";
import { fetcher } from "../middlewares/Fetcher";
import { AdminModal } from "../components/shared/AdminModal";
import { AdminEditModal } from "../components/shared/AdminEditModal";
import { Axios } from "../middlewares/Axios";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../Store/indexStore";

export const Admins: React.FC = () => {
  const { data: currentUser } = useSelector((state: RootState) => state.user);
  const [isModalActive, setIsModalActive] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    isEditing: false,
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading, mutate } = useSWR<UserTypes[]>(
    `/admin`,
    fetcher
  );

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

  const handleDeleteAdmin = async (id: string) => {
    const isConfirmed = window.confirm(
      "Haqiqatan ham administratorni olib tashlamoqchimisiz?"
    );
    if (!isConfirmed) return;

    try {
      await Axios.delete(`admin/${id}`);
      alert("Administrator muvaffaqiyatli olib tashlandi!");
      mutate((prevState) => prevState?.filter((admin) => admin._id !== id));
      setActiveDropdown(null);
    } catch (error) {
      alert("Administratorni oʻchirishda xatolik yuz berdi.");
    }
  };

  const handleEditAdmin = (adminId: string) => {
    setEditData((prevData) => ({
      ...prevData,
      id: adminId,
      isEditing: true,
    }));
    setActiveDropdown(null);
  };

  const toggleDropdown = (adminId: string) => {
    setActiveDropdown(activeDropdown === adminId ? null : adminId);
  };

  function formatUzPhone(number: string) {
    return `+998 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(
      5,
      7
    )} ${number.slice(7, 9)}`;
  }

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
          <h1 className="text-2xl uppercase font-bold">Administratorlar</h1>
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
            onClick={() => setIsModalActive(true)}
          >
            Yangi admin
          </button>
        </div>

        <table className="w-full border-collapse border border-gray-200 shadow-md bg-white">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border border-gray-200">Foydalanuvchi</th>
              <th className="p-3 border border-gray-200 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((admin: UserTypes) => (
              <tr key={admin._id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <span> {admin.fullName}</span>
                    {currentUser._id === admin._id ? (
                      <span className="bg-green-500 rounded-full h-3 w-3 inline-block"></span>
                    ) : null}
                  </div>
                  <a
                    href={`tel: +998${admin.phoneNumber}`}
                    className="text-sm opacity-50"
                  >
                    {formatUzPhone(admin.phoneNumber)}
                  </a>
                </td>
                <td className="p-3 border border-gray-200 text-right">
                  <div className="relative inline-block" ref={dropdownRef}>
                    <button
                      onClick={() => toggleDropdown(admin._id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      aria-label="Действия"
                    >
                      <MoreVertical size={16} className="text-gray-600" />
                    </button>

                    {activeDropdown === admin._id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleEditAdmin(admin._id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Edit size={14} className="mr-2" />
                            O'zgartirish
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Olib tashlash
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
      </section>

      {isModalActive && (
        <AdminModal setIsModalActive={setIsModalActive} mutate={mutate} />
      )}

      {editData.isEditing && (
        <AdminEditModal editData={editData} setEditData={setEditData} />
      )}
    </>
  );
};
