import { useState, useRef, useEffect } from "react";
import { Settings, LogOut } from "lucide-react";

interface UserDropdownProps {
  user: {
    fullName: string;
    phoneNumber: string;
  } | null;
  setShowPasswordDialog: (show: boolean) => void;
}

const UserDropdown = ({ user, setShowPasswordDialog }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePasswordChange = () => {
    setShowPasswordDialog(true);
    setIsOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("Вы реально хотите выйти?")) {
      localStorage.removeItem("ssctoken");
      window.location.href = "/";
    }
    setIsOpen(false);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="admin-text-on-dark flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-2 py-2 transition hover:bg-white/12"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d7ab52] text-sm font-bold text-[#101820]">
            {getInitials(user?.fullName)}
          </span>
          <span className="hidden text-left md:block">
            <span className="block text-sm font-semibold">{user?.fullName}</span>
            <span className="admin-text-on-dark-muted block text-xs">
              {user?.phoneNumber}
            </span>
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-black/5 bg-white p-2 shadow-2xl z-50">
            <div className="rounded-2xl bg-[#f4ede3] px-4 py-3">
              <p className="text-sm font-semibold text-[var(--admin-ink)]">
                {user?.fullName}
              </p>
              <p className="text-xs text-[var(--admin-muted)]">
                {user?.phoneNumber}
              </p>
            </div>

            <div className="mt-2">
              <button
                onClick={handlePasswordChange}
                className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm text-[var(--admin-ink)] transition hover:bg-[#f6f1ea]"
              >
                <Settings className="h-4 w-4" />
                <span>Parolni o&apos;zgartirish</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDropdown;
