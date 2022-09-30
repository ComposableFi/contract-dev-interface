import { Header } from '@/layout/Header';
import { Footer } from '@/layout/Footer';

export const AppLayout = ({ children }: { children: JSX.Element }) => {
	return (
		<div className="bg-deep-catch grid min-h-[100vh] min-w-[100vw] grid-rows-[120px,1fr,144px]">
			<Header />
			<div className="mx-auto h-full w-full">
				<main className="mx-auto h-full w-full px-10 pb-20 lg:w-lg lg:px-0">{children}</main>
			</div>
			<Footer />
		</div>
	);
};
