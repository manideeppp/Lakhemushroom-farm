import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface CartAddedState {
  cartAdded?: boolean;
  itemName?: string;
}

/** Show add-to-cart bar when navigated from home after adding an item. */
export function useCartAddedFromNavigation(
  announceRecentAdd: (name: string) => void
) {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as CartAddedState | null;
    if (state?.cartAdded && state.itemName) {
      announceRecentAdd(state.itemName);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, announceRecentAdd]);
}
