import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { toggleSetting } from '@/context/settings/slice';
import { SettingsInitialValue } from '../../../types/settingsTypes';

interface Props {
	title: string;
	checked: boolean;
	settingName: keyof SettingsInitialValue;
	disabled?: boolean;
}

export default function Field({
	title,
	checked,
	settingName,
	disabled = false,
}: Props) {
	const dispatch = useDispatch();

	return (
		<div className="w-full flex flex-row gap-2 justify-between">
			<p className={disabled ? 'text-gray-500' : ''}> {title}</p>
			<input
				type="checkbox"
				defaultChecked={checked}
				disabled={disabled}
				onClick={() => dispatch(toggleSetting(settingName))}
			/>
		</div>
	);
}
