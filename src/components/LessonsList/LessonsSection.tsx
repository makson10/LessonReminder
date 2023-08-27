import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default function LessonSection({ children }: Props) {
	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex flex-col gap-[20px] p-8 h-screen bg-[--pink-main-color] dark:bg-[--blue-main-color]">
				{children}
			</div>
		</div>
	);
}
