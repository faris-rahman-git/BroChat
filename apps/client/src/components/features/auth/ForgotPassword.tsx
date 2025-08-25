import forgotImg from '../../../assets/auth/forgotPassword.webp';
import FixedLogo from '../../customUi/auth/FixedLogo';
import AuthHeading from '../../customUi/auth/AuthHeading';
import { forgotPasswordFormFields } from '../../../constants/authConstant/authConstants';
import InputBlock from '../../customUi/auth/InputBlock';
import AuthNextButton from '../../customUi/auth/AuthNextButton';
import SocialLogin from '../../customUi/auth/SocialLogin';
import SwitchBWLoginAndRegister from '../../customUi/auth/SwitchBWLoginAndRegister';
import MainSideImage from '../../customUi/auth/MainSideImage';
import { ForgotPasswordSchemaType } from '@bro/shared';
import Errorspan from '@client/components/customUi/auth/Errorspan';
import { useForgotPasswordHook } from '@client/hooks/PageHooks/auth/useForgotPasswordHook';

function ForgotPassword() {
  const { onSubmit, register, handleSubmit, errors, errorMessage } =
    useForgotPasswordHook();

  return (
    <div className="h-full w-full z-20 flex ">
      {/* right side content */}
      <div className="w-[40%] py-5 ps-20 pe-5 flex flex-col h-full">
        {/* logo */}
        <FixedLogo />

        {/* form content */}
        <div className="flex-1 flex items-center">
          <div className="w-full">
            <AuthHeading headData="Forgot Password?" />
            <Errorspan message={errorMessage} />
            <div className="w-full pb-2">
              {forgotPasswordFormFields.map((item, index) => (
                <InputBlock<ForgotPasswordSchemaType>
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
              content="Send OTP"
              onClick={handleSubmit(onSubmit)}
            />
            <SocialLogin />
            <SwitchBWLoginAndRegister
              content="Remember Your Password"
              type="login"
            />
          </div>
        </div>
      </div>

      {/* left side image */}
      <MainSideImage imageURL={forgotImg} />
    </div>
  );
}

export default ForgotPassword;
