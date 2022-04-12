import { Button, Container, ListGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUser } from "../../hooks";
import { UserInfo } from "../UserInfo";

export const ProfileInfo = () => {
	const { info, isLoading } = useUser();
	return (
		<Container>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<h3>{info.address}</h3>
					<UserInfo {...info}>
						<ListGroup.Item as="dt">Баланс</ListGroup.Item>
						<ListGroup.Item as="dd">{info.balance} Coins</ListGroup.Item>
					</UserInfo>
					<Button as={Link} to="change">
						Изменить профиль
					</Button>
				</>
			)}
		</Container>
	);
};
