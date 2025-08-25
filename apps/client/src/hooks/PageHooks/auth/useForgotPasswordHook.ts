import { useForgotPasswordForm } from '@client/hooks/auth/logic/useForgotPasswordForm';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { forgotPasswordSchema, ForgotPasswordSchemaType } from '@bro/shared';
import { setRegisterData } from '@client/redux/features/userSlices/authSlices/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';

export const useForgotPasswordHook = () => {
  const dispatch = useAppDispatch();

  const { mutate } = useForgotPasswordForm();
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const errorMessage = useSelector((state: RootState) => state.error.message);

  return { onSubmit, register, handleSubmit, errors, errorMessage };
};
