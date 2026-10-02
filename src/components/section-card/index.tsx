import { skeleton } from '../../utils';

export type SectionAccent =
  'primary' | 'secondary' | 'accent' | 'info' | 'neutral';

/**
 * Accent classes are written out in full because Tailwind only emits CSS for
 * class names that appear verbatim in the source.
 */
const SECTION_ACCENTS: Record<
  SectionAccent,
  { border: string; tile: string; icon: string }
> = {
  primary: {
    border: 'border-primary/20',
    tile: 'bg-primary/10',
    icon: 'text-primary',
  },
  secondary: {
    border: 'border-secondary/20',
    tile: 'bg-secondary/10',
    icon: 'text-secondary',
  },
  accent: {
    border: 'border-accent/20',
    tile: 'bg-accent/10',
    icon: 'text-accent',
  },
  info: {
    border: 'border-info/20',
    tile: 'bg-info/10',
    icon: 'text-info',
  },
  neutral: {
    border: 'border-neutral/20',
    tile: 'bg-neutral/10',
    icon: 'text-neutral',
  },
};

interface SectionCardProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  accent: SectionAccent;
  loading: boolean;
  /**
   * 'sm' is the sidebar treatment, 'md' the wide main-column one.
   *
   * The surface follows the size: main-column sections sit on `base-200` so
   * their `base-100` item cards stand out, while sidebar sections have no inner
   * cards and would disappear into the page gradient at `base-200`.
   */
  size?: 'sm' | 'md';
  /** Wraps the card in the two-column span the main sections use. */
  wide?: boolean;
  children: React.ReactNode;
}

/**
 * The shared frame for every portfolio section: an accent-tinted icon tile, a
 * title and optional subtitle, and the loading skeletons for all three.
 *
 * @param icon - Section icon, rendered inside the accent tile.
 * @param title - Section heading.
 * @param subtitle - Optional line under the heading.
 * @param accent - Which semantic colour the section is keyed to.
 * @param loading - Whether to render skeletons in place of the header text.
 * @param size - 'sm' for the sidebar, 'md' for the main column.
 * @param wide - Whether to span both columns.
 * @param children - The section body.
 * @returns JSX element representing the section card.
 */
const SectionCard = ({
  icon,
  title,
  subtitle,
  accent,
  loading,
  size = 'md',
  wide = false,
  children,
}: SectionCardProps): React.JSX.Element => {
  const accentClasses = SECTION_ACCENTS[accent];
  const compact = size === 'sm';

  const card = (
    <div
      className={`card ${
        compact ? 'bg-base-100' : 'bg-base-200'
      } shadow-xl border ${accentClasses.border}`}
    >
      <div className={`card-body ${compact ? 'p-5' : 'p-8'}`}>
        <div className={`flex items-center gap-3 ${compact ? 'mb-4' : 'mb-8'}`}>
          {loading ? (
            skeleton({
              widthCls: compact ? 'w-9' : 'w-12',
              heightCls: compact ? 'h-9' : 'h-12',
              className: 'rounded-xl shrink-0',
            })
          ) : (
            <div
              className={`flex items-center justify-center shrink-0 rounded-xl ${
                compact ? 'w-9 h-9 text-lg' : 'w-12 h-12 text-2xl'
              } ${accentClasses.tile} ${accentClasses.icon}`}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3
              className={`font-display font-bold tracking-tight text-base-content truncate ${
                compact ? 'text-sm' : 'text-base sm:text-lg'
              }`}
            >
              {loading
                ? skeleton({
                    widthCls: 'w-40',
                    heightCls: compact ? 'h-5' : 'h-8',
                  })
                : title}
            </h3>
            {subtitle !== undefined && (
              <div className="text-base-content/60 text-xs sm:text-sm mt-1 truncate">
                {loading
                  ? skeleton({ widthCls: 'w-32', heightCls: 'h-4' })
                  : subtitle}
              </div>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  return wide ? <div className="col-span-1 lg:col-span-2">{card}</div> : card;
};

export default SectionCard;
