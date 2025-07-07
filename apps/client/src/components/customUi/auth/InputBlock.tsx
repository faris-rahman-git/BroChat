import { Input } from "../../ui/input";
import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";
import { useEffect, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Button } from "../../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@client/redux/store";
import { useResendotp } from "@client/hooks/auth/useResentOtp";
import { showLoader, hideLoader } from "@client/redux/features/LoaderSlice";
import { useAppDispatch } from "@client/hooks/commonHooks/useAppDispatch";
import { setError } from "@client/redux/features/errorSlice";

type InputBlockProps<T extends FieldValues> = {
  title: string;
  placeholder: string;
  type: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

const InputBlock = <T extends FieldValues>({
  title,
  placeholder,
  type,
  name,
  register,
  errors,
}: InputBlockProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);


  const userBasicData = useSelector((state: RootState) => state.auth.email);
  const dispatch = useAppDispatch();
  const { isPending, isSuccess, isError, mutate } = useResendotp();



  useEffect(() => {
    if (isPending) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setError("OTP Resent Successfully!"));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      dispatch(setError("OTP Resent Failed! Please Try Again"));
    }
  }, [isError]);

  const handleResentOtp = () => {
    if (userBasicData && !isDisabled) {
      mutate(userBasicData);
      setIsDisabled(true); // Disable the button
      setTimeLeft(60); // Start countdown from 60 seconds
    }
  };

  // Countdown 
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isDisabled && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsDisabled(false); // Re-enable button after timer ends
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isDisabled]);


  return (
    <div>
      <label htmlFor={name} className="font-normal text-[14px]">
        {title}
      </label>

      <div className="relative">
        <Input
          type={title === "Password" && showPassword ? "text" : type}
          className="rounded-[8px] font-medium text-[16px] placeholder:font-light placeholder:text-[13px] focus-visible:ring-[1px] focus-visible:border-[#615EF0]"
          placeholder={placeholder}
          {...register(name)}
        />

        {title === "OTP" && (
          <Button
            type="button"
            onClick={handleResentOtp}
            disabled={isDisabled}
            className={`absolute right-0 top-0 w-[115px] rounded-[0px_8px_8px_0px] font-semibold text-sm text-white hover:cursor-pointer
                ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#615ef0] hover:bg-[#4E43F0]'}`} >
            {isDisabled ? `Resend (${timeLeft}s)` : "Resend"}
          </Button>

        )}

        {title === "Password" && (
          <div className="absolute h-9 right-3 top-0 flex justify-center items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className=" hover:cursor-pointer text-[#465685] "
            >
              {showPassword ? <LuEye size={18} /> : <LuEyeOff size={18} />}
            </button>
          </div>
        )}

        <span className="text-[#FF0000] text-[12px] block capitalize">
          {String(errors[name]?.message ?? "\u00A0")}
        </span>
      </div>
    </div>
  );
};

export default InputBlock;
