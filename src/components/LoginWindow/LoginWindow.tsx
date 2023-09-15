import { SetStateAction, Dispatch, useRef, LegacyRef } from 'react';
import { setDefaultStoreSettings } from '@/context/settings/setSettingsFunctions';
import { IUserCredentials } from '@/types/userCredentials';
import axios, { AxiosResponse } from 'axios';
import { Formik } from 'formik';
import { object, string } from 'yup';
import fs from 'fs/promises';

interface Props {
	setShouldShowLoginWindow: Dispatch<SetStateAction<boolean>>;
}

const UserCredentialsValidateSchema = object({
	login: string()
		.required('Логин обязательный!')
		.min(8, 'Логин должен быть не короче 8 символов'),
	password: string()
		.required('Пароль обязательный!')
		.min(8, 'Пароль должен быть не короче 8 символов'),
});

export default function LoginWindow({ setShouldShowLoginWindow }: Props) {
	const windowTitleRef = useRef<HTMLParagraphElement>();

	const sendUserCredentialsToServer = async (
		userCredentials: IUserCredentials
	) => {
		const res = await axios.post(
			import.meta.env.VITE_MEDIATOR_BASE_URL + 'accounts/login',
			userCredentials
		);

		handleResponse(res);
	};

	const handleResponse = (res: AxiosResponse<any, any>) => {
		if (!res.data.appId) return showError();
		storeAppId(res.data.appId);
	};

	const showError = () => {
		if (windowTitleRef.current) {
			windowTitleRef.current.innerText =
				'Пользователь с этими данными не найден!';

			windowTitleRef.current.style.color = '#7B3F00';
		}
	};

	const storeAppId = async (appId: string) => {
		const newFileData = { appId };
		await fs.writeFile('./appId.json', JSON.stringify(newFileData));

		setShouldShowLoginWindow(false);
	};

	return (
		<div className="absolute z-[30] bg-black/60 w-screen h-screen flex flex-col justify-center items-center">
			<div className="w-4/5 h-4/5 bg-[--pink-loader-color] rounded-lg px-12 flex flex-col justify-center gap-6 dark:bg-[--blue-loader-color]">
				<p
					className="text-2xl text-center font-semibold"
					ref={windowTitleRef as LegacyRef<HTMLParagraphElement>}>
					Логин в LessonKeeperID
				</p>
				<Formik
					initialValues={{
						login: '',
						password: '',
					}}
					validationSchema={UserCredentialsValidateSchema}
					onSubmit={(values, { setSubmitting }) => {
						setTimeout(async () => {
							await sendUserCredentialsToServer(values);
							await setDefaultStoreSettings();
							setSubmitting(false);
						}, 400);
					}}>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
					}) => (
						<form className="flex flex-col" onSubmit={handleSubmit}>
							<div className="mb-4">
								<label htmlFor="login" className="text-xl font-bold">
									Логин
								</label>
								<input
									className="w-full text-black border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
									type="text"
									name="login"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.login}
								/>
								{errors.login && touched.login && errors.login}
							</div>
							<div className="mb-4">
								<label htmlFor="password" className="text-xl font-bold">
									Пароль
								</label>
								<input
									className="w-full text-black border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
									type="text"
									name="password"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.password}
								/>
								{errors.password && touched.password && errors.password}
							</div>
							<div className="flex flex-row justify-center">
								<button
									type="submit"
									disabled={isSubmitting}
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none dark:bg-orange-500 dark:hover:bg-orange-700">
									Подтвердить
								</button>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</div>
	);
}
