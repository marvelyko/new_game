import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = null;
        this.isConnected = false;
    }

    async startConnection(nickname) {
        try {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5000/messageHub")
                .withAutomaticReconnect()
                .build();

            await this.connection.start();
            this.isConnected = true;
            
            // Join the group with the user's nickname
            await this.connection.invoke("JoinGroup", nickname);
            
            console.log("SignalR Connected");
            return true;
        } catch (error) {
            console.error("SignalR Connection Error:", error);
            return false;
        }
    }

    async sendMessage(content, senderNickname) {
        if (this.connection && this.isConnected) {
            try {
                await this.connection.invoke("SendMessage", content, senderNickname);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    }

    onReceiveMessage(callback) {
        if (this.connection) {
            this.connection.on("ReceiveMessage", callback);
        }
    }

    onReceiveMatch(callback) {
        if (this.connection) {
            this.connection.on("ReceiveMatch", callback);
        }
    }

    onUserJoined(callback) {
        if (this.connection) {
            this.connection.on("UserJoined", callback);
        }
    }

    onUserLeft(callback) {
        if (this.connection) {
            this.connection.on("UserLeft", callback);
        }
    }

    async stopConnection() {
        if (this.connection) {
            await this.connection.stop();
            this.isConnected = false;
            console.log("SignalR Disconnected");
        }
    }
}

export default new SignalRService();
