import { useEffect, useRef, LegacyRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSetting } from '@/context/settings/slice';
import { ISettings } from '@/types/settingsTypes';
import { RootState } from '@/context/settings/store';

interface Props {
	title: string;
	settingName: keyof ISettings;
	disabled?: boolean;
}

export default function Field({ title, settingName, disabled = false }: Props) {
	const settings = useSelector((state: RootState) => state.settings);
	const dispatch = useDispatch();
	const inputRef = useRef<HTMLInputElement>();

	useEffect(() => {
		if (inputRef.current) inputRef.current.checked = settings[settingName];
	}, [settings[settingName]]);

	return (
		<div className="w-full flex flex-row gap-2 justify-between">
			<p className={disabled ? 'text-gray-500' : ''}> {title}</p>
			<input
				ref={inputRef as LegacyRef<HTMLInputElement>}
				type="checkbox"
				disabled={disabled}
				onClick={() => dispatch(toggleSetting(settingName))}
			/>
		</div>
	);
}
