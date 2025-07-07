import bg1 from "../assets/auth/login.webp";
import bg2 from "../assets/auth/bgImage.webp";
import { Card } from "../components/ui/card";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-screen w-screen  [background:linear-gradient(90deg,rgba(209,214,216,1)_0%,rgba(97,94,240,1)_100%)]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            className="w-[940px] h-full -left-30 absolute top-0 object-cover scale-110 opacity-10"
            alt="Background left"
            src={bg1}
          />
          <img
            className="w-[910px] h-full right-0 absolute top-0 object-cover opacity-10"
            alt="Background right"
            src={bg2}
          />
        </div>
        <div className="relative z-10 flex items-center justify-center h-screen">
          <Card className="relative w-7/12 h-[600px] shadow-[0px_4px_70px_#0000001a] p-0 rounded-[30px] overflow-hidden">
            {children}
            <div className="w-1/3 h-full bg-[#e2eef5] rounded-l-[30px] absolute right-0 overflow-hidden"></div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default AuthLayout;
