import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import { mailsReducer } from "./mails";
import { userReducer } from "./user";
import { transfersReducer } from "./transfers";
import { authReducer } from "./auth";
import { usersReducer } from "./users";

const rootReducer = combineReducers({
	auth: authReducer,
	user: userReducer,
	mails: mailsReducer,
	transfers: transfersReducer,
	users: usersReducer,
});

export const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk))
);
