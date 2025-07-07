import loginImg from '../../../assets/auth/login.webp';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FixedLogo from '../../customUi/auth/FixedLogo';
import AuthHeading from '../../customUi/auth/AuthHeading';
import { loginFormFields } from '../../../constants/authConstants';
import InputBlock from '../../customUi/auth/InputBlock';
import AuthNextButton from '../../customUi/auth/AuthNextButton';
import SocialLogin from '../../customUi/auth/SocialLogin';
import SwitchBWLoginAndRegister from '../../customUi/auth/SwitchBWLoginAndRegister';
import MainSideImage from '../../customUi/auth/MainSideImage';
import { loginSchema, type LoginSchemaType } from '@bro/shared';
import { showLoader, hideLoader } from '@client/redux/features/LoaderSlice';
import { useEffect } from 'react';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { useLogin } from '@client/hooks/auth/useLogin';
import Errorspan from '@client/components/customUi/auth/Errorspan';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { clearError, setError } from '@client/redux/features/errorSlice';
import { setUser } from '@client/redux/features/userSlice';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const errorMessage = useSelector((state: RootState) => state.error.message);
  const { isPending, isSuccess, isError, mutate, error, data } = useLogin();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: LoginSchemaType) => {
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
      dispatch(clearError());
      dispatch(setUser({ user: data.user }));
      if (data.user.role == 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
        window.location.reload();
      }
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

  const handleForgotPassword = () => {
    dispatch(clearError());
    navigate('/forgotPassword');
  };

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
