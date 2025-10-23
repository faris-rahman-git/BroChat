import { Button } from '@client/components/ui/button';
import logo from '@client/assets/logo/chatLogo.webp';
import { useNavigate } from 'react-router-dom';

export function IntroHeader() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="brochat logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-foreground hover:bg-muted"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            className="bg-[#003286] hover:bg-[#003286]/90 text-primary-foreground"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      </div>
    </header>
  );
}
