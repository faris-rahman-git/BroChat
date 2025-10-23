import { Button } from '@client/components/ui/button';
import logo from '@client/assets/logo/chatLogo.webp';
import { useNavigate } from 'react-router-dom';

export function IntroHero() {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight text-balance">
                Connect, Share & Earn
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed text-balance">
                Experience the next generation of messaging. Chat with friends,
                join groups, make video calls, and monetize your influence with
                our exclusive creator program.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#003286] hover:bg-[#003286]/90 text-primary-foreground"
                onClick={() => navigate('/login')}
              >
                Get Started →
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-[#003286]">10M+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#003286]">150+</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#003286]">24/7</p>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 sm:h-full min-h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-[#003286]/20 to-accent/20 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-[#003286]/10 to-accent/10 rounded-3xl border border-border p-8 h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20  rounded-full mx-auto flex items-center justify-center text-4xl">
                  <img
                    src={logo}
                    alt="brochat logo"
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                  />
                </div>
                <p className="text-foreground font-semibold">
                  Ready to connect?
                </p>
                <p className="text-sm text-muted-foreground">
                  Join millions of users worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
