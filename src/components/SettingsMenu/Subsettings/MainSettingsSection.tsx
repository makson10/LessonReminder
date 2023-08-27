import { useSelector } from 'react-redux';
import { RootState } from '@/context/settings/store';
import Field from '../components/Field';
import Section from '../components/Section';

export default function MainSettingsSection() {
	const settings = useSelector((state: RootState) => state.settings);

	return (
		<Section partTitle="Настройки">
			<div className="flex flex-col gap-2">
				<Field
					title="Запускать с Windows"
					checked={settings.startWithWindows}
					settingName="startWithWindows"
				/>
				<Field
					title="Отключить уведомления"
					checked={settings.disableNotifications}
					settingName="disableNotifications"
				/>
				<Field
					title="Показывать второе уведомление"
					checked={settings.showSecondNotification}
					settingName="showSecondNotification"
					disabled={settings.disableNotifications}
				/>
				<Field
					title="Оставлять уведомление открытым"
					checked={settings.leaveNotificationOpen}
					settingName="leaveNotificationOpen"
					disabled={settings.disableNotifications}
				/>
			</div>
		</Section>
	);
}
