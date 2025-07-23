import { FaFacebookF, FaGithub, FaGoogle } from 'react-icons/fa';
import { Button } from '../../ui/button';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import { setLoading } from '@client/redux/features/userSlices/authSlices/userSlice';

function SocialLogin() {
  const socialLogins = [
    { icon: <FaGoogle className="h-5 w-5" />, alt: 'Google', type: 'google' },
    { icon: <FaGithub className="h-5 w-5" />, alt: 'Github', type: 'github' },
    {
      icon: <FaFacebookF className="h-5 w-5" />,
      alt: 'Facebook',
      type: 'facebook',
    },
  ];
  const dispatch = useAppDispatch();

  const handleSocialLogin = async (provider: string) => {
    dispatch(setLoading({ loading: true }));
    if (provider === 'google') {
      window.location.href = import.meta.env.VITE_BASE_API + '/auth/google';
    } else if (provider === 'github') {
      window.location.href = import.meta.env.VITE_BASE_API + '/auth/github';
    } else {
      window.location.href = import.meta.env.VITE_BASE_API + '/auth/facebook';
    }
  };

  return (
    <div className="flex flex-col justify-center py-5">
      <label className="text-center font-normal text-[13px] text-[#798995] pb-1">
        or continue with
      </label>
      <div className="flex justify-between">
        {socialLogins.map((social, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-[80px] h-[40px] rounded-[8px] border-[#bcbec0] flex justify-center items-center hover:cursor-pointer"
            onClick={() => handleSocialLogin(social.type)}
          >
            {social.icon}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default SocialLogin;
