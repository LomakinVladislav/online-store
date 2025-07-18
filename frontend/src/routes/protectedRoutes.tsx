import { Navigate, Outlet, Route } from 'react-router-dom';
import LayoutComponent from '../components/Layout/Layout';
import DeckContent from '../components/DeckContent/DeckContent';
import Main from '../pages/Main/Main';
import ExpiredSession from '../components/ExpiredSession/ExpiredSession';
import DeckCreation from '../pages/DeckCreation/DeckCreation';
import DeckEditing from '../pages/DeckEditing/DeckEditing';
import Favorites from '../pages/Favorites/Favorites';
import MyDecks from '../pages/MyDecks/MyDecks';
import Settings from '../pages/Settings/Settings';
import SearchResults from '../pages/SearchResults/SearchResults';

export const renderProtectedRoutes = ({ isDarkMode, toggleTheme }: { 
  isDarkMode: boolean; 
  toggleTheme: () => void 
}) => [
  <Route 
    key="layout"
    element={
      <LayoutComponent isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <Outlet />
      </LayoutComponent>
    }
  >
    <Route key="main" path="/main" element={<Main />} />
    <Route key="deck-content" path="/decks/:deckId/content" element={<DeckContent />} />
    <Route key="expired" path="/expired_session" element={<ExpiredSession />} />
    <Route key="creation" path="/deck_creation" element={<DeckCreation />} />
    <Route key="editing" path="/decks/:deckId/deck_editing" element={<DeckEditing />} />
    <Route key="favorites" path="/favorites" element={<Favorites />} />
    <Route key="my-decks" path="/my_decks" element={<MyDecks />} />
    <Route key="settings" path="/settings" element={<Settings />} />
    <Route key="search" path="/search" element={<SearchResults />} />
    <Route key="default" path="*" element={<Navigate to="/main" />} />
  </Route>
];