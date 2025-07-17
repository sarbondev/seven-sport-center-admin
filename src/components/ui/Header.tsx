import { NavLink } from "react-router-dom";
import { useState } from "react";
import UserDropdown from "./UserDropDown";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/indexStore";
import ChangePasswordDialog from "../shared/ChangePassword";

function Header() {
  const { data } = useSelector((state: RootState) => state.user);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  return (
    <nav className="px-4 h-[50px] bg-black sticky left-0 top-0 w-full flex justify-between items-center">
      <ul className="h-full flex items-center gap-4 text-white">
        <li>
          <NavLink to={"/"}>Админы</NavLink>
        </li>
        <li>
          <NavLink to={"/trainers"}>Трейнеры</NavLink>
        </li>
        <li>
          <NavLink to={"/blogs"}>Блоги</NavLink>
        </li>
      </ul>
      <UserDropdown user={data} setShowPasswordDialog={setShowPasswordDialog} />
      <ChangePasswordDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}/>
    </nav>
  );
}

export default Header;
