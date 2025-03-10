import { NavLink } from "react-router-dom";

function Header() {
  return (
    <nav className="px-4 h-[50px] bg-black sticky left-0 top-0 w-full flex justify-between items-center">
      <ul className="h-full flex items-center gap-4 text-white">
        <li>
          <NavLink to={"/"}>Админы</NavLink>
        </li>
        <li>
          <NavLink to={"/trainers"}>Трейнеры</NavLink>
        </li>
      </ul>
      <button
        onClick={() => {
          if (window.confirm("Вы реально хотите выйти?")) {
            localStorage.removeItem("token");
            window.location.href = "/";
          }
        }}
        className="bg-white px-2 rounded-md"
      >
        Выйти
      </button>
    </nav>
  );
}

export default Header;
