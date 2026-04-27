import { NavLink } from "react-router-dom";
import { Shield, Users, UserSquare2, Newspaper } from "lucide-react";
import { useState } from "react";
import UserDropdown from "./UserDropDown";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/indexStore";
import ChangePasswordDialog from "../shared/ChangePassword";

const links = [
  { to: "/", label: "Adminlar", icon: Shield },
  { to: "/trainers", label: "Murabbiylar", icon: UserSquare2 },
  { to: "/blogs", label: "Bloglar", icon: Newspaper },
];

function Header() {
  const { data } = useSelector((state: RootState) => state.user);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  return (
    <>
      <nav className="fixed left-0 top-0 z-40 w-full border-b border-black/5 bg-[#101820]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <div className="admin-text-on-dark flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Users className="h-5 w-5 text-[#d7ab52]" />
              </div>
              <div>
                <p className="admin-display text-[1.7rem] leading-none">Seven</p>
                <p className="admin-text-on-dark-muted text-[10px] uppercase tracking-[0.24em]">
                  Admin Panel
                </p>
              </div>
            </div>

            <ul className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 p-1.5 lg:flex">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition ${
                          isActive
                            ? "bg-white/12 admin-text-on-dark"
                            : "admin-text-on-dark-soft hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          <UserDropdown
            user={data}
            setShowPasswordDialog={setShowPasswordDialog}
          />
        </div>
      </nav>

      <ChangePasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </>
  );
}

export default Header;
