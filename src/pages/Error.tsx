import React from "react";
import { Link } from "react-router-dom";

export const Error: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-5">
      <h1 className="font-bold text-8xl">404</h1>
      <p className="font-bold">что-то не так, пожалуйста, вернитесь назад</p>
      <Link
        to={"/"}
        className="bg-black py-2 px-5 font-bold text-white rounded-md"
      >
        Назад
      </Link>
    </div>
  );
};
