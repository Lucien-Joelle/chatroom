// src/types/index.ts
export interface ApiResponse<T> {
  message: string;
  code: number;
  data: T | null;
}

// 聊天室信息
export interface RoomInfo {
  roomId: number;
  roomName: string;
  createdBy: string;
}

// 聊天室预览信息（用于列表展示）
export interface RoomPreviewInfo {
  roomId: number;
  roomName: string;
  lastMessage: Message | null;
}

// 消息信息
export interface Message {
  messageId: number;
  roomId: number;
  sender: string;
  content: string;
  time: number;
}

// 用户信息
export interface UserInfo {
  username: string;
}
