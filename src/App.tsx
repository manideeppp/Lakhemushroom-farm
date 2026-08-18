import { AppRoutes } from './routes/AppRoutes';
import { ScrollToTop } from './components/navigation/ScrollToTop';
import { PageSeo } from './components/seo/PageSeo';

export default function App() {
  return (
    <>
      <PageSeo />
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}
