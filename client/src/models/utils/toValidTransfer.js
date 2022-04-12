import { toEth } from "../../utils";

export const toValidTransfer = (transfer) => {
	return {
		id: transfer.id,
		sender: transfer.sender,
		receiver: transfer.receiver,
		value: transfer.money,
		sendAt: +transfer.timeSend,
		liveTime: +transfer.liveTime,
		isFinish: transfer.isFinish,
	};
};
