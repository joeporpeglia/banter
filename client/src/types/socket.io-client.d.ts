declare module 'socket.io-client' {
  export type Socket<MessageType> = {
    emit(tag: 'namespace', msg: string): Socket;
    emit(tag: string, msg: MessageType): Socket;
    on(tag: string, callback: (msg: MessageType) => void): Socket;
    close(): void;
  };

  export default function IO<MessageType>(host?: string): Socket<MessageType>;
}
