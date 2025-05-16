import TicketBuyComponent from "./TicketBuyComponent";

const Buy = ({ ticket }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center p-4 backdrop-blur-sm bg-[rgba(100,100,100,0.5)] z-[2000]">
      <TicketBuyComponent ticket={ticket} />
    </div>
  );
};

export default Buy;
