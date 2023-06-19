export default interface AutobotCommand {
    cmdLabel: string;
    cmdAliases: string[];
    executeCommand(): void;
    adminOnly: boolean;
    description: string;
    disabled: boolean;
}

export default class CommandHandler {
    private readonly registeredCommands: Map<string, AutobotCommand>;

    constructor() {
        this.registeredCommands = new Map();
    }

    public registerCommand(cmd: AutobotCommand): void {
        const label = cmd.cmdLabel;

        if (this.registeredCommands.has(label)) {
            throw new Error();
        }

        this.registeredCommands.set(label, cmd);
    }

    public unregisterCommand(cmd: AutobotCommand): void {
        const label = cmd.cmdLabel;

        if (this.registeredCommands.has(label)) {
            this.registeredCommands.delete(label);
        }
    }

    public getRegistered(): Map<string, AutobotCommand> {
        return this.registeredCommands;
    }
}
