import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '@bookory-frontend/header';
import { SearchInput } from '@bookory-frontend/search-input';
import { Navbar } from '@bookory-frontend/navbar';

/**
 * Layout – delad layout-komponent för inloggade sidor.
 * Renderar sökfält högst upp, sidsidan i mitten (via Outlet) och navigationsbar längst ned.
 */
export function Layout() {
	const navigate = useNavigate();

	return (
		<>
			<Header />
			<SearchInput onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
			<main>
				<Outlet />
			</main>
			<Navbar />
		</>
	);
}