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

  const { data, isLoading, mutate } = useSWR<UserTypes[]>(
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
    } catch {
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

  return (
    <>
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#c4452d]">
              Boshqaruv
            </p>
            <h1 className="admin-display text-4xl leading-none">
              Administratorlar
            </h1>
          </div>
          <button
            className="admin-text-on-dark rounded-xl bg-[#101820] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition hover:bg-[#c4452d]"
            onClick={() => setIsModalActive(true)}
          >
            Yangi admin
          </button>
        </div>

        <div className="overflow-hidden rounded-[1.25rem] border border-black/5 bg-white/75 shadow-lg backdrop-blur-xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f4ede3] text-left">
              <th className="p-3.5">Foydalanuvchi</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((admin: UserTypes) => (
              <tr key={admin._id} className="border-t border-black/5 hover:bg-[#fcfaf7]">
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <span> {admin.fullName}</span>
                    {currentUser._id === admin._id ? (
                      <span className="bg-green-500 rounded-full h-3 w-3 inline-block"></span>
                    ) : null}
                  </div>
                  <a
                    href={`tel: +998${admin.phoneNumber}`}
                    className="text-sm text-[var(--admin-muted)]"
                  >
                    {formatUzPhone(admin.phoneNumber)}
                  </a>
                </td>
                <td className="p-3.5 text-right">
                  <div className="relative inline-block" ref={dropdownRef}>
                    <button
                      onClick={() => toggleDropdown(admin._id)}
                      className="rounded-full p-2 transition-colors duration-200 hover:bg-black/5"
                      aria-label="Действия"
                    >
                      <MoreVertical
                        size={16}
                        className="text-[var(--admin-muted)]"
                      />
                    </button>

                    {activeDropdown === admin._id && (
                      <div className="absolute right-0 z-10 mt-1 w-48 rounded-2xl border border-black/5 bg-white p-1 shadow-lg">
                        <div className="py-1">
                          <button
                            onClick={() => handleEditAdmin(admin._id)}
                            className="flex w-full items-center rounded-xl px-4 py-2 text-sm text-[var(--admin-ink)] transition-colors duration-200 hover:bg-[#f6f1ea]"
                          >
                            <Edit size={14} className="mr-2" />
                            O'zgartirish
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className="flex w-full items-center rounded-xl px-4 py-2 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50"
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
        </div>
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
