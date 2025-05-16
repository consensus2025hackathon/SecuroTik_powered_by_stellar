import React from "react";
import { Ticket, Home, RefreshCcw } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const NavigationBar = () => {
  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
      <button
        className={`flex flex-col items-center ${
          pathname === "/dashboard/my" ? "text-blue-500" : ""
        }`}
        onClick={() => push("/dashboard/my")}
      >
        <Ticket size={24} />
        <span className="text-xs mt-1">My tickets</span>
      </button>

      <button
        className={`flex flex-col items-center ${
          pathname === "/dashboard" ? "text-blue-500" : ""
        }`}
        onClick={() => push("/dashboard/")}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Main market</span>
      </button>

      <button
        className={`flex flex-col items-center ${
          pathname === "/dashboard/resell" ? "text-blue-500" : ""
        }`}
        onClick={() => push("/dashboard/resell")}
      >
        <RefreshCcw size={24} />
        <span className="text-xs mt-1">Resale market</span>
      </button>
    </nav>
  );
};

export default NavigationBar;
