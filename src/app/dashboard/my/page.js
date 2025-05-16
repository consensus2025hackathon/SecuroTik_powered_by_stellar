"use client";

import Arrow from "@/app/components/Arrow";
import Buy from "@/app/components/Buy";
import ShowTicketInfo from "@/app/components/ShowTicketInfo";
import TicketComponent from "@/app/components/Ticket";
import NavigationBar from "@/app/NavigationBar";
import { Ticket } from "@/ticketHelper";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const MyPage = () => {
  const [tickets, setTickets] = useState([]);
  const [showInfo, setShowInfo] = useState(null);
  const [currentlyStop, setcurrentlyStop] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setTickets(
        await Ticket.listTicketsByOwner(localStorage.getItem("public"))
      );
    };

    fetchTickets();
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 mb-[50px]"
      // onClick={() => Ticket.populateChain()}
    >
      <h1 className="text-4xl font-bold mb-6">SecuroTik</h1>
      <div className="w-full flex flex-col gap-[15px]">
        <h3 className="text-2xl font-bold">My Tickets</h3>
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          className=""
          containerClass="container"
          customLeftArrow={<Arrow direction={"left"} />}
          customRightArrow={<Arrow direction={"right"} />}
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            mobile: {
              breakpoint: {
                max: 700,
                min: 0,
              },
              items: 1,
              partialVisibilityGutter: 30,
            },
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={true}
          sliderClass=""
          slidesToSlide={1}
          swipeable
          afterChange={(previousSlide, { currentSlide }) => {
            if (currentlyStop) {
              currentlyStop.pause();
            }
            const songs = tickets.map((ticket) =>
              ticket.pictureSrc.replace("png", "mp3").replace("images", "songs")
            );

            const audio = new Audio(songs[currentSlide - 2]);
            audio.play();
            setcurrentlyStop(audio);
          }}
        >
          {tickets.map((ticket, index) => (
            <div key={index} className="flex justify-center">
              <TicketComponent
                onClick={() => {
                  setShowInfo(ticket);
                }}
                ticket={ticket}
              />
            </div>
          ))}
        </Carousel>
      </div>

      <NavigationBar />
      {showInfo !== null && <ShowTicketInfo ticket={showInfo} />}
    </div>
  );
};
export default MyPage;
