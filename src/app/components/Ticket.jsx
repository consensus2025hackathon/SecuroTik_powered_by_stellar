import { useState } from "react";
import ShowTicketInfo from "./ShowTicketInfo";

const TicketComponent = ({
  onClick,
  ticket,
  buyable = false,
  resell = false,
}) => {
  return (
    <>
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
            <span className="font-extrabold text-2xl">{ticket.location}</span>{" "}
            ・ {ticket.venueName}
          </h3>
          <p className=" text-gray-600 mb-4">
            {ticket.artistName} – {ticket.name}
          </p>
          {resell == true && (
            <p className="text-[#FCA311] font-bold wrap-anywhere">
              Reseller: {ticket.owner}
            </p>
          )}
          {buyable == true ? (
            <>
              <button
                onClick={onClick}
                className="bg-blue-500 focus:bg-blue-800 w-full text-white px-4 py-2 cursor-pointer rounded-full"
              >
                Buy ticket
              </button>
              <button className="w-full text-black px-4 py-2">
                Want cheaper tickets?{" "}
                <span className="text-[#FCA311] text font-bold cursor-pointer">
                  Check the resale market!
                </span>
              </button>
            </>
          ) : (
            <button
              className="bg-[#FCA311] w-full text-white px-4 py-2 cursor-pointer rounded-full"
              onClick={onClick}
            >
              View ticket
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default TicketComponent;
