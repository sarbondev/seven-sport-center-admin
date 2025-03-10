import React from "react";
import Clipboard from "react-spinners/ClipLoader";

export const Loading: React.FC = () => {
  return (
    <section className="flex h-screen items-center justify-center">
      <Clipboard />
    </section>
  );
};
