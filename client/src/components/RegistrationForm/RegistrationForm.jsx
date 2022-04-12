import { useCallback } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useField } from "../../hooks";
import { registrationThunk } from "../../models/auth";

export const RegistrationForm = () => {
	const error = useSelector((state) => state.auth.registrationError);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [login, setLogin, resetLogin] = useField("");
	const [address, setAddress, resetAddress] = useField("");
	const [fio, setFio, resetFio] = useField("");
	const onSubmit = useCallback(
		async (evt) => {
			evt.preventDefault();
			const isRegistration = await dispatch(
				registrationThunk(login, address, fio)
			);
			resetLogin();
			resetAddress();
			resetFio();

			if (isRegistration) {
				navigate("/login");
			}
		},
		[
			login,
			resetLogin,
			dispatch,
			address,
			fio,
			resetFio,
			resetAddress,
			navigate,
		]
	);
	return (
		<Form onSubmit={onSubmit}>
			{error && (
				<Alert variant="danger">
					<Alert.Heading>Ошибка регистрации</Alert.Heading>
					{error}
				</Alert>
			)}
			<Form.Group>
				<Form.Label>Адрес аккаунта</Form.Label>
				<Form.Control value={login} onChange={setLogin} placeholder="Адрес" />
			</Form.Group>
			<Form.Group>
				<Form.Label>Домашний адрес</Form.Label>
				<Form.Control
					value={address}
					onChange={setAddress}
					placeholder="Домашний адрес"
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Фио</Form.Label>
				<Form.Control value={fio} onChange={setFio} placeholder="Фио" />
			</Form.Group>
			<Button type="submit">Зарегистрироваться</Button>
		</Form>
	);
};
