import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next/router (for Pages router compatibility if ever needed)
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock window.scrollTo
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
}

// Mock framer-motion to skip animations in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    __esModule: true,
    ...actual,
    motion: {
      div: 'div',
      main: 'main',
      h1: 'h1',
      p: 'p',
    },
    useScroll: () => ({ scrollY: { get: () => 0 } }),
    useTransform: () => ({ get: () => 0 }),
  };
});
