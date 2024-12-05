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
    setIsOpen(false);
  };
  const handleLogout = () => {
    onLogout()
  }
  return (<>
    <div className="relative" >
      <div className="inline-flex items-center overflow-hidden rounded-ful bg-white cursor-pointer"
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
        <div className="p-2">
          <Link
            href={`/profile/${user?.role}/${user?.id}`}
            className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            role="menuitem">
            My Profile
          </Link>

          <Link
            href={`/payment`}
            className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            role="menuitem">
            My Payments
          </Link>

          <Link
            href={`/appointment`}
            className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            role="menuitem">
            My Appointments
          </Link>

          <button
            className="block mt-2 mb-2 w-full border border-gray-300 text-gray-600 rounded-lg px-4 py-2 text-sm  hover:bg-gray-100 hover:text-gray-700"
            role="menuitem"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  </>)
}

export default DropDown