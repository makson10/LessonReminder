import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Field from '../components/Field';
import Section from '../components/Section';
import { RootState } from '@/context/settings/store';
import { setConcrateValueToSetting } from '@/context/settings/slice';

export default function MainSettingsSection() {
	const settings = useSelector((state: RootState) => state.settings);
	const dispatch = useDispatch();

	useEffect(() => {
		if (
			settings.sendTelegramMessage &&
			(!settings.leaveNotificationOpen || settings.disableNotifications)
		) {
			dispatch(
				setConcrateValueToSetting({ name: 'sendTelegramMessage', value: false })
			);
		}
	}, [settings.leaveNotificationOpen, settings.disableNotifications]);

	return (
		<Section partTitle="Настройки">
			<div className="flex flex-col gap-2">
				<Field title="Запускать с Windows" settingName="startWithWindows" />
				<Field
					title="Отключить уведомления"
					settingName="disableNotifications"
				/>
				<Field
					title="Показывать второе уведомление"
					settingName="showSecondNotification"
					disabled={settings.disableNotifications}
				/>
				<Field
					title="Оставлять уведомление открытым"
					settingName="leaveNotificationOpen"
					disabled={settings.disableNotifications}
				/>
				<Field
					title="Отправлять дополнительно сообщение"
					settingName="sendTelegramMessage"
					disabled={
						settings.disableNotifications || !settings.leaveNotificationOpen
					}
				/>
			</div>
		</Section>
	);
}
