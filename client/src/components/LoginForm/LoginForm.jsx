import { useCallback } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useField } from "../../hooks";
import { loginThunk } from "../../models/auth";

export const LoginForm = () => {
	const error = useSelector((state) => state.auth.loginError);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [login, setLogin, resetLogin] = useField("");
	const onSubmit = useCallback(
		async (evt) => {
			evt.preventDefault();
			const isLogin = await dispatch(loginThunk(login));
			resetLogin();
			if (isLogin) {
				navigate("/");
			}
		},
		[login, dispatch, resetLogin, navigate]
	);
	return (
		<Form onSubmit={onSubmit}>
			{error && (
				<Alert variant="danger">
					<Alert.Heading>Ошибка входа</Alert.Heading>
					{error}
				</Alert>
			)}
			<Form.Group>
				<Form.Label>Логин</Form.Label>
				<Form.Control value={login} onChange={setLogin} placeholder="Логин" />
			</Form.Group>
			<Button type="submit">Вход</Button>
		</Form>
	);
};
