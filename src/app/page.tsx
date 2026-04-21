import Image from "next/image";

import { EnableAlertsButton } from "@/components/EnableAlertsButton";
import { EventBrandHeader } from "@/components/EventBrandHeader";

export default function HomePage() {
  return (
    <main
      className="poster-page"
      style={{
        backgroundImage: [
          "radial-gradient(circle at top center, rgba(255, 255, 255, 0.09), transparent 28%)",
          "linear-gradient(180deg, rgba(11, 39, 53, 0.18), rgba(5, 17, 25, 0.68))",
          "url('/assets/background-texture-optimized.jpg')"
        ].join(", ")
      }}
    >
      <div className="poster-page__overlay" />

      <section className="section-shell relative z-[1] py-5 sm:py-7">
        <div className="poster-shell">
          <EventBrandHeader />

          <div className="poster-center">
            <div className="poster-center__glow" />

            <div className="poster-center__art poster-center__art--home">
              <div className="poster-center__logo-shell">
                <Image
                  src="/assets/platinum-jubilee-logo.png"
                  alt="75th Year Platinum Jubilee celebrations"
                  width={783}
                  height={796}
                  priority
                  className="poster-center__logo"
                />
              </div>

              <div className="poster-event-panel">
                <Image
                  src="/assets/inaugural-ceremony.png"
                  alt="Inaugural Ceremony"
                  width={533}
                  height={218}
                  className="poster-event-panel__title"
                />

                <div className="poster-event-panel__date-wrap">
                  <span className="poster-event-panel__line" />
                  <Image
                    src="/assets/event-date.png"
                    alt="Sunday, 26th April, 2026"
                    width={906}
                    height={112}
                    className="poster-event-panel__date"
                  />
                  <span className="poster-event-panel__line" />
                </div>

                <p className="poster-event-panel__copy">
                  Live updates for the Platinum Jubilee celebration.
                </p>
              </div>
            </div>

            <div className="poster-center__actions">
              <EnableAlertsButton
                title="Enable Alerts"
                description="Get live event updates."
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
