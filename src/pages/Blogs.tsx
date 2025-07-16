import type React from "react";
import { useState } from "react";
import useSWR from "swr";
import type { BlogTypes } from "../Types/indexTypes";
import { fetcher } from "../middlewares/Fetcher";
import { Axios } from "../middlewares/Axios";
import BlogModal from "../components/shared/BlogModal";
import BlogEditModal from "../components/shared/BlogEditModal";
import { PhotoCarousel } from "../components/ui/PhotoCarousel";

export const Blogs: React.FC = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogTypes | undefined>(
    undefined
  );

  const { data, error, isLoading, mutate } = useSWR<BlogTypes[]>(
    `/blog`,
    fetcher
  );

  const handleDeleteBlog = async (id: string) => {
    const isConfirmed = window.confirm("Вы уверены, что хотите удалить блог?");

    if (!isConfirmed) return;

    try {
      await Axios.delete(`/blog/${id}`);
      alert("Блог успешно удален!");
      mutate((prevState) => prevState?.filter((blog) => blog._id !== id));
    } catch (error) {
      alert("Произошла ошибка при удалении блога.");
    }
  };

  const handleEditBlog = (blog: BlogTypes) => {
    setSelectedBlog(blog);
    setIsEditModalActive(true);
  };

  const handleAddNewBlog = () => {
    setIsModalActive(true);
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
            className="bg-black text-white px-4 py-2 rounded-md"
            onClick={handleAddNewBlog}
          >
            Новый блог
          </button>
        </div>

        {data && data?.length <= 0 ? (
          <div className="h-[30vh] flex items-center justify-center">
            <h1>Нет блогов</h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.map((blog: BlogTypes) => (
              <div
                key={blog._id}
                className="rounded-lg overflow-hidden relative bg-gray-200 shadow-lg"
              >
                <PhotoCarousel photos={blog.photos} altText={blog.title} />

                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold truncate">
                    {blog.title}
                  </h2>
                  <h3>{blog.description}</h3>
                  <div className="flex justify-end gap-2">
                    <button
                      className="bg-black text-white px-2 rounded-md"
                      onClick={() => handleEditBlog(blog)}
                    >
                      Изменить
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 rounded-md"
                      onClick={() => handleDeleteBlog(blog._id)}
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
