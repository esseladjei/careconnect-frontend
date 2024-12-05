import Image from "next/image"
import Link from "next/link"
import { useState } from "react";
import { DropDownMenuProps } from "../../types/typesdefinitions";

const DropDown: React.FC<DropDownMenuProps> = ({ onLogout, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  // Function to close the dropdown
  const handleMouseLeave = () => {
    setIsOpen(true);
  };
  const handleLogout = () => {
    onLogout()
  }
  return (<>
    <div className="relative" >
      <div className="gap-2 inline-flex items-center overflow-hidden rounded-ful bg-white cursor-pointer"
        onMouseEnter={handleMouseEnter}
      >
        <Image className="object-cover w-9 h-9 rounded-full" src="/images/profile/user-4.jpg" alt="" aria-hidden="true"
          width={50}
          height={80}
        />
      </div>
      <div className={`absolute end-0 z-10 mt-2 w-56 
                      rounded-md border border-gray-100 bg-white
                      shadow-lg ${isOpen ? 'opacity-100 mt-2' : 'hidden z-[12] opacity-0 mt-0'}`} role="menu"
        onMouseLeave={handleMouseLeave}>
        <div className="flex flex-col items-start p-2">
          <Link
            href={`/profile/${user?.role}/${user?.id}`}
            className="flex gap-2 items-center w-full  rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            role="menuitem">
            <span className="ti-user text-xl"></span>
            <span>My Profile</span>
          </Link>

          <Link
            href={`/payment`}
            className="flex gap-2 items-center w-full  rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            role="menuitem">
            <span className="ti-wallet text-xl"></span>
            <span>My Payments</span>
          </Link>

          <Link
            href={`/appointment`}
            className="flex gap-2 items-center w-full rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            role="menuitem">
            <span className="ti-timer text-xl"></span>
            <span>My Appointments</span>
          </Link>

          <button
            className="flex gap-2 items-center mt-2 mb-2 w-full border border-gray-300 text-gray-600 rounded-lg px-4 py-2 text-sm  hover:bg-gray-200 hover:text-gray-700"
            role="menuitem"
            onClick={handleLogout}>
            <span className="ti-close text-xl"></span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </>)
}

export default DropDown