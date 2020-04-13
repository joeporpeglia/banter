declare module 'socket.io-client' {
  export type Socket = {
    emit(type: string, msg: any): Socket;
    on(type: string, callback: (msg: any) => void): Socket;
    close(): void;
  };

  export default function IO(host?: string): Socket;
}
