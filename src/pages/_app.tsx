import '@/styles/globals.scss';
import type { AppType } from 'next/dist/shared/lib/utils';
import 'react-toastify/dist/ReactToastify.css';
import { AppLayout } from '@/layout/AppLayout';

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<AppLayout>
			<Component {...pageProps} />
		</AppLayout>
	);
};

export default MyApp;
