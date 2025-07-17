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

  // Close dropdown when clicking outside
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
        {/* Avatar Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-8 w-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center text-sm font-medium"
        >
          {getInitials(user?.fullName)}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900">
                  {user?.fullName}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {user?.phoneNumber}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={handlePasswordChange}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Parolni o'zgartirish</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <LogOut className="mr-2 h-4 w-4" />
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
