import { AiOutlineBook } from 'react-icons/ai';
import { SanitizedPublication } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';
import { ITEM_CARD_CLASS } from '../../constants';
import SectionCard from '../section-card';

const PublicationCard = ({
  publications,
  loading,
}: {
  publications: SanitizedPublication[];
  loading: boolean;
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < publications.length; index++) {
      array.push(
        <div
          className="card card-sm bg-base-100 border border-base-300 shadow-md h-full"
          key={index}
        >
          <div className="p-8 h-full w-full">
            <div className="flex items-center flex-col">
              <div className="w-full">
                <div className="px-4">
                  <div className="text-center w-full">
                    <h2 className="mb-2">
                      {skeleton({
                        widthCls: 'w-32',
                        heightCls: 'h-8',
                        className: 'mb-2 mx-auto',
                      })}
                    </h2>
                    <div>
                      {skeleton({
                        widthCls: 'w-20',
                        heightCls: 'h-4',
                        className: 'mb-2 mx-auto',
                      })}
                    </div>
                    <div>
                      {skeleton({
                        widthCls: 'w-20',
                        heightCls: 'h-4',
                        className: 'mb-2 mx-auto',
                      })}
                    </div>
                    <div>
                      {skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-4',
                        className: 'mb-2 mx-auto',
                      })}
                    </div>
                    <div>
                      {skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-4',
                        className: 'mb-2 mx-auto',
                      })}
                    </div>
                    <div>
                      {skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-4',
                        className: 'mb-2 mx-auto',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
      );
    }

    return array;
  };

  const renderPublications = () => {
    return publications.map((item, index) => (
      <a
        className={`${ITEM_CARD_CLASS} cursor-pointer`}
        key={index}
        href={item.link}
        target="_blank"
        rel="noreferrer"
      >
        <div className="p-8 h-full w-full">
          <div className="flex items-center flex-col">
            <div className="w-full">
              <div className="px-4">
                <div className="text-center w-full">
                  <h2 className="font-display font-semibold mb-2">
                    {item.title}
                  </h2>
                  {item.conferenceName && (
                    <p className="text-base-content/50 text-sm">
                      {item.conferenceName}
                    </p>
                  )}
                  {item.journalName && (
                    <p className="text-base-content/50 text-sm">
                      {item.journalName}
                    </p>
                  )}
                  {item.authors && (
                    <p className="text-base-content/50 text-sm">
                      Author: {item.authors}
                    </p>
                  )}
                  {item.description && (
                    <p className="mt-2 text-base-content/70 text-sm text-justify line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    ));
  };

  return (
    <SectionCard
      icon={<AiOutlineBook />}
      title="Publications"
      subtitle={`Showcasing ${publications.length} publications`}
      accent="secondary"
      loading={loading}
      wide
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? renderSkeleton() : renderPublications()}
      </div>
    </SectionCard>
  );
};

export default PublicationCard;
