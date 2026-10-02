import { TbCertificate } from 'react-icons/tb';
import { SanitizedCertification } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';
import SectionCard from '../section-card';
import { Timeline, TimelineItem } from '../timeline';

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
        <TimelineItem
          key={index}
          accent="info"
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
      icon={<TbCertificate />}
      title="Certification"
      accent="info"
      loading={loading}
      size="sm"
    >
      <div className="text-base-content">
        <Timeline accent="info">
          {loading ? (
            renderSkeleton()
          ) : (
            <>
              {certifications.map((certification, index) => (
                <TimelineItem
                  key={index}
                  accent="info"
                  time={certification.year}
                  title={certification.name}
                  titleLink={certification.link}
                  subtitle={certification.body}
                />
              ))}
            </>
          )}
        </Timeline>
      </div>
    </SectionCard>
  );
};

export default CertificationCard;
