import { useEffect, useState } from 'react';
import LazyImage from '../lazy-image';
import { PiNewspaper } from 'react-icons/pi';
import { getDevPost, getMediumPost } from '@arifszn/blog-js';
import { formatDistance } from 'date-fns';
import { SanitizedBlog } from '../../interfaces/sanitized-config';
import { ga, skeleton } from '../../utils';
import { accentAt, ITEM_CARD_CLASS } from '../../constants';
import { Article } from '../../interfaces/article';
import SectionCard from '../section-card';

const BlogCard = ({
  loading,
  blog,
  googleAnalyticsId,
}: {
  loading: boolean;
  blog: SanitizedBlog;
  googleAnalyticsId?: string;
}) => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (blog.source === 'medium') {
      getMediumPost({
        user: blog.username,
      }).then((res) => {
        setArticles(res);
      });
    } else if (blog.source === 'dev') {
      getDevPost({
        user: blog.username,
      }).then((res) => {
        setArticles(res);
      });
    }
  }, [blog.source, blog.username]);

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < blog.limit; index++) {
      array.push(
        <div
          className="card card-sm bg-base-100 border border-base-300 shadow-md h-full"
          key={index}
        >
          <div className="p-8 h-full w-full">
            <div className="flex items-center flex-col md:flex-row">
              <div className="avatar mb-5 md:mb-0">
                <div className="w-24 h-24 mask mask-squircle">
                  {skeleton({
                    widthCls: 'w-full',
                    heightCls: 'h-full',
                    shape: '',
                  })}
                </div>
              </div>
              <div className="w-full">
                <div className="flex items-start px-4">
                  <div className="w-full">
                    <h2>
                      {skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-8',
                        className: 'mb-2 mx-auto md:mx-0',
                      })}
                    </h2>
                    {skeleton({
                      widthCls: 'w-24',
                      heightCls: 'h-3',
                      className: 'mx-auto md:mx-0',
                    })}
                    <div className="mt-3">
                      {skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-4',
                        className: 'mx-auto md:mx-0',
                      })}
                    </div>
                    <div className="mt-4 flex items-center flex-wrap justify-center md:justify-start">
                      {skeleton({
                        widthCls: 'w-32',
                        heightCls: 'h-4',
                        className: 'md:mr-2 mx-auto md:mx-0',
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

  const renderArticles = () => {
    return articles && articles.length ? (
      articles.slice(0, blog.limit).map((article, index) => (
        <a
          className={`${ITEM_CARD_CLASS} cursor-pointer`}
          key={index}
          href={article.link}
          onClick={(e) => {
            e.preventDefault();

            try {
              if (googleAnalyticsId) {
                ga.event('Click Blog Post', {
                  post: article.title,
                });
              }
            } catch (error) {
              console.error(error);
            }

            window?.open(article.link, '_blank');
          }}
        >
          <div className="p-8 h-full w-full">
            <div className="flex items-center flex-col md:flex-row">
              <div className="avatar mb-5 md:mb-0 opacity-90">
                <div className="w-24 h-24 mask mask-squircle ring-1 ring-base-300">
                  <LazyImage
                    src={article.thumbnail}
                    alt={'thumbnail'}
                    placeholder={skeleton({
                      widthCls: 'w-full',
                      heightCls: 'h-full',
                      shape: '',
                    })}
                  />
                </div>
              </div>
              <div className="w-full">
                <div className="flex items-start px-4">
                  <div className="text-center md:text-left w-full">
                    <h2 className="font-display font-semibold text-base-content">
                      {article.title}
                    </h2>
                    <p className="text-base-content/50 text-xs">
                      {formatDistance(article.publishedAt, new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                    <p className="mt-3 text-base-content/70 text-sm line-clamp-3">
                      {article.description}
                    </p>
                    <div className="mt-4 flex items-center flex-wrap gap-1 justify-center md:justify-start">
                      {article.categories.map((category, index2) => (
                        <div
                          className={`badge badge-soft badge-sm ${
                            accentAt(index2).badge
                          }`}
                          key={index2}
                        >
                          #{category}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      ))
    ) : (
      <div className="text-center mb-6">
        <PiNewspaper className="mx-auto h-12 w-12 opacity-30" />
        <p className="mt-1 text-sm opacity-50 text-base-content">
          No recent post
        </p>
      </div>
    );
  };

  return (
    <SectionCard
      icon={<PiNewspaper />}
      title="My Articles"
      subtitle="Recent posts"
      accent="info"
      loading={loading}
      wide
    >
      <div className="grid grid-cols-1 gap-6">
        {loading || !articles ? renderSkeleton() : renderArticles()}
      </div>
    </SectionCard>
  );
};

export default BlogCard;
