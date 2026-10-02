import { AiOutlineFork, AiOutlineStar, AiOutlineGithub } from 'react-icons/ai';
import { MdOpenInNew } from 'react-icons/md';
import { VscRepo } from 'react-icons/vsc';
import { ga, getLanguageColor, skeleton } from '../../utils';
import { ITEM_CARD_CLASS } from '../../constants';
import { GithubProject } from '../../interfaces/github-project';
import SectionCard from '../section-card';

const GithubProjectCard = ({
  header,
  githubProjects,
  loading,
  limit,
  googleAnalyticsId,
}: {
  header: string;
  githubProjects: GithubProject[];
  loading: boolean;
  limit: number;
  googleAnalyticsId?: string;
}) => {
  if (!loading && githubProjects.length === 0) {
    return;
  }

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < limit; index++) {
      array.push(
        <div
          className="card card-sm bg-base-100 border border-base-300 shadow-md h-full"
          key={index}
        >
          <div className="flex justify-between flex-col p-8 h-full w-full">
            <div>
              <div className="flex items-center">
                <span>
                  <h5 className="card-title text-lg">
                    {skeleton({
                      widthCls: 'w-32',
                      heightCls: 'h-8',
                      className: 'mb-1',
                    })}
                  </h5>
                </span>
              </div>
              <div className="mb-5 mt-1">
                {skeleton({
                  widthCls: 'w-full',
                  heightCls: 'h-4',
                  className: 'mb-2',
                })}
                {skeleton({ widthCls: 'w-full', heightCls: 'h-4' })}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex grow">
                <span className="mr-3 flex items-center">
                  {skeleton({ widthCls: 'w-12', heightCls: 'h-4' })}
                </span>
                <span className="flex items-center">
                  {skeleton({ widthCls: 'w-12', heightCls: 'h-4' })}
                </span>
              </div>
              <div>
                <span className="flex items-center">
                  {skeleton({ widthCls: 'w-12', heightCls: 'h-4' })}
                </span>
              </div>
            </div>
          </div>
        </div>,
      );
    }

    return array;
  };

  const renderProjects = () => {
    return githubProjects.map((item, index) => (
      <a
        className={`${ITEM_CARD_CLASS} group cursor-pointer`}
        // The language strip is set inline so it always wins over the shared
        // card border, whatever order Tailwind emits the border utilities in.
        style={{
          borderLeftColor: getLanguageColor(item.language),
          borderLeftWidth: '4px',
        }}
        href={item.html_url}
        key={index}
        onClick={(e) => {
          e.preventDefault();

          try {
            if (googleAnalyticsId) {
              ga.event('Click project', { project: item.name });
            }
          } catch (error) {
            console.error(error);
          }

          window?.open(item.html_url, '_blank');
        }}
      >
        <div className="flex justify-between flex-col p-8 h-full w-full">
          <div>
            <div className="card-title text-lg tracking-tight flex items-center gap-1.5 text-base-content">
              <VscRepo className="shrink-0 opacity-70" />
              <span className="truncate">{item.name}</span>
              <MdOpenInNew className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
            </div>
            <p className="mb-5 mt-2 text-base-content/70 text-sm line-clamp-2">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 text-xs text-base-content/70">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 bg-base-200 rounded-full px-2 py-0.5">
                <AiOutlineStar />
                <span>{item.stargazers_count}</span>
              </span>
              <span className="flex items-center gap-1 bg-base-200 rounded-full px-2 py-0.5">
                <AiOutlineFork />
                <span>{item.forks_count}</span>
              </span>
            </div>
            {item.language && (
              <span className="flex items-center gap-1 bg-base-200 rounded-full px-2 py-0.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: getLanguageColor(item.language) }}
                />
                <span className="truncate">{item.language}</span>
              </span>
            )}
          </div>
        </div>
      </a>
    ));
  };

  return (
    <SectionCard
      icon={<AiOutlineGithub />}
      title={header}
      subtitle={`Showcasing ${githubProjects.length} featured repositories`}
      accent="primary"
      loading={loading}
      wide
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? renderSkeleton() : renderProjects()}
      </div>
    </SectionCard>
  );
};

export default GithubProjectCard;
