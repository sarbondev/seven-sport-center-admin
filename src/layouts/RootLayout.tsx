import { Outlet } from "react-router-dom";
import Header from "../components/ui/Header";

function RootLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-28 md:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
