import { Fragment } from 'react';
import { MdWorkOutline } from 'react-icons/md';
import { SanitizedExperience } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';
import SectionCard from '../section-card';
import { Timeline, TimelineItem } from '../timeline';

const ExperienceCard = ({
  experiences,
  loading,
}: {
  experiences: SanitizedExperience[];
  loading: boolean;
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 2; index++) {
      array.push(
        <TimelineItem
          key={index}
          accent="secondary"
          time={skeleton({
            widthCls: 'w-5/12',
            heightCls: 'h-4',
          })}
          title={skeleton({
            widthCls: 'w-6/12',
            heightCls: 'h-4',
            className: 'my-1.5',
          })}
          subtitle={skeleton({ widthCls: 'w-6/12', heightCls: 'h-3' })}
        />,
      );
    }

    return array;
  };

  return (
    <SectionCard
      icon={<MdWorkOutline />}
      title="Experience"
      accent="secondary"
      loading={loading}
      size="sm"
    >
      <div className="text-base-content">
        <Timeline accent="secondary">
          {loading ? (
            renderSkeleton()
          ) : (
            <Fragment>
              {experiences.map((experience, index) => (
                <TimelineItem
                  key={index}
                  accent="secondary"
                  time={`${experience.from} - ${experience.to}`}
                  title={experience.position}
                  subtitle={experience.company}
                  subtitleLink={
                    experience.companyLink ? experience.companyLink : undefined
                  }
                />
              ))}
            </Fragment>
          )}
        </Timeline>
      </div>
    </SectionCard>
  );
};

export default ExperienceCard;
