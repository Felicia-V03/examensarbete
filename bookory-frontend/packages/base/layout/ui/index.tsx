import { Outlet, useNavigate } from 'react-router-dom';
import { SearchInput } from '@bookory-frontend/search-input';
import { Navbar } from '@bookory-frontend/navbar';

export function Layout() {
	const navigate = useNavigate();

	return (
		<>
			<SearchInput onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
			<main>
				<Outlet />
			</main>
			<Navbar />
		</>
	);
}