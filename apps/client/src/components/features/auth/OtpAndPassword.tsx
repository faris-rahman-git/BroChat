import otpImg from '../../../assets/auth/otp.webp';
import FixedLogo from '../../customUi/auth/FixedLogo';
import AuthHeading from '../../customUi/auth/AuthHeading';
import { otpAndPasswordFormFields } from '../../../constants/authConstant/authConstants';
import InputBlock from '../../customUi/auth/InputBlock';
import AuthNextButton from '../../customUi/auth/AuthNextButton';
import MainSideImage from '../../customUi/auth/MainSideImage';
import { type OtpAndPasswordSchemaType } from '@bro/shared';
import Errorspan from '@client/components/customUi/auth/Errorspan';
import { useOtpAndPasswordHook } from '@client/hooks/PageHooks/auth/useOtpAndPasswordHook';

function OtpAndPassword() {
  const { onSubmit, register, handleSubmit, errors, errorMessage } =
    useOtpAndPasswordHook();

  return (
    <div className="h-full w-full z-20 flex ">
      {/* right side content */}
      <div className="w-[40%] py-5 ps-20 pe-5 flex flex-col h-full">
        {/* logo */}
        <FixedLogo />

        {/* form content */}
        <div className="flex-1 flex items-center">
          <div className="w-full">
            <AuthHeading headData="OTP & Passwod" />
            <Errorspan message={errorMessage} />
            <div className="w-full pb-2">
              {otpAndPasswordFormFields.map((item, index) => (
                <InputBlock<OtpAndPasswordSchemaType>
                  key={index}
                  title={item.title}
                  placeholder={item.placeholder}
                  type={item.type}
                  name={item.name}
                  register={register}
                  errors={errors}
                />
              ))}
            </div>
            <AuthNextButton
              content="Verify & Continue"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </div>

      {/* left side image */}
      <MainSideImage imageURL={otpImg} />
    </div>
  );
}

export default OtpAndPassword;
