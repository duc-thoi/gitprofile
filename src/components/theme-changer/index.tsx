import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { SanitizedThemeConfig } from '../../interfaces/sanitized-config';
import { LOCAL_STORAGE_KEY_NAME } from '../../constants';
import { skeleton } from '../../utils';
import { MouseEvent } from 'react';

/**
 * Renders a miniature preview of the selected theme with arrows and a
 * filmstrip to step through the available themes.
 *
 * @param {Object} props - The props object.
 * @param {string} props.theme - The current theme.
 * @param {function} props.setTheme - A function to set the theme.
 * @param {boolean} props.loading - Whether the component is in a loading state.
 * @param {SanitizedThemeConfig} props.themeConfig - The theme configuration object.
 * @return {JSX.Element} The rendered theme changer component.
 */
const ThemeChanger = ({
  theme,
  setTheme,
  loading,
  themeConfig,
}: {
  theme: string;
  setTheme: (theme: string) => void;
  loading: boolean;
  themeConfig: SanitizedThemeConfig;
}) => {
  const changeTheme = (
    e: MouseEvent<HTMLButtonElement>,
    selectedTheme: string,
  ) => {
    e.preventDefault();

    document.querySelector('html')?.setAttribute('data-theme', selectedTheme);

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY_NAME, selectedTheme);
    }

    setTheme(selectedTheme);
  };

  const orderedThemes = [
    themeConfig.defaultTheme,
    ...themeConfig.themes.filter((item) => item !== themeConfig.defaultTheme),
  ];

  const currentIndex = Math.max(0, orderedThemes.indexOf(theme));

  const label = (item: string) =>
    item === themeConfig.defaultTheme ? 'Default' : item;

  const themeAt = (offset: number) =>
    orderedThemes[
      (currentIndex + offset + orderedThemes.length * 2) % orderedThemes.length
    ];

  const filmstrip = [-2, -1, 0, 1, 2];

  return (
    <div>
      <div className="card card-sm shadow-lg bg-base-100 overflow-visible">
        <div className="p-3">
          <div data-theme={theme}>
            <div className="rounded-xl border border-base-300 bg-base-100 p-2.5 shadow-sm flex h-fit flex-col items-start justify-start gap-2.5">
              {loading ? (
                <>
                  <div className="flex items-center gap-2">
                    {skeleton({ widthCls: 'w-2', heightCls: 'h-2' })}
                    <div className="flex flex-col gap-1">
                      {skeleton({
                        widthCls: 'w-16',
                        heightCls: 'h-1.5',
                        shape: 'rounded',
                      })}
                      {skeleton({
                        widthCls: 'w-10',
                        heightCls: 'h-1.5',
                        shape: 'rounded',
                      })}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {skeleton({
                      widthCls: 'w-14',
                      heightCls: 'h-4',
                      className: 'rounded-full',
                    })}
                    {skeleton({
                      widthCls: 'w-12',
                      heightCls: 'h-4',
                      className: 'rounded-full',
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: 'var(--color-primary, currentColor)',
                      }}
                    />
                    <div className="flex flex-col gap-1">
                      <div
                        className="h-1.5 w-16 rounded"
                        style={{
                          background: 'var(--color-base-content, currentColor)',
                          opacity: 0.7,
                        }}
                      />
                      <div
                        className="h-1.5 w-10 rounded"
                        style={{
                          background: 'var(--color-base-content, currentColor)',
                          opacity: 0.4,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        background: 'var(--color-primary, currentColor)',
                        color:
                          'var(--color-primary-content, var(--color-base-100, #ffffff))',
                      }}
                    >
                      Primary
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        background: 'var(--color-secondary, currentColor)',
                        color:
                          'var(--color-secondary-content, var(--color-base-100, #ffffff))',
                      }}
                    >
                      Accent
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 mt-2">
            {loading ? (
              <>
                {skeleton({ widthCls: 'w-6', heightCls: 'h-6' })}
                <div className="flex-1 flex flex-col items-center gap-1">
                  {skeleton({ widthCls: 'w-16', heightCls: 'h-4' })}
                  {skeleton({ widthCls: 'w-10', heightCls: 'h-3' })}
                </div>
                {skeleton({ widthCls: 'w-6', heightCls: 'h-6' })}
              </>
            ) : (
              <>
                <button
                  type="button"
                  title="Previous theme"
                  aria-label="Previous theme"
                  onClick={(e) => changeTheme(e, themeAt(-1))}
                  className="btn btn-ghost btn-xs btn-circle text-base-content/60"
                >
                  <RiArrowLeftSLine className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0 text-center">
                  <div className="text-sm font-semibold capitalize text-base-content truncate">
                    {label(theme)}
                  </div>
                  <div className="text-[11px] text-base-content/50">
                    {currentIndex + 1} of {orderedThemes.length}
                  </div>
                </div>
                <button
                  type="button"
                  title="Next theme"
                  aria-label="Next theme"
                  onClick={(e) => changeTheme(e, themeAt(1))}
                  className="btn btn-ghost btn-xs btn-circle text-base-content/60"
                >
                  <RiArrowRightSLine className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-1 mt-2">
            {loading
              ? filmstrip.map((offset) => (
                  <div key={offset}>
                    {skeleton({
                      widthCls: 'w-6',
                      heightCls: 'h-6',
                      className: 'rounded-lg',
                    })}
                  </div>
                ))
              : filmstrip.map((offset) => {
                  const item = themeAt(offset);

                  return (
                    <button
                      key={`${offset}-${item}`}
                      type="button"
                      title={label(item)}
                      aria-label={label(item)}
                      aria-current={offset === 0}
                      onClick={(e) => changeTheme(e, item)}
                      data-theme={item}
                      className={`w-6 h-6 rounded-lg bg-base-100 overflow-hidden border ${
                        offset === 0
                          ? 'border-base-content/50'
                          : 'border-base-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span
                        className="block w-full h-full"
                        style={{
                          background:
                            'linear-gradient(135deg, var(--color-primary, currentColor) 0 50%, var(--color-accent, var(--color-secondary, currentColor)) 50% 100%)',
                        }}
                      />
                    </button>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeChanger;
