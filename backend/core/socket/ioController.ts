import { Socket } from "socket.io";

class IOController {
	constructor() {
		this.m_Controllers = new Map();
		this.m_Middlewares = [];
	}

	public use(mw: (socket: Socket, next: any) => any) {
		this.m_Middlewares.push(mw);
	}

	public merge(controller: IOController) {
		for (const [type, callbacks] of controller.m_Controllers) {
			if (!this.m_Controllers.get(type))
				this.m_Controllers.set(type, []);
			this.m_Controllers.get(type)?.push(...callbacks);
		}
		this.m_Middlewares.push(...controller.m_Middlewares);
	}

	public get middlewares() {
		return this.m_Middlewares;
	}

	public on(type: string, callback: (socket: Socket, ...args: any[]) => any) {
		if (!this.m_Controllers.get(type))
			this.m_Controllers.set(type, []);
		this.m_Controllers.get(type)?.push(callback);
	}

	public applyOn(socket: Socket) {
		for (const [type, callbacks] of this.m_Controllers) {
			socket.on(type, async (...args: any[]) => {
				for (const callback of callbacks) {
					try {
						const cont = await callback(socket, ...args);
						if (!cont)
							break;
					}
					catch (error: any) {
						socket.emit(type, error.message);
						console.error(error);
						break;
					}
				}
			});
		}
	}

	// attributes
	private m_Controllers: Map<string, ((socket: Socket, ...args: any[]) => any)[]>;
	private m_Middlewares: ((socket: Socket, next: any) => any)[];
}

export default IOController;