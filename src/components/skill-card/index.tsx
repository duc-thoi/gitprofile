import { HiOutlineSparkles } from 'react-icons/hi2';
import { accentAt } from '../../constants';
import { skeleton } from '../../utils';
import SectionCard from '../section-card';

const SkillCard = ({
  loading,
  skills,
}: {
  loading: boolean;
  skills: string[];
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 12; index++) {
      array.push(
        <div key={index}>
          {skeleton({ widthCls: 'w-16', heightCls: 'h-5' })}
        </div>,
      );
    }

    return array;
  };

  return (
    <SectionCard
      icon={<HiOutlineSparkles />}
      title="Tech Stack"
      accent="primary"
      loading={loading}
      size="sm"
    >
      <div className="flex flex-wrap justify-center gap-2">
        {loading
          ? renderSkeleton()
          : skills.map((skill, index) => (
              <div
                key={index}
                className={`badge badge-soft badge-md transition-colors ${
                  accentAt(index).badge
                }`}
              >
                {skill}
              </div>
            ))}
      </div>
    </SectionCard>
  );
};

export default SkillCard;
