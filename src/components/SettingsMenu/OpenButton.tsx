import { Dispatch, SetStateAction } from 'react';

interface Props {
	isMenuOpen: boolean;
	setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function OpenButton({
	isMenuOpen,
	setIsMenuOpen,
}: Props) {
	const handleToggleIsMenuOpen = () => {
		setIsMenuOpen((prevValue) => !prevValue);
	};

	return (
		<button
			className={`z-[20] transition-all duration-[250ms] ${
				isMenuOpen ? 'translate-x-[-360px]' : 'translate-x-0'
			}`}
			onClick={handleToggleIsMenuOpen}>
			<img
				className="w-[32px] h-[32px]"
				src="./open-settings-menu-icon.png"
				alt="#"
			/>
		</button>
	);
}
