import { Img } from '@/components/common/Img';
import { SVGComposableLight } from '@/svg';

export const Footer = () => {
	return (
		<footer className="mx-auto h-full w-full">
			<div className="mx-auto flex h-full w-full items-center justify-between px-10 py-[33.5px] lg:w-lg lg:px-[6px]">
				<SVGComposableLight />
				<section className="flex items-center gap-8">
					<SocialIcon link="https://twitter.com/ComposableFin" src={'/icons/layout/Twitter.svg'} />
					<SocialIcon link="https://github.com/ComposableFi/" src={'/icons/layout/Github.svg'} />
					<SocialIcon link="https://t.me/composablefinance" src={'/icons/layout/Telegram.svg'} />
					<SocialIcon link="https://discord.com/invite/composable" src={'/icons/layout/Discord.svg'} />
				</section>
			</div>
		</footer>
	);
};

const SocialIcon = ({ link, src }: { link: string; src: string }) => {
	return (
		<a
			className="opacity-80 transition-opacity duration-200 hover:opacity-100"
			target="_blank"
			rel="noopener noreferrer"
			href={link}>
			<Img className="h-6 w-6" src={src} />
		</a>
	);
};
