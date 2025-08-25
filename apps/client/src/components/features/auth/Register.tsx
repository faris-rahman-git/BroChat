import regImg from '../../../assets/auth/register.webp';
import FixedLogo from '../../customUi/auth/FixedLogo';
import AuthHeading from '../../customUi/auth/AuthHeading';
import { registerFormFields } from '../../../constants/authConstant/authConstants';
import InputBlock from '../../customUi/auth/InputBlock';
import AuthNextButton from '../../customUi/auth/AuthNextButton';
import SocialLogin from '../../customUi/auth/SocialLogin';
import SwitchBWLoginAndRegister from '../../customUi/auth/SwitchBWLoginAndRegister';
import MainSideImage from '../../customUi/auth/MainSideImage';
import { type RegisterSchemaType } from '@bro/shared';
import Errorspan from '@client/components/customUi/auth/Errorspan';
import { useRegisterHook } from '@client/hooks/PageHooks/auth/useRegisterHook';

function Register() {
  const { onSubmit, register, handleSubmit, errors, errorMessage } =
    useRegisterHook();

  return (
    <div className="h-full w-full z-20 flex">
      <div className="w-[40%] py-5 ps-20 pe-5 flex flex-col h-full">
        <FixedLogo />

        <div className="flex-1 flex items-center">
          <div className="w-full">
            <AuthHeading headData="Register" />
            <Errorspan message={errorMessage} />
            <div className="w-full pb-2">
              {registerFormFields.map((item, index) => (
                <InputBlock<RegisterSchemaType>
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
              content="Already have an account"
              type="login"
            />
          </div>
        </div>
      </div>

      <MainSideImage imageURL={regImg} />
    </div>
  );
}

export default Register;
