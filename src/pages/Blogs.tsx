import type React from "react";
import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import type { BlogTypes } from "../Types/indexTypes";
import { fetcher } from "../middlewares/Fetcher";
import { Axios } from "../middlewares/Axios";
import BlogModal from "../components/shared/BlogModal";
import BlogEditModal from "../components/shared/BlogEditModal";
import { PhotoCarousel } from "../components/ui/PhotoCarousel";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

export const Blogs: React.FC = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogTypes | undefined>(
    undefined
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, mutate } = useSWR<BlogTypes[]>(
    `/blog`,
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

  const handleDeleteBlog = async (id: string) => {
    const isConfirmed = window.confirm("Вы уверены, что хотите удалить блог?");
    if (!isConfirmed) return;

    try {
      await Axios.delete(`/blog/${id}`);
      alert("Блог успешно удален!");
      mutate((prevState) => prevState?.filter((blog) => blog._id !== id));
      setActiveDropdown(null);
    } catch {
      alert("Произошла ошибка при удалении блога.");
    }
  };

  const handleEditBlog = (blog: BlogTypes) => {
    setSelectedBlog(blog);
    setIsEditModalActive(true);
    setActiveDropdown(null);
  };

  const handleAddNewBlog = () => {
    setIsModalActive(true);
  };

  const toggleDropdown = (blogId: string) => {
    setActiveDropdown(activeDropdown === blogId ? null : blogId);
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
              Kontent
            </p>
            <h1 className="admin-display text-4xl leading-none">Блоги</h1>
          </div>
          <button
            className="admin-text-on-dark rounded-xl bg-[#101820] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition hover:bg-[#c4452d]"
            onClick={handleAddNewBlog}
          >
            Новый блог
          </button>
        </div>

        {data && data?.length <= 0 ? (
          <div className="h-[30vh] flex items-center justify-center">
            <h1 className="text-xl text-[var(--admin-muted)]">Нет блогов</h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.map((blog: BlogTypes) => (
              <div
                key={blog._id}
                className="overflow-hidden rounded-[1.25rem] border border-black/5 bg-white/75 shadow-lg backdrop-blur-xl"
              >
                <PhotoCarousel photos={blog.photos} altText={blog.title} />
                <div className="space-y-2 p-3.5">
                  <div className="flex justify-between items-center">
                    <h2 className="truncate text-base font-semibold">
                      {blog.title}
                    </h2>
                    <div className="relative inline-block" ref={dropdownRef}>
                      <button
                        onClick={() => toggleDropdown(blog._id)}
                        className="relative z-10 rounded-full p-2 transition-colors duration-200 hover:bg-black/5"
                        aria-label="Действия"
                      >
                        <MoreVertical
                          size={16}
                          className="text-[var(--admin-muted)]"
                        />
                      </button>

                      {activeDropdown === blog._id && (
                        <div className="absolute right-0 z-50 mt-1 min-w-max w-48 rounded-2xl border border-black/5 bg-white p-1 shadow-lg">
                          <div className="py-1">
                            <button
                              onClick={() => handleEditBlog(blog)}
                              className="flex w-full items-center whitespace-nowrap rounded-xl px-4 py-2 text-sm text-[var(--admin-ink)] transition-colors duration-200 hover:bg-[#f6f1ea]"
                            >
                              <Edit size={14} className="mr-2" />
                              Изменить
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog._id)}
                              className="flex w-full items-center whitespace-nowrap rounded-xl px-4 py-2 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Удалить
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="line-clamp-2 text-sm leading-6 text-[var(--admin-muted)]">
                    {blog.description}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {isModalActive && (
        <BlogModal setIsModalActive={setIsModalActive} mutate={mutate} />
      )}

      {isEditModalActive && selectedBlog && (
        <BlogEditModal
          setIsModalActive={setIsEditModalActive}
          mutate={mutate}
          blogData={selectedBlog}
        />
      )}
    </>
  );
};
