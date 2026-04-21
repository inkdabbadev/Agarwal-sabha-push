import Image from "next/image";

type EventBrandHeaderProps = {
  compact?: boolean;
};

export function EventBrandHeader({ compact = false }: EventBrandHeaderProps) {
  return (
    <header className={`poster-header ${compact ? "poster-header--compact" : ""}`}>
      <div className="poster-header__ornament">
        <Image
          src="/assets/top-ornament.png"
          alt="Shree Agarwal Sabha decorative banner"
          width={1400}
          height={276}
          priority
          className="poster-header__ornament-image"
        />
      </div>

      <div className="poster-header__title-group">
        <Image
          src="/assets/sabha-title.png"
          alt="Shree Agarwal Sabha"
          width={1239}
          height={125}
          priority
          className="poster-header__title"
        />
        <Image
          src="/assets/service-since.png"
          alt="In service since 1952"
          width={633}
          height={75}
          className="poster-header__service"
        />
      </div>
    </header>
  );
}
