import type { NextPage } from 'next';

const Home: NextPage = () => {
	return (
		<>
			<div className="flex flex-col items-center">
				<h1 className="text-gray-700 text-5xl font-extrabold leading-normal md:text-[5rem]">Hi this is an interface</h1>
				<p className="text-gray-700 text-2xl">This tech includes</p>
				<ul className="mt-3 grid gap-3 pt-3 text-center lg:w-2/3 md:grid-cols-3">
					<li>1</li>
					<li>2</li>
					<li>3</li>
					<li>4</li>
					<li>5</li>
					<li>6</li>
				</ul>
			</div>
		</>
	);
};

export default Home;
