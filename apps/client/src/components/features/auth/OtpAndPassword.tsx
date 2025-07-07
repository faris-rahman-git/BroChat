import otpImg from '../../../assets/auth/otp.webp';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/commonHooks/useAppDispatch';
import { useOtpAndPassword } from '../../../hooks/auth/useOtpAndPassword';
import { hideLoader, showLoader } from '../../../redux/features/LoaderSlice';
import FixedLogo from '../../customUi/auth/FixedLogo';
import AuthHeading from '../../customUi/auth/AuthHeading';
import { otpAndPasswordFormFields } from '../../../constants/authConstants';
import InputBlock from '../../customUi/auth/InputBlock';
import AuthNextButton from '../../customUi/auth/AuthNextButton';
import MainSideImage from '../../customUi/auth/MainSideImage';
import {
  otpAndPasswordSchema,
  type OtpAndPasswordSchemaType,
} from '@bro/shared';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { clearRegisterData } from '@client/redux/features/authSlice';
import Errorspan from '@client/components/customUi/auth/Errorspan';
import axios from 'axios';
import { setError } from '@client/redux/features/errorSlice';

function OtpAndPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpAndPasswordSchemaType>({
    resolver: zodResolver(otpAndPasswordSchema),
  });

  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const errorMessage = useSelector((state: RootState) => state.error.message);
  const userBasicData = useSelector((state: RootState) => state.auth);
  const { isPending, isSuccess, isError, mutate, error } = useOtpAndPassword();

  const onSubmit = (data: OtpAndPasswordSchemaType) => {
    if (mode) {
      const userData = {
        ...userBasicData,
        ...data,
      };
      mutate({ data: userData, mode });
    }
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
      if (mode === 'register') {
        dispatch(setError('Account created successfully! '));
      } else {
        dispatch(setError('Password changed successfully! '));
      }
      dispatch(clearRegisterData());
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
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
