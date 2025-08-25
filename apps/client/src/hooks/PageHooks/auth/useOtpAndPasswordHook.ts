import { useOtpAndPasswordForm } from '@client/hooks/auth/logic/useOtpAndPasswordForm';
import { RootState } from '@client/redux/store';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { otpAndPasswordSchema, OtpAndPasswordSchemaType } from '@bro/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useOtpAndPasswordHook = () => {
  const userBasicData = useSelector((state: RootState) => state.auth);

  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  const { mutate } = useOtpAndPasswordForm(mode);

  const onSubmit = (data: OtpAndPasswordSchemaType) => {
    if (mode) {
      const userData = {
        ...userBasicData,
        ...data,
      };
      mutate({ data: userData, mode });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpAndPasswordSchemaType>({
    resolver: zodResolver(otpAndPasswordSchema),
  });

  const errorMessage = useSelector((state: RootState) => state.error.message);

  return { onSubmit, register, handleSubmit, errors, errorMessage };
};
