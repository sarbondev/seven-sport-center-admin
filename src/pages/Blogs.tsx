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

  const { data, error, isLoading, mutate } = useSWR<BlogTypes[]>(
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
    } catch (error) {
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
          <h1 className="text-2xl uppercase font-bold">Блоги</h1>
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
            onClick={handleAddNewBlog}
          >
            Новый блог
          </button>
        </div>

        {data && data?.length <= 0 ? (
          <div className="h-[30vh] flex items-center justify-center">
            <h1 className="text-xl text-gray-500">Нет блогов</h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.map((blog: BlogTypes) => (
              <div key={blog._id} className="bg-gray-200 shadow-lg">
                <PhotoCarousel photos={blog.photos} altText={blog.title} />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold truncate">
                      {blog.title}
                    </h2>
                    <div className="relative inline-block" ref={dropdownRef}>
                      <button
                        onClick={() => toggleDropdown(blog._id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative z-10"
                        aria-label="Действия"
                      >
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>

                      {activeDropdown === blog._id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-max">
                          <div className="py-1">
                            <button
                              onClick={() => handleEditBlog(blog)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
                            >
                              <Edit size={14} className="mr-2" />
                              Изменить
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 whitespace-nowrap"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Удалить
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-sm text-gray-600 line-clamp-2">
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
