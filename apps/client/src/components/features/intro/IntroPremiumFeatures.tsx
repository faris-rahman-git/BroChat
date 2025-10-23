import { premiumFeatures } from '@client/constants/authConstant/introConstants';

export function IntroPremiumFeatures() {
  return (
    <section className="py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block px-4 py-2 bg-[#008C75]/10 rounded-full border border-[#008C75]/20">
            <p className="text-sm font-semibold text-[#008C75]">
              Premium Features
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Monetize Your Influence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Turn your connections into income with our innovative creator
            economy features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {premiumFeatures.map((feature, index) => (
            <div
              key={index}
              className={`rounded-xl border p-8 transition-all ${
                feature.highlight
                  ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-[#003286]/50 shadow-lg'
                  : 'bg-card border-border hover:border-[#003286]/30'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl ${
                  feature.highlight
                    ? 'bg-[#003286] text-primary-foreground'
                    : 'bg-[#003286]/10 text-[#003286]'
                }`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              {feature.highlight && (
                <div className="mt-4 pt-4 border-t border-[#003286]/20">
                  <p className="text-sm font-semibold text-[#003286]">
                    You earn 70% of all transactions
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-20 bg-muted/50 rounded-2xl border border-border p-8 sm:p-12">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            How Exclusive Users Earn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#003286] text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Become Exclusive
              </h4>
              <p className="text-sm text-muted-foreground">
                Pay a one-time fee to unlock exclusive status and set your own
                rates.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#003286] text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Set Your Price
              </h4>
              <p className="text-sm text-muted-foreground">
                Choose how much users pay to chat with you. You control the
                value.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#003286] text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h4 className="font-semibold text-foreground mb-2">Earn 70%</h4>
              <p className="text-sm text-muted-foreground">
                Keep 70% of every payment. We handle payments and support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
