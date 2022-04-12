import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTransfersThunk, resetTransfersAC } from "../../models/transfers";

export const useTransfers = () => {
	const { isLoading, transfers } = useSelector((state) => state.transfers);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!transfers.length) {
			dispatch(loadTransfersThunk());
		}
	}, [transfers.length, dispatch]);

	useEffect(() => {
		return () => {
			dispatch(resetTransfersAC());
		};
	}, [dispatch]);
	console.log(transfers);
	return { isLoading, transfers };
};
