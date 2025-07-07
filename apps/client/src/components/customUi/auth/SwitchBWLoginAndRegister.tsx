import { useAppDispatch } from "@client/hooks/commonHooks/useAppDispatch";
import { clearError } from "@client/redux/features/errorSlice";
import { useNavigate } from "react-router-dom";

function SwitchBWLoginAndRegister({
  content,
  type,
}: {
  content: string;
  type: string;
}) {

  const navigate = useNavigate()
  const dispatch = useAppDispatch();

  const handleButton = () => {
    dispatch(clearError())
    navigate(`/${type}`)
  }

  return (
    <div className="w-full  flex justify-center items-start">
      <p className="font-normal text-[14px] text-[#BCBEC0]">
        {content} ?{" "}
        {/* <Link to={"/" + type} className="text-[#465685] font-semibold hover:underline" >
          {type == "login" ? "Login" : "Register"}
        </Link> */}
        <button className="text-[#465685] font-semibold hover:underline hover:cursor-pointer" onClick={handleButton} type="button">
          {type == "login" ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}

export default SwitchBWLoginAndRegister;
