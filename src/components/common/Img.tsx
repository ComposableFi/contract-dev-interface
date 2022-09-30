import CoolImg from 'react-cool-img';

const retrySettings = { count: 0 };
export function Img({
	src,
	style = {},
	className = '',
	onClick,
	placeholder,
	error,
	alt = 'img',
}: {
	src: string;
	style?: Record<string, string>;
	className?: string;
	onClick?: () => void;
	placeholder?: string;
	error?: string;
	alt?: string;
}) {
	return (
		<CoolImg
			onClick={onClick}
			style={style}
			src={src}
			alt={alt}
			placeholder={placeholder || '/icons/loading-spin.svg'}
			error={error}
			className={className}
			retry={retrySettings}
		/>
	);
}
