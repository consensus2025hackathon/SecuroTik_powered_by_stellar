const Arrow = ({ direction, onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType },
  } = rest;
  return (
    <svg
      className={`absolute outline-0 transition-all duration-500 z-[1000] border-0 opacity-100 cursor-pointer react-multiple-carousel__arrow--${direction}`}
      width="23"
      height="63"
      viewBox="0 0 23 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={{ rotate: direction === "right" ? "180deg" : "0deg" }}
    >
      <path
        d="M1.36602 33C0.830126 32.0718 0.830125 30.9282 1.36602 30L17.4019 2.22501C18.9366 -0.433092 23 0.655697 23 3.725L23 59.275C23 62.3443 18.9366 63.4331 17.4019 60.775L1.36602 33Z"
        fill="#0A85FF"
      />
    </svg>
  );
};

export default Arrow;
