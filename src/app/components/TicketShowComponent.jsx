const TicketShowComponent = ({ ticket }) => {
  const buyTicket = async () => {
    await ticket.buy(localStorage.getItem("private"));
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
        <p className="w-full wrap-anywhere">
          <span className="font-bold">Owner</span>: {ticket.owner}
        </p>
        <hr />
        <p className="w-full wrap-anywhere">
          <span className="font-bold">ID</span>: {ticket.id}
        </p>
        <hr />
        <p className="w-full wrap-anywhere">
          <span className="font-bold">picture source</span>: {ticket.pictureSrc}
        </p>
        <hr />
        <p className="w-full wrap-anywhere">
          <span className="font-bold">Date</span>:{" "}
          {new Date(ticket.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <hr />
      </div>
    </div>
  );
};

export default TicketShowComponent;
