import { EnableAlertsButton } from "@/components/EnableAlertsButton";

const highlights = [
  {
    title: "Live stage updates",
    description: "Receive important announcements about ceremonies, cultural moments, and timings."
  },
  {
    title: "Venue guidance",
    description: "Stay informed if there are changes for entry, seating, helpdesk, or support directions."
  },
  {
    title: "One-tap setup",
    description: "Enable alerts once and receive the same official message broadcast as every attendee."
  }
];

export default function HomePage() {
  return (
    <main className="pb-16 pt-6 sm:pb-24 sm:pt-8">
      <section className="section-shell">
        <div className="glass-card overflow-hidden">
          <div className="grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-10">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Official Event Hub
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl font-serif text-4xl leading-tight text-primary sm:text-5xl lg:text-6xl">
                  Shree Agarwal Sabha - 75th Platinum Jubilee
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-foreground/78">
                  Celebrating 75 years of unity, service, culture, and community.
                </p>
              </div>
              <p className="max-w-2xl text-base leading-7 text-foreground/75">
                Welcome to the official event hub for the Platinum Jubilee celebration.
                Stay informed with live announcements, important updates, and event
                information throughout the celebration.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-primary/10 bg-surface/85 p-4 shadow-card"
                  >
                    <p className="text-sm font-semibold text-primary">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-foreground/72">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pl-4">
              <EnableAlertsButton />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-8 sm:mt-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-primary/10 bg-white/80 p-6 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/75">
              Today at the venue
            </p>
            <h2 className="mt-3 font-serif text-3xl text-primary">Stay close to the celebration</h2>
            <p className="mt-4 text-sm leading-7 text-foreground/76">
              Keep this page open on your phone for real-time updates from the organizing
              team. Announcements will be used for stage cues, hospitality guidance, and
              important schedule notices.
            </p>
          </div>
          <div className="rounded-[2rem] border border-accent/20 bg-gradient-to-br from-primary to-[#8b3246] p-6 text-white shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
              Need details?
            </p>
            <h2 className="mt-3 font-serif text-3xl">Explore the event information page</h2>
            <p className="mt-4 text-sm leading-7 text-white/82">
              View a quick overview of the program, venue support, and attendee help
              information prepared for the Platinum Jubilee gathering.
            </p>
            <a href="/event-info" className="mt-6 inline-flex items-center text-sm font-semibold">
              Open event information
              <span aria-hidden="true" className="ml-2 text-lg">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
