import React from "react";
import { Ticket, Home, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
const NavigationBar = () => {
  const { push } = useRouter();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
      <button
        className="flex flex-col items-center"
        onClick={() => push("/dashboard/my")}
      >
        <Ticket size={24} />
        <span className="text-xs mt-1">My tickets</span>
      </button>

      <button
        className="flex flex-col items-center text-blue-500"
        onClick={() => push("/dashboard/")}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Main market</span>
      </button>

      <button
        className="flex flex-col items-center"
        onClick={() => push("/dashboard/resell")}
      >
        <RefreshCcw size={24} />
        <span className="text-xs mt-1">Resale market</span>
      </button>
    </nav>
  );
};

export default NavigationBar;
