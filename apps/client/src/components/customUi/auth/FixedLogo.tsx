import logo from "../../../assets/auth/chatLogo.webp";

function FixedLogo() {
  return (
    <div className="w-full relative h-12">
      <img
        className="w-auto h-full left-4 absolute scale-220"
        alt="Background left"
        src={logo}
      />
    </div>
  );
}

export default FixedLogo;
