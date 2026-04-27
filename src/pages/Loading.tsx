import React from "react";
import Clipboard from "react-spinners/ClipLoader";

export const Loading: React.FC = () => {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="rounded-[2rem] border border-black/5 bg-white/70 p-10 shadow-xl backdrop-blur-xl">
        <Clipboard color="#c4452d" />
      </div>
    </section>
  );
};
