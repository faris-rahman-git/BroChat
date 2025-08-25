import { Input } from '../../ui/input';
import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from 'react-hook-form';
import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { Button } from '../../ui/button';
import { useResendotpForm } from '@client/hooks/auth/logic/useResendotpForm';

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
  const { handleResentOtp, isDisabled, timeLeft } = useResendotpForm();

  return (
    <div>
      <label htmlFor={name} className="font-normal text-[14px]">
        {title}
      </label>

      <div className="relative">
        <Input
          type={title === 'Password' && showPassword ? 'text' : type}
          className="rounded-[8px] font-medium text-[16px] placeholder:font-light placeholder:text-[13px] focus-visible:ring-[1px] focus-visible:border-[#615EF0]"
          placeholder={placeholder}
          {...register(name)}
        />

        {title === 'OTP' && (
          <Button
            type="button"
            onClick={handleResentOtp}
            disabled={isDisabled}
            className={`absolute right-0 top-0 w-[115px] rounded-[0px_8px_8px_0px] font-semibold text-sm text-white hover:cursor-pointer
                ${
                  isDisabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#615ef0] hover:bg-[#4E43F0]'
                }`}
          >
            {isDisabled ? `Resend (${timeLeft}s)` : 'Resend'}
          </Button>
        )}

        {title === 'Password' && (
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
          {String(errors[name]?.message ?? '\u00A0')}
        </span>
      </div>
    </div>
  );
};

export default InputBlock;
