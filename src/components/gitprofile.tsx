import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { formatDistance } from 'date-fns';
import {
  CustomError,
  GENERIC_ERROR,
  INVALID_CONFIG_ERROR,
  INVALID_GITHUB_USERNAME_ERROR,
  setTooManyRequestError,
} from '../constants/errors';
import '../assets/index.css';
import { getInitialTheme, getSanitizedConfig, setupHotjar } from '../utils';
import { SanitizedConfig } from '../interfaces/sanitized-config';
import ErrorPage from './error-page';
import ThemeChanger from './theme-changer';
import { BG_COLOR } from '../constants';
import AvatarCard from './avatar-card';
import { Profile } from '../interfaces/profile';
import DetailsCard from './details-card';
import SkillCard from './skill-card';
import ExperienceCard from './experience-card';
import EducationCard from './education-card';
import CertificationCard from './certification-card';
import { GithubProject } from '../interfaces/github-project';
import GithubProjectCard from './github-project-card';
import ExternalProjectCard from './external-project-card';
import BlogCard from './blog-card';
import Footer from './footer';
import PublicationCard from './publication-card';

/**
 * Formats the GitHub rate limit reset time for display.
 *
 * The `x-ratelimit-reset` header is not always readable (it requires
 * `Access-Control-Expose-Headers` cross-origin, and is absent on non-rate-limit
 * responses), so this returns null rather than throwing when it is unusable.
 *
 * @param {AxiosError} error - the axios error carrying the response headers
 * @return {string | null} humanized reset time, or null when unavailable
 */
const formatRateLimitReset = (error: AxiosError): string | null => {
  const rawReset = error.response?.headers?.['x-ratelimit-reset'];

  if (rawReset === undefined || rawReset === null || rawReset === '') {
    return null;
  }

  const resetTimestamp = Number(rawReset);

  if (!Number.isFinite(resetTimestamp)) {
    return null;
  }

  try {
    return formatDistance(new Date(resetTimestamp * 1000), new Date(), {
      addSuffix: true,
    });
  } catch {
    return null;
  }
};

/**
 * Renders the profile once the config is known to be valid.
 *
 * Receiving an already-sanitized config means every read below is safe, so the
 * hooks here never have to defend against a missing config.
 *
 * @param {Object} sanitizedConfig - the validated configuration object
 * @return {JSX.Element} the rendered profile
 */
const GitProfileContent = ({
  sanitizedConfig,
}: {
  sanitizedConfig: SanitizedConfig;
}) => {
  const [theme, setTheme] = useState<string>(() =>
    getInitialTheme(sanitizedConfig.themeConfig),
  );
  const [error, setError] = useState<CustomError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [githubProjects, setGithubProjects] = useState<GithubProject[]>([]);

  const getGithubProjects = useCallback(
    async (publicRepoCount: number): Promise<GithubProject[]> => {
      if (sanitizedConfig.projects.github.mode === 'automatic') {
        if (publicRepoCount === 0) {
          return [];
        }

        const excludeRepo =
          sanitizedConfig.projects.github.automatic.exclude.projects
            .map((project) => `+-repo:${project}`)
            .join('');

        const query = `user:${sanitizedConfig.github.username}+fork:${!sanitizedConfig.projects.github.automatic.exclude.forks}${excludeRepo}`;
        const url = `https://api.github.com/search/repositories?q=${query}&sort=${sanitizedConfig.projects.github.automatic.sortBy}&per_page=${sanitizedConfig.projects.github.automatic.limit}&type=Repositories`;

        const repoResponse = await axios.get(url, {
          headers: { 'Content-Type': 'application/vnd.github.v3+json' },
        });
        const repoData = repoResponse.data;

        return repoData.items;
      } else {
        if (sanitizedConfig.projects.github.manual.projects.length === 0) {
          return [];
        }
        const repos = sanitizedConfig.projects.github.manual.projects
          .map((project) => `+repo:${project}`)
          .join('');

        const url = `https://api.github.com/search/repositories?q=${repos}+fork:true&type=Repositories`;

        const repoResponse = await axios.get(url, {
          headers: { 'Content-Type': 'application/vnd.github.v3+json' },
        });
        const repoData = repoResponse.data;

        return repoData.items;
      }
    },
    [
      sanitizedConfig.github.username,
      sanitizedConfig.projects.github.mode,
      sanitizedConfig.projects.github.manual.projects,
      sanitizedConfig.projects.github.automatic.sortBy,
      sanitizedConfig.projects.github.automatic.limit,
      sanitizedConfig.projects.github.automatic.exclude.forks,
      sanitizedConfig.projects.github.automatic.exclude.projects,
    ],
  );

  const handleError = useCallback((error: AxiosError | Error): void => {
    console.error('Error:', error);

    if (!(error instanceof AxiosError)) {
      setError(GENERIC_ERROR);
      return;
    }

    switch (error.response?.status) {
      case 403:
        setError(setTooManyRequestError(formatRateLimitReset(error)));
        break;
      case 404:
        setError(INVALID_GITHUB_USERNAME_ERROR);
        break;
      default:
        setError(GENERIC_ERROR);
        break;
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://api.github.com/users/${sanitizedConfig.github.username}`,
      );
      const data = response.data;

      setProfile({
        avatar: data.avatar_url,
        name: data.name || ' ',
        bio: data.bio || '',
        location: data.location || '',
        company: data.company || '',
      });

      if (!sanitizedConfig.projects.github.display) {
        return;
      }

      setGithubProjects(await getGithubProjects(data.public_repos));
    } catch (error) {
      handleError(error as AxiosError | Error);
    } finally {
      setLoading(false);
    }
  }, [
    sanitizedConfig.github.username,
    sanitizedConfig.projects.github.display,
    getGithubProjects,
    handleError,
  ]);

  useEffect(() => {
    setupHotjar(sanitizedConfig.hotjar);
    // loadData is an async fetch that sets state. Satisfying set-state-in-effect
    // here means moving data fetching out of the effect entirely (a data library
    // or `use()`), which is a separate change from deriving theme/error above.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, [sanitizedConfig, loadData]);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <div className="fade-in min-h-screen">
      {error ? (
        <ErrorPage
          status={error.status}
          title={error.title}
          subTitle={error.subTitle}
        />
      ) : (
        <>
          <div
            className={`relative overflow-hidden p-4 lg:p-10 min-h-screen ${BG_COLOR}`}
          >
            {/* Ambient glows give the flat background gradient some depth.
                Kept at /10 so they stay subtle across all themes. */}
            <div className="pointer-events-none absolute -top-40 -left-32 w-[32rem] h-[32rem] rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-48 -right-32 w-[32rem] h-[32rem] rounded-full bg-secondary/10 blur-3xl" />
            <div className="relative max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 rounded-box">
              <div className="col-span-1">
                <div className="grid grid-cols-1 gap-6">
                  {!sanitizedConfig.themeConfig.disableSwitch && (
                    <div className="fade-in-up stagger-1">
                      <ThemeChanger
                        theme={theme}
                        setTheme={setTheme}
                        loading={loading}
                        themeConfig={sanitizedConfig.themeConfig}
                      />
                    </div>
                  )}
                  <div className="fade-in-up stagger-2">
                    <AvatarCard
                      profile={profile}
                      loading={loading}
                      avatarRing={sanitizedConfig.themeConfig.displayAvatarRing}
                      resumeFileUrl={sanitizedConfig.resume.fileUrl}
                    />
                  </div>
                  <div className="fade-in-up stagger-3">
                    <DetailsCard
                      profile={profile}
                      loading={loading}
                      github={sanitizedConfig.github}
                      social={sanitizedConfig.social}
                    />
                  </div>
                  {sanitizedConfig.skills.length !== 0 && (
                    <div className="fade-in-up stagger-4">
                      <SkillCard
                        loading={loading}
                        skills={sanitizedConfig.skills}
                      />
                    </div>
                  )}
                  {sanitizedConfig.experiences.length !== 0 && (
                    <div className="fade-in-up stagger-5">
                      <ExperienceCard
                        loading={loading}
                        experiences={sanitizedConfig.experiences}
                      />
                    </div>
                  )}
                  {sanitizedConfig.certifications.length !== 0 && (
                    <div className="fade-in-up stagger-6">
                      <CertificationCard
                        loading={loading}
                        certifications={sanitizedConfig.certifications}
                      />
                    </div>
                  )}
                  {sanitizedConfig.educations.length !== 0 && (
                    <div className="fade-in-up stagger-7">
                      <EducationCard
                        loading={loading}
                        educations={sanitizedConfig.educations}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-2 col-span-1">
                <div className="grid grid-cols-1 gap-6">
                  {sanitizedConfig.projects.github.display && (
                    <div className="fade-in-up stagger-1">
                      <GithubProjectCard
                        header={sanitizedConfig.projects.github.header}
                        limit={sanitizedConfig.projects.github.automatic.limit}
                        githubProjects={githubProjects}
                        loading={loading}
                        googleAnalyticsId={sanitizedConfig.googleAnalytics.id}
                      />
                    </div>
                  )}
                  {sanitizedConfig.publications.length !== 0 && (
                    <div className="fade-in-up stagger-2">
                      <PublicationCard
                        loading={loading}
                        publications={sanitizedConfig.publications}
                      />
                    </div>
                  )}
                  {sanitizedConfig.projects.external.projects.length !== 0 && (
                    <div className="fade-in-up stagger-3">
                      <ExternalProjectCard
                        loading={loading}
                        header={sanitizedConfig.projects.external.header}
                        externalProjects={
                          sanitizedConfig.projects.external.projects
                        }
                        googleAnalyticId={sanitizedConfig.googleAnalytics.id}
                      />
                    </div>
                  )}
                  {sanitizedConfig.blog.display && (
                    <div className="fade-in-up stagger-4">
                      <BlogCard
                        loading={loading}
                        googleAnalyticsId={sanitizedConfig.googleAnalytics.id}
                        blog={sanitizedConfig.blog}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {sanitizedConfig.footer && (
            <footer
              className={`p-4 footer ${BG_COLOR} text-base-content footer-center`}
            >
              <div className="bg-base-100/60 backdrop-blur rounded-full px-6 py-2 shadow-sm">
                <Footer content={sanitizedConfig.footer} loading={loading} />
              </div>
            </footer>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Narrows a sanitized config to its populated form.
 *
 * `getSanitizedConfig` returns an empty object when the supplied config is
 * unusable, which is the only signal that validation failed.
 *
 * @param {Object} config - the result of getSanitizedConfig
 * @return {boolean} whether the config is populated
 */
const isValidConfig = (
  config: SanitizedConfig | Record<string, never>,
): config is SanitizedConfig => Object.keys(config).length !== 0;

/**
 * Renders the GitProfile component.
 *
 * Validation happens here so that an invalid config short-circuits to the error
 * page before any hook that assumes a populated config is ever created.
 *
 * @param {Object} config - the configuration object
 * @return {JSX.Element} the rendered GitProfile component
 */
const GitProfile = ({ config }: { config: Config }) => {
  const [sanitizedConfig] = useState<SanitizedConfig | Record<string, never>>(
    getSanitizedConfig(config),
  );

  if (!isValidConfig(sanitizedConfig)) {
    return (
      <ErrorPage
        status={INVALID_CONFIG_ERROR.status}
        title={INVALID_CONFIG_ERROR.title}
        subTitle={INVALID_CONFIG_ERROR.subTitle}
      />
    );
  }

  return <GitProfileContent sanitizedConfig={sanitizedConfig} />;
};

export default GitProfile;
