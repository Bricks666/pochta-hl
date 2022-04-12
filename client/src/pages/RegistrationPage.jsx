import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RegistrationForm } from "../components/RegistrationForm";

export const RegistrationPage = () => {
	return (
		<main>
			<Container>
				<h2>Регистрация</h2>
				<RegistrationForm />
				<Link to="/login">Вход</Link>
			</Container>
		</main>
	);
};
