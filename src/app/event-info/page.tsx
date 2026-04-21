import Image from "next/image";

import { EnableAlertsButton } from "@/components/EnableAlertsButton";
import { EventBrandHeader } from "@/components/EventBrandHeader";
import { LiveAnnouncementPanel } from "@/components/LiveAnnouncementPanel";

const scheduleItems = [
  {
    time: "4:30 PM",
    title: "Arrival and welcome",
    description: "Entry and seating open."
  },
  {
    time: "5:30 PM",
    title: "Inaugural ceremony",
    description: "Formal opening."
  },
  {
    time: "6:30 PM",
    title: "Cultural programme",
    description: "Performances and addresses."
  },
  {
    time: "8:00 PM",
    title: "Dinner",
    description: "Dinner service and fellowship."
  }
];

export default function EventInfoPage() {
  return (
    <main
      className="poster-page"
      style={{
        backgroundImage: [
          "radial-gradient(circle at top center, rgba(255, 255, 255, 0.08), transparent 28%)",
          "linear-gradient(180deg, rgba(11, 39, 53, 0.18), rgba(5, 17, 25, 0.7))",
          "url('/assets/background-texture-optimized.jpg')"
        ].join(", ")
      }}
    >
      <div className="poster-page__overlay" />

      <section className="section-shell relative z-[1] py-5 sm:py-7">
        <div className="poster-shell">
          <EventBrandHeader compact />

          <div className="event-info-hero">
            <div className="event-info-hero__copy">
              <a href="/" className="event-info-hero__back-link">
                <span aria-hidden="true">&lt;-</span>
                Back to home
              </a>

              <p className="event-info-hero__eyebrow">Event information</p>
              <h1 className="event-info-hero__title">
                Shree Agarwal Sabha - 75th Platinum Jubilee
              </h1>
              <p className="event-info-hero__description">
                Programme, venue, and support details.
              </p>
            </div>

            <div className="event-info-hero__art">
              <Image
                src="/assets/platinum-jubilee-logo.png"
                alt="75th Year Platinum Jubilee celebrations"
                width={783}
                height={796}
                className="event-info-hero__logo"
              />
            </div>
          </div>

          <div className="event-info-layout">
            <section className="simple-section simple-section--info">
              <p className="poster-detail-card__eyebrow">Programme overview</p>
              <div className="event-schedule-grid">
                {scheduleItems.map((item) => (
                  <div key={item.title} className="simple-list-item">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8bf8a]">
                      {item.time}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/72">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="event-info-layout__side">
              <LiveAnnouncementPanel compact />

              <section className="simple-section simple-section--info">
                <p className="poster-detail-card__eyebrow">Venue and support</p>
                <p className="poster-detail-card__copy">Follow venue signage and volunteer guidance.</p>
              </section>

              <section className="simple-section simple-section--info">
                <p className="poster-detail-card__eyebrow">Helpdesk and emergency</p>
                <p className="poster-detail-card__copy">Please contact the nearest volunteer or helpdesk.</p>
              </section>

              <EnableAlertsButton
                compact
                title="Enable Alerts"
                description="Turn on live updates."
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
