export const MobileDeny = () => {
  return (
    <div className="sticky left-0 right-0 h-screen flex flex-col justify-center max-w-xs mx-auto">
      <img
        src="/assets/images/empty-icon.png"
        className="w-[175px] h-[175px] mx-auto"
      />
      <p className="text-center text-white">
        Oops, Hamsterpocket is not available on mobile (yet!). Please switch to
        our desktop version.
      </p>
    </div>
  );
};
