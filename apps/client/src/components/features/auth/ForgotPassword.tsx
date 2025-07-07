import forgotImg from '../../../assets/auth/forgotPassword.webp';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FixedLogo from '../../customUi/auth/FixedLogo';
import AuthHeading from '../../customUi/auth/AuthHeading';
import { forgotPasswordFormFields } from '../../../constants/authConstants';
import InputBlock from '../../customUi/auth/InputBlock';
import AuthNextButton from '../../customUi/auth/AuthNextButton';
import SocialLogin from '../../customUi/auth/SocialLogin';
import SwitchBWLoginAndRegister from '../../customUi/auth/SwitchBWLoginAndRegister';
import MainSideImage from '../../customUi/auth/MainSideImage';
import { forgotPasswordSchema, ForgotPasswordSchemaType } from '@bro/shared';
import { showLoader, hideLoader } from '@client/redux/features/LoaderSlice';
import { useEffect } from 'react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { useForgotPassword } from '@client/hooks/auth/useForgotPassword';
import {
  clearRegisterData,
  setRegisterData,
} from '@client/redux/features/authSlice';
import Errorspan from '@client/components/customUi/auth/Errorspan';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { setError } from '@client/redux/features/errorSlice';

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const errorMessage = useSelector((state: RootState) => state.error.message);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isPending, isSuccess, isError, mutate, error } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordSchemaType) => {
    dispatch(
      setRegisterData({
        name: null,
        email: data.email,
        phoneNumber: null,
      })
    );
    mutate(data);
  };

  useEffect(() => {
    if (isPending) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setError('Please check your email For OTP'));
      navigate('/otpandpassword?mode=forgot');
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      dispatch(clearRegisterData());
      if (axios.isAxiosError(error)) {
        dispatch(
          setError(error.response?.data?.message || 'Somthing went wrong')
        );
      } else {
        dispatch(setError(error.message || 'Somthing went wrong'));
      }
    }
  }, [isError, error, dispatch]);

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
