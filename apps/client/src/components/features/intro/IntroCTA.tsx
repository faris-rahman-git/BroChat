import { Button } from '@client/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function IntroCTA() {
    const navigate = useNavigate();
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-r from-primary/5 to-accent/5 border-y border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Ready to Join brochat?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Start connecting with millions of users today. Sign up in seconds
            and begin your journey.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-[#003286] hover:bg-[#003286]/90 text-primary-foreground"
            onClick={() => navigate('/register')}

          >
            Create Account →
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border hover:bg-muted bg-transparent"
            onClick={() => navigate('/login')}

          >
            Sign In
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          No credit card required. Free account includes all basic features.
        </p>
      </div>
    </section>
  );
}
