import { EnableAlertsButton } from "@/components/EnableAlertsButton";

const scheduleItems = [
  {
    time: "4:30 PM",
    title: "Guest arrival and welcome reception",
    description: "Registration, usher support, and hospitality services open for attendees."
  },
  {
    time: "5:30 PM",
    title: "Inaugural ceremony and lamp lighting",
    description: "Formal opening of the 75th Platinum Jubilee celebration."
  },
  {
    time: "6:30 PM",
    title: "Cultural programme and commemorative addresses",
    description: "A curated sequence of cultural segments, recognitions, and special remarks."
  },
  {
    time: "8:00 PM",
    title: "Community dinner and fellowship",
    description: "Dining service, networking, and support desk assistance."
  }
];

export default function EventInfoPage() {
  return (
    <main className="section-shell py-6 sm:py-8">
      <div className="glass-card overflow-hidden p-5 sm:p-8">
        <div className="max-w-3xl space-y-4">
          <a href="/" className="inline-flex items-center text-sm font-semibold text-primary">
            <span aria-hidden="true" className="mr-2 text-lg">
              ←
            </span>
            Back to home
          </a>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/70">
            Event Information
          </p>
          <h1 className="font-serif text-4xl text-primary sm:text-5xl">
            Shree Agarwal Sabha - 75th Platinum Jubilee
          </h1>
          <p className="text-base leading-7 text-foreground/76">
            The Platinum Jubilee gathering marks 75 years of community spirit, service,
            cultural continuity, and shared celebration. This page offers a simple event
            overview for attendees joining us at the inaugural celebration.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-primary/10 bg-white/80 p-5 shadow-card">
            <h2 className="font-serif text-3xl text-primary">Programme overview</h2>
            <div className="mt-5 space-y-4">
              {scheduleItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-border bg-surface/85 p-4"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/70">
                    {item.time}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/75">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-4">
            <section className="rounded-[2rem] border border-primary/10 bg-white/80 p-5 shadow-card">
              <h2 className="font-serif text-2xl text-primary">Venue and support</h2>
              <p className="mt-3 text-sm leading-6 text-foreground/76">
                Please follow directions from volunteers and on-site signage for entry,
                seating, stage access, dining flow, and senior guest support. The helpdesk
                can assist with seating guidance, lost-and-found, and coordination queries.
              </p>
            </section>

            <section className="rounded-[2rem] border border-primary/10 bg-white/80 p-5 shadow-card">
              <h2 className="font-serif text-2xl text-primary">Helpdesk and emergency</h2>
              <p className="mt-3 text-sm leading-6 text-foreground/76">
                For urgent assistance, please contact the nearest volunteer or visit the
                main reception and helpdesk counter. Emergency and first-response guidance
                can be announced through the live alert system when needed.
              </p>
            </section>

            <EnableAlertsButton
              compact
              title="Stay connected during the celebration"
              description="Enable alerts here if you have not subscribed yet."
            />
          </div>
        </div>
      </div>
    </main>
  );
}
