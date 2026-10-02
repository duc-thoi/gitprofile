import { FiDownload } from 'react-icons/fi';
import { FALLBACK_IMAGE } from '../../constants';
import { Profile } from '../../interfaces/profile';
import { skeleton } from '../../utils';
import LazyImage from '../lazy-image';

interface AvatarCardProps {
  profile: Profile | null;
  loading: boolean;
  avatarRing: boolean;
  resumeFileUrl?: string;
}

/**
 * Renders an AvatarCard component.
 * @param profile - The profile object.
 * @param loading - A boolean indicating if the profile is loading.
 * @param avatarRing - A boolean indicating if the avatar should have a ring.
 * @param resumeFileUrl - The URL of the resume file.
 * @returns JSX element representing the AvatarCard.
 */
const AvatarCard: React.FC<AvatarCardProps> = ({
  profile,
  loading,
  avatarRing,
  resumeFileUrl,
}): React.JSX.Element => {
  return (
    <div className="card shadow-lg card-sm bg-base-100 overflow-hidden">
      {/* Gradient band standing in for a cover photo, so the avatar has
          something to sit against. */}
      <div className="h-20 bg-linear-to-r from-primary/25 via-secondary/20 to-accent/25" />
      <div className="grid place-items-center px-6 pb-8">
        <div className="relative -mt-14 mb-6">
          {loading || !profile ? (
            <div className="avatar">
              <div className="rounded-full w-32 h-32 shadow-lg ring-1 ring-base-100">
                {skeleton({
                  widthCls: 'w-full',
                  heightCls: 'h-full',
                  shape: '',
                })}
              </div>
            </div>
          ) : (
            <div
              className={`rounded-full shadow-lg ring-1 ring-base-100 ${
                avatarRing
                  ? 'p-1 bg-linear-to-tr from-primary via-secondary to-accent'
                  : ''
              }`}
            >
              <div className="avatar">
                <div
                  className={`rounded-full w-32 h-32 ${
                    avatarRing ? 'bg-base-100 p-1' : ''
                  }`}
                >
                  {
                    <LazyImage
                      src={profile.avatar ? profile.avatar : FALLBACK_IMAGE}
                      alt={profile.name}
                      placeholder={skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-full',
                        shape: '',
                      })}
                    />
                  }
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="text-center mx-auto px-4">
          <h5 className="font-display text-2xl font-extrabold tracking-tight">
            {loading || !profile ? (
              skeleton({
                widthCls: 'w-48',
                heightCls: 'h-8',
                className: 'mx-auto',
              })
            ) : (
              <span className="text-base-content">{profile.name}</span>
            )}
          </h5>
          <div className="mt-3 max-w-[22rem] mx-auto font-mono text-sm leading-relaxed text-base-content/70">
            {loading || !profile
              ? skeleton({
                  widthCls: 'w-48',
                  heightCls: 'h-5',
                  className: 'mx-auto',
                })
              : profile.bio}
          </div>
        </div>
        {resumeFileUrl &&
          (loading ? (
            <div className="mt-6">
              {skeleton({ widthCls: 'w-40', heightCls: 'h-8' })}
            </div>
          ) : (
            <a
              href={resumeFileUrl}
              target="_blank"
              className="btn btn-primary btn-sm rounded-full px-5 gap-2 shadow-md hover:shadow-lg mt-6 whitespace-nowrap"
              download
              rel="noreferrer"
            >
              <FiDownload />
              Download Resume
            </a>
          ))}
      </div>
    </div>
  );
};

export default AvatarCard;
