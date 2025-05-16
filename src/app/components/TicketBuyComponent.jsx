const TicketBuyComponent = ({ ticket }) => {
  const buyTicket = async () => {
    await ticket.buy(localStorage.getItem("private"));
    alert("Ticket bought!");
    window.location.href = "/dashboard/my";
  };
  return (
    <div className="flex flex-col bg-white rounded-2xl drop-shadow-xl p-3 gap-[10px] w-[300px] max-w-md mb-8">
      <div className="w-full h-60 overflow-hidden rounded-2xl relative">
        <img
          src={ticket.pictureSrc}
          className="w-full h-full object-cover z-0"
        />
        <span className="text-black font-bold absolute bottom-0 right-0 p-2 bg-[rgba(255,255,255,0.8)] z-10 rounded-lg">
          {ticket.price} XLM
        </span>
      </div>
      <div>
        <h3 className="text-lg font-normal">
          <span className="font-extrabold text-2xl">{ticket.location}</span> ・{" "}
          {ticket.venueName}
        </h3>
        <p className=" text-gray-600 mb-4">
          {ticket.artistName} – {ticket.name}
        </p>
        <div className="flex w-full justify-between items-center ">
          <p className="font-extrabold text-xl">{ticket.price} XLM</p>
          <button
            className="bg-[#FCA311] focus:bg-blue-600  transition-all duration-500 grow text-white px-2 cursor-pointer py-1 rounded-full ml-2"
            onClick={buyTicket}
          >
            Confirm purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketBuyComponent;
