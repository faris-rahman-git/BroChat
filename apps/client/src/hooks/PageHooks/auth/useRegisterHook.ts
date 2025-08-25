import { useRegisterForm } from '@client/hooks/auth/logic/useRegisterForm';
import { registerSchema, RegisterSchemaType } from '@bro/shared';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { setRegisterData } from '@client/redux/features/userSlices/authSlices/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';

export const useRegisterHook = () => {
  const dispatch = useAppDispatch();

  const { mutate } = useRegisterForm();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const errorMessage = useSelector((state: RootState) => state.error.message);

  return { onSubmit, register, handleSubmit, errors, errorMessage };
};
