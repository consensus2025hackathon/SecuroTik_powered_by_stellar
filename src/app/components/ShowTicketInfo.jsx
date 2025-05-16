import TicketShowComponent from "./TicketShowComponent";

const ShowTicketInfo = ({ ticket }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center p-4 backdrop-blur-sm bg-[rgba(100,100,100,0.5)] z-[2000]">
      <TicketShowComponent ticket={ticket} />
    </div>
  );
};

export default ShowTicketInfo;
