import { AppRoutes } from './routes/AppRoutes';
import { ScrollToTop } from './components/navigation/ScrollToTop';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}
