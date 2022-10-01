import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { LoadVM } from '@/components/LoadVM';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
	const router = useRouter();
	const [state, setState] = useState(false);
	useEffect(() => {
		if (!router.isReady) return;
		setState(true);
	}, [router.isReady]);
	return (
		<>
			<div className="flex flex-col items-center">
				<h1 className="text-gray-700 text-5xl font-extrabold leading-normal md:text-[5rem]">Cosmwasm interface</h1>
				{state && <LoadVM />}
			</div>
		</>
	);
};

export default Home;
