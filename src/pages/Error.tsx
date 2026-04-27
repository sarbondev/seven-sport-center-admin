import React from "react";
import { Link } from "react-router-dom";

export const Error: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
      <span className="rounded-full bg-[#c4452d]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-[#c4452d]">
        404
      </span>
      <h1 className="admin-display text-7xl leading-none">Sahifa topilmadi</h1>
      <p className="max-w-md text-[var(--admin-muted)]">
        Nimadir noto‘g‘ri ketdi. Boshqaruv panelining asosiy sahifasiga qayting.
      </p>
      <Link
        to={"/"}
        className="admin-text-on-dark rounded-2xl bg-[#101820] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] transition hover:bg-[#c4452d]"
      >
        Назад
      </Link>
    </div>
  );
};
