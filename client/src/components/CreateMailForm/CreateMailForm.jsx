import { useCallback } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { sendMailThunk } from "../../models/mails";
import { useField } from "../../hooks";
import {
	PACKAGE_CLASS,
	PACKAGE_CLASS_NAME,
	PACKAGE_TYPE,
	PACKAGE_TYPE_NAME,
	PRECISION,
} from "../../consts";

const deliveryTime = {
	[PACKAGE_CLASS.FIRST]: 10,
	[PACKAGE_CLASS.SECOND]: 15,
	[PACKAGE_CLASS.THIRD]: 20,
};
const deliveryPrice = {
	[PACKAGE_CLASS.FIRST]: 0.5,
	[PACKAGE_CLASS.SECOND]: 0.3,
	[PACKAGE_CLASS.THIRD]: 0.1,
};

const calculateAllPrice = (deliveryPrice, weight, valuePackage) => {
	return (deliveryPrice * weight + valuePackage * 0.2).toFixed(PRECISION);
};
export const CreateMailForm = () => {
	const dispatch = useDispatch();
	const [sender, setSender, resetSender] = useField("");
	const [receiver, setReceiver, resetReceiver] = useField("");
	const [typePackage, setTypePackage, resetTypePackage] = useField(0);
	const [packageClass, setPackageClass, resetPackageClass] = useField(2);
	const [weight, setWeight, resetWeight] = useField(0);
	const [valuePackage, setValuePackage, resetValuePackage] = useField(0);
	const allPrice = calculateAllPrice(
		deliveryPrice[packageClass],
		weight,
		valuePackage
	);
	const onSubmit = useCallback(
		async (evt) => {
			evt.preventDefault();
			await dispatch(
				sendMailThunk({
					sender,
					receiver,
					typePackage,
					packageClass,
					weight,
					valuePackage,
					allPrice: allPrice,
					deliveryPrice: deliveryPrice[packageClass],
					deliveryTime: deliveryTime[packageClass],
				})
			);
			resetPackageClass();
			resetReceiver();
			resetSender();
			resetTypePackage();
			resetValuePackage();
			resetWeight();
		},
		[
			dispatch,
			sender,
			receiver,
			typePackage,
			packageClass,
			weight,
			valuePackage,
			allPrice,
		]
	);
	const allRequiredFieldFill = !!sender && !!receiver && !!weight;
	const disabledButton = !allRequiredFieldFill;
	return (
		<Form onSubmit={onSubmit}>
			<Row>
				<Col>
					<Form.Group>
						<Form.Label>Отправитель</Form.Label>
						<Form.Control
							value={sender}
							onChange={setSender}
							placeholder="Отправитель"
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Тип отправления</Form.Label>
						<Form.Select value={typePackage} onChange={setTypePackage}>
							{Object.values(PACKAGE_TYPE).map((code) => (
								<option value={code} key={code}>
									{PACKAGE_TYPE_NAME[code]}
								</option>
							))}
						</Form.Select>
					</Form.Group>
					<Form.Group>
						<Form.Label>Вес</Form.Label>
						<Form.Control
							value={weight}
							onChange={setWeight}
							placeholder="Вес"
							min={0}
							max={10}
							step={0.1}
							type="number"
						/>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Получатель</Form.Label>
						<Form.Control
							value={receiver}
							onChange={setReceiver}
							placeholder="Получатель"
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Класс отправления</Form.Label>
						<Form.Select value={packageClass} onChange={setPackageClass}>
							{Object.values(PACKAGE_CLASS).map((code) => (
								<option value={code} key={code}>
									{PACKAGE_CLASS_NAME[code]}
								</option>
							))}
						</Form.Select>
					</Form.Group>
					<Form.Group>
						<Form.Label>Объявленная ценность</Form.Label>
						<Form.Control
							value={valuePackage}
							onChange={setValuePackage}
							placeholder="Объявленная стоимость"
							min={0}
							step={0.1}
							type="number"
						/>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form.Group>
						<Form.Label>Стоимость доставки(за кг груза)</Form.Label>
						<Form.Control value={deliveryPrice[packageClass]} readOnly={true} />
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Время доставки</Form.Label>
						<Form.Control value={deliveryTime[packageClass]} readOnly={true} />
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Итоговая стоимость</Form.Label>
						<Form.Control
							value={calculateAllPrice(
								deliveryPrice[packageClass],
								weight,
								valuePackage
							)}
							readOnly={true}
						/>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					<Button disabled={disabledButton} type="submit">
						Отправить
					</Button>
				</Col>
			</Row>
		</Form>
	);
};
