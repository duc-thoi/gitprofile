import React from 'react';
import { MdOpenInNew } from 'react-icons/md';

export type TimelineAccent = 'secondary' | 'accent' | 'info';

/**
 * Accent classes are written out in full because Tailwind only emits CSS for
 * class names that appear verbatim in the source.
 */
const TIMELINE_ACCENTS: Record<
  TimelineAccent,
  { rail: string; dot: string; halo: string; link: string }
> = {
  secondary: {
    rail: 'border-secondary/30',
    dot: 'bg-secondary',
    halo: 'ring-secondary/15',
    link: 'hover:text-secondary',
  },
  accent: {
    rail: 'border-accent/30',
    dot: 'bg-accent',
    halo: 'ring-accent/15',
    link: 'hover:text-accent',
  },
  info: {
    rail: 'border-info/30',
    dot: 'bg-info',
    halo: 'ring-info/15',
    link: 'hover:text-info',
  },
};

/**
 * The vertical rail shared by the experience, education and certification
 * sections.
 *
 * @param accent - Which semantic colour the rail is keyed to.
 * @param children - TimelineItem elements.
 * @returns JSX element representing the timeline.
 */
export const Timeline = ({
  accent,
  children,
}: {
  accent: TimelineAccent;
  children: React.ReactNode;
}): React.JSX.Element => (
  <ol
    className={`relative border-l-2 ${TIMELINE_ACCENTS[accent].rail} my-2 ml-1 mr-1`}
  >
    {children}
  </ol>
);

/**
 * A single entry on the rail: a haloed dot, a date label, a title and a
 * subtitle, either of which can be a link.
 *
 * The dot is positioned against the `<ol>` rather than the `<li>` so that its
 * vertical position still comes from the item's own flow position.
 *
 * @param accent - Which semantic colour the dot is keyed to.
 * @param time - The date or date range.
 * @param title - The primary line.
 * @param subtitle - The secondary line.
 * @param titleLink - Makes the title a link when set.
 * @param subtitleLink - Makes the subtitle a link when set.
 * @returns JSX element representing the timeline item.
 */
export const TimelineItem = ({
  accent,
  time,
  title,
  subtitle,
  titleLink,
  subtitleLink,
}: {
  accent: TimelineAccent;
  time: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  titleLink?: string;
  subtitleLink?: string;
}): React.JSX.Element => {
  const accentClasses = TIMELINE_ACCENTS[accent];

  const withLink = (content: React.ReactNode, link?: string) =>
    link ? (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center gap-1 transition-colors ${accentClasses.link}`}
      >
        {content}
        <MdOpenInNew className="shrink-0 text-xs opacity-50" />
      </a>
    ) : (
      content
    );

  return (
    <li className="mb-6 ml-5 last:mb-0">
      <div
        className={`absolute -left-[6px] mt-1.5 w-2.5 h-2.5 rounded-full ring-4 ${accentClasses.dot} ${accentClasses.halo}`}
      ></div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-base-content/50">
        {time}
      </div>
      <h3 className="mt-1 font-semibold text-base-content">
        {withLink(title, titleLink)}
      </h3>
      <div className="mt-0.5 text-sm text-base-content/70">
        {withLink(subtitle, subtitleLink)}
      </div>
    </li>
  );
};
