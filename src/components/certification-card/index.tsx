import React from 'react';
import { SanitizedCertification } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

const tileClassName =
  'flex h-full flex-col gap-2 rounded-lg border border-base-300 bg-base-200/60 p-3 transition hover:border-info hover:bg-base-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-info';

const ListItem = ({
  year,
  name,
  body,
  link,
  monogram,
}: {
  year?: React.ReactNode;
  name?: React.ReactNode;
  body?: React.ReactNode;
  link?: string;
  monogram?: React.ReactNode;
}) => {
  const content = (
    <>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info/15 text-xs font-bold text-info">
        {monogram}
      </div>
      <div className="line-clamp-3 text-xs font-semibold leading-snug text-base-content">
        {name}
      </div>
      <div className="mt-auto flex items-center justify-between gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-base-content/60">
          {year}
        </span>
        {link && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="11"
            height="11"
            aria-hidden="true"
            className="shrink-0 text-info"
          >
            <path d="M14 4h6v6" />
            <path d="M20 4 10 14" />
            <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
          </svg>
        )}
      </div>
    </>
  );

  const title = typeof body === 'string' ? body : undefined;

  return (
    <li className="h-full">
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          title={title}
          className={tileClassName}
        >
          {content}
        </a>
      ) : (
        <div title={title} className={tileClassName}>
          {content}
        </div>
      )}
    </li>
  );
};

const CertificationCard = ({
  certifications,
  loading,
}: {
  certifications: SanitizedCertification[];
  loading: boolean;
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 2; index++) {
      array.push(
        <ListItem
          key={index}
          monogram={skeleton({ widthCls: 'w-4', heightCls: 'h-3' })}
          name={skeleton({
            widthCls: 'w-full',
            heightCls: 'h-3',
            className: 'my-1.5',
          })}
          year={skeleton({ widthCls: 'w-8', heightCls: 'h-3' })}
        />,
      );
    }

    return array;
  };

  return (
    <div className="card w-full shadow-lg card-sm bg-base-100">
      <div className="card-body w-full px-4">
        <h5 className="card-title">
          {loading ? (
            skeleton({ widthCls: 'w-32', heightCls: 'h-8' })
          ) : (
            <span className="text-info">Certification</span>
          )}
        </h5>
        <ul
          className="grid w-full gap-2"
          style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(88px,1fr))' }}
        >
          {loading
            ? renderSkeleton()
            : certifications.map((certification, index) => (
                <ListItem
                  key={index}
                  year={certification.year}
                  name={certification.name}
                  body={certification.body}
                  link={certification.link}
                  monogram={getInitials(certification.name ?? '')}
                />
              ))}
        </ul>
      </div>
    </div>
  );
};

export default CertificationCard;
