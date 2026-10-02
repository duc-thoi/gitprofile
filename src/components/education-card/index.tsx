import { IoSchoolOutline } from 'react-icons/io5';
import { SanitizedEducation } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';
import SectionCard from '../section-card';
import { Timeline, TimelineItem } from '../timeline';

const EducationCard = ({
  loading,
  educations,
}: {
  loading: boolean;
  educations: SanitizedEducation[];
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 2; index++) {
      array.push(
        <TimelineItem
          key={index}
          accent="accent"
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
      icon={<IoSchoolOutline />}
      title="Education"
      accent="accent"
      loading={loading}
      size="sm"
    >
      <div className="text-base-content">
        <Timeline accent="accent">
          {loading ? (
            renderSkeleton()
          ) : (
            <>
              {educations.map((item, index) => (
                <TimelineItem
                  key={index}
                  accent="accent"
                  time={`${item.from} - ${item.to}`}
                  title={item.degree}
                  subtitle={item.institution}
                />
              ))}
            </>
          )}
        </Timeline>
      </div>
    </SectionCard>
  );
};

export default EducationCard;
