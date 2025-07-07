import regImg from '../../../assets/auth/register.webp';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/commonHooks/useAppDispatch';
import { useRegister } from '../../../hooks/auth/useRegister';
import {
  clearRegisterData,
  setRegisterData,
} from '../../../redux/features/authSlice';
import { hideLoader, showLoader } from '../../../redux/features/LoaderSlice';
import FixedLogo from '../../customUi/auth/FixedLogo';
import AuthHeading from '../../customUi/auth/AuthHeading';
import { registerFormFields } from '../../../constants/authConstants';
import InputBlock from '../../customUi/auth/InputBlock';
import AuthNextButton from '../../customUi/auth/AuthNextButton';
import SocialLogin from '../../customUi/auth/SocialLogin';
import SwitchBWLoginAndRegister from '../../customUi/auth/SwitchBWLoginAndRegister';
import MainSideImage from '../../customUi/auth/MainSideImage';
import { registerSchema, type RegisterSchemaType } from '@bro/shared';
import Errorspan from '@client/components/customUi/auth/Errorspan';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { setError } from '@client/redux/features/errorSlice';

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const errorMessage = useSelector((state: RootState) => state.error.message);
  const { isPending, isSuccess, isError, mutate, error } = useRegister();

  const onSubmit = (data: RegisterSchemaType) => {
    dispatch(
      setRegisterData({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
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
      navigate('/otpandpassword?mode=register');
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
