import loginImg from '../../../assets/auth/login.webp';
import FixedLogo from '../../customUi/auth/FixedLogo';
import AuthHeading from '../../customUi/auth/AuthHeading';
import { loginFormFields } from '../../../constants/authConstant/authConstants';
import InputBlock from '../../customUi/auth/InputBlock';
import AuthNextButton from '../../customUi/auth/AuthNextButton';
import SocialLogin from '../../customUi/auth/SocialLogin';
import SwitchBWLoginAndRegister from '../../customUi/auth/SwitchBWLoginAndRegister';
import MainSideImage from '../../customUi/auth/MainSideImage';
import { type LoginSchemaType } from '@bro/shared';
import Errorspan from '@client/components/customUi/auth/Errorspan';
import { useLoginHook } from '@client/hooks/PageHooks/auth/useLoginHook';

function Login() {
  const {
    onSubmit,
    handleForgotPassword,
    register,
    handleSubmit,
    errors,
    errorMessage,
  } = useLoginHook();

  return (
    <div className="h-full w-full z-20 flex ">
      {/* right side content */}
      <div className="w-[40%] py-5 ps-20 pe-5 flex flex-col h-full">
        {/* logo */}
        <FixedLogo />

        {/* form content */}
        <div className="flex-1 flex items-center">
          <div className="w-full">
            <AuthHeading headData="Login" />
            <Errorspan message={errorMessage} />
            <div className="w-full">
              {loginFormFields.map((item, index) => (
                <InputBlock<LoginSchemaType>
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
            {/* Forgot password link */}
            <div className="pb-2">
              <button
                className="font-normal text-[12px] text-[#465685] hover:underline"
                type="button"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>
            <AuthNextButton content="Login" onClick={handleSubmit(onSubmit)} />
            <SocialLogin />
            <SwitchBWLoginAndRegister
              content="Don’t have an account yet"
              type="Register"
            />
          </div>
        </div>
      </div>

      {/* left side image */}
      <MainSideImage imageURL={loginImg} />
    </div>
  );
}

export default Login;
