import { features } from '@client/constants/authConstant/introConstants';

export function IntroFeatures() {
  return (
    <section className="py-20 sm:py-32 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Powerful Features for Everyone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Everything you need for seamless communication in one beautiful app
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-6 hover:border-[#003286]/50 transition-colors"
            >
              <div className="w-12 h-12 bg-[#003286]/10 rounded-lg flex items-center justify-center mb-4 text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
