import Home from '@client/components/features/user/Home';
import { useHomePageHook } from '@client/hooks/PageHooks/user/HomePage/useHomePageHook';
import HomeLayout from '@client/layouts/HomeLayout';

function HomePage() {
  useHomePageHook();

  return (
    <HomeLayout>
      <Home />
    </HomeLayout>
  );
}

export default HomePage;
