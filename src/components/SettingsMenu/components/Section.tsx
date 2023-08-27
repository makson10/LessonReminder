import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
	partTitle: string;
}

export default function Section({ children, partTitle }: Props) {
	return (
		<div className="flex flex-col gap-4 items-center">
			<p className="text-xl font-bold">{partTitle}</p>
			{children}
		</div>
	);
}
