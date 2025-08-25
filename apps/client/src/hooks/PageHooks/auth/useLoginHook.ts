import { loginSchema, LoginSchemaType } from '@bro/shared';
import { useLoginForm } from '@client/hooks/auth/logic/useLoginForm';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { clearError } from '@client/redux/features/userSlices/authSlices/errorSlice';
import { RootState } from '@client/redux/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const useLoginHook = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mutate } = useLoginForm();

  const onSubmit = (data: LoginSchemaType) => {
    mutate(data);
  };

  const handleForgotPassword = () => {
    dispatch(clearError());
    navigate('/forgotPassword');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const errorMessage = useSelector((state: RootState) => state.error.message);

  return {
    onSubmit,
    handleForgotPassword,
    register,
    handleSubmit,
    errors,
    errorMessage,
  };
};
