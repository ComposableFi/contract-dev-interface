import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en" style={{ background: 'black' }}>
			<Head />
			<body className="bg-black">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
