"use strict";

const { Contract, Context } = require("fabric-contract-api");

class UserList {
	constructor(ctx) {
		this.ctx = ctx;
		this.KEY = "users";
	}
	async setUsers(users) {
		const DataUsers = Buffer.from(JSON.stringify(users));
		await this.ctx.stub.putState(this.KEY, DataUsers);
	}
	async getUsers() {
		const ListUsers = await this.ctx.stub.getState(this.KEY);
		const users = JSON.parse(ListUsers.toString());
		return users;
	}
	async getUser(login) {
		const users = await this.getUsers();
		return users[login];
	}
	async addUser(login, user) {
		const users = await this.getUsers();
		users[login] = user;
		await this.setUsers(users);
	}
	async addAdmin(login) {
		const users = await this.getUsers();
		users[login].role = ROLES.ADMIN;
		await this.setUsers(users);
	}
	async addPostman(login, postIndex) {
		const users = await this.getUsers();
		users[login].role = ROLES.POSTMAN;
		users[login].postIndex = postIndex;
		await this.setUsers(users);
	}
	async delPostman(login) {
		const users = await this.getUsers();
		users[login].role = ROLES.USER;
		users[login].postIndex = "";
		await this.setUsers(users);
	}
	async changeInfo(login, name, address) {
		const users = await this.getUsers();
		users[login].name = name;
		users[login].address = address;
		await this.setUsers(users);
	}
	async changePostIndex(login, newPostIndex) {
		const users = await this.getUsers();
		users[login].postIndex = newPostIndex;
		await this.setUsers(users);
	}
	async againstAcceptPackage(login) {
		const users = await this.getUsers();
		users[login].acceptPackage = !users[login].acceptPackage;
		await this.setUsers(users);
	}
	async sendMoney(login, money) {
		const users = await this.getUsers();
		users[login].balance -= money;
		await this.setUsers(users);
	}
	async getMoney(login, money) {
		const users = await this.getUsers();
		users[login].balance += money;
		await this.setUsers(users);
	}
	async getUserOfPostIndex(indexPost) {
		//найти сотрудника почты по индексу отделения
		const users = await this.getUsers();
		const usersValue = Object.values(users);
		const user = usersValue.find((user) => user.postIndex === indexPost);
		return user.login;
	}
}

class UsersCTX extends Context {
	constructor() {
		super();
		this.userList = new UserList(this);
	}
}

const ROLES = {
	USER: 0,
	POSTMAN: 1,
	ADMIN: 2,
	MAIN_ADMIN: 3,
};

class User {
	static #id = 0;
	constructor(login, name, address, role) {
		this.id = User.#id++;
		this.login = login;
		this.name = name;
		this.address = address;
		this.role = role; //1-пользователь, 2 - сотрудник почты, 3 - админ, 4 - главный админ
		this.balance = 100;
		this.postIndex = "";
		this.acceptPackage = true;
	}
}

class UsersContract extends Contract {
	createContext() {
		return new UsersCTX();
	}
	async initializationContract(ctx) {
		const users = {};
		users["superAdmin"] = new User(
			"superAdmin",
			"Super Admin",
			"Kaluga",
			ROLES.MAIN_ADMIN
		);
		users["admin"] = new User("admin", "admin", "Kaluga", ROLES.ADMIN);
		users["postman"] = new User("postman", "postman", "Kaluga", ROLES.POSTMAN);
		users["user"] = new User("user", "user", "Kaluga", ROLES.USER);
		await ctx.userList.createUsers(users);
		return users;
	}
	async getUser(ctx, login) {
		return await ctx.userList.getUser(login);
	}
	async registration(ctx, login, name, address) {
		const users = await ctx.userList.getUsers();
		if (users[login]) {
			return new Error();
		}
		const user = new User(login, name, address, ROLES.USER);
		await ctx.userList.addUser(login, user);
		return user;
	}
	async addAdmin(ctx, loginAdmin, loginUser) {
		const users = await ctx.userList.getUsers();
		if (users[loginAdmin].role !== ROLES.MAIN_ADMIN) {
			return new Error();
		}
		await ctx.userList.addAdmin(loginUser);
		return await ctx.userList.getUser(loginUser);
	}
	async addPostman(ctx, loginAdmin, loginUser, postIndex) {
		const users = await ctx.userList.getUsers();
		if (users[loginAdmin].role !== ROLES.ADMIN) {
			return new Error();
		}
		if (users[loginUser].role !== ROLES.USER) {
			return new Error();
		}
		await ctx.userList.addPostman(loginUser, postIndex);
		return await ctx.userList.getUser(loginUser);
	}
	async changeInfo(ctx, login, name, address) {
		const users = await this.getUsers();
		users[login].name = name;
		users[login].address = address;
		await this.setUsers(users);
		return users[login];
	}
	async delPostman(ctx, loginAdmin, loginUser) {
		const users = await ctx.userList.getUsers();
		if (users[loginAdmin].role !== ROLES.ADMIN) {
			return new Error();
		}
		if (users[loginUser].role !== ROLES.POSTMAN) {
			return new Error();
		}
		await ctx.userList.delPostman(loginUser);
		return await ctx.userList.getUser(loginUser);
	}
	async changePostIndex(ctx, loginAdmin, loginUser, newPostIndex) {
		const users = await ctx.userList.getUsers();
		if (users[loginAdmin].role !== ROLES.ADMIN) {
			return new Error();
		}
		if (users[loginUser].role !== ROLES.POSTMAN) {
			return new Error();
		}
		await ctx.userList.changePostIndex(loginUser, newPostIndex);
		return await ctx.userList.getUser(loginUser);
	}
	async againstAcceptPackage(ctx, login) {
		await ctx.userList.againstAcceptPackage(login);
		return await ctx.userList.getUser(login);
	}
	async getUserOfPostIndex(ctx, postIndex) {
		return await ctx.userList.getUserOfPostIndex(postIndex);
	}
	async getUsers(ctx) {
		return await ctx.userList.getUsers();
	}
}

module.exports.UserList = UserList;
module.exports.UsersContract = UsersContract;
