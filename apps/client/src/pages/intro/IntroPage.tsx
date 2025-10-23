import { IntroCTA } from '@client/components/features/intro/IntroCTA';
import { IntroFeatures } from '@client/components/features/intro/IntroFeatures';
import { IntroFooter } from '@client/components/features/intro/IntroFooter';
import { IntroHeader } from '@client/components/features/intro/IntroHeader';
import { IntroHero } from '@client/components/features/intro/IntroHero';
import { IntroPremiumFeatures } from '@client/components/features/intro/IntroPremiumFeatures';

function IntroPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
      <main className="bg-background overflow-auto">
        <IntroHeader />
        <IntroHero />
        <IntroFeatures />
        <IntroPremiumFeatures />
        <IntroCTA />
        <IntroFooter />
      </main>
    </div>
  );
}

export default IntroPage;
