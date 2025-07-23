import logo from '@client/assets/logo/chatLogo.webp';

function WellCome() {
  return (
    <div className="h-screen z-0">
      <div className="flex flex-col select-none items-center justify-center min-h-screen bg-[#f3f3f3]">
        <div className="w-[120px] h-auto pb-5">
          <img
            className="w-full h-full object-contain"
            alt="BroChat Logo"
            src={logo}
          />
        </div>
        <div>
          <p className=" text-center text-base ">
            Stay connected with BroChat anytime, anywhere <br />
            Send and receive messages seamlessly across all your devices
          </p>
        </div>
      </div>
    </div>
  );
}

export default WellCome;
