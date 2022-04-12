export const toValidMail = (mail) => {
	return {
		id: mail.id,
		track: mail.trackNumber,
		sender: mail.sender,
		receiver: mail.receiver,
		senderAddress: mail.senderAddress,
		receiverAddress: mail.receiverAddress,
		packageType: +mail.typePackage,
		packageClass: +mail.packageClass,
		weight: mail.weight,
		deliveryPrice: mail.deliveryPrice,
		valuePackage: +mail.valuePackage,
		deliveryTime: +mail.deliveryTime,
		allPrice: mail.allPrice,
		status: +mail.status,
	};
};
