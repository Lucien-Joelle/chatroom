// src/app/chat/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RoomEntry from '../../components/RoomEntry';
import MessageItem from '../../components/MessageItem';
import { RoomPreviewInfo, Message, RoomInfo } from '../../types';
import { getRoomList, getRoomMessages, sendMessage, createRoom } from '../../services/api';

export default function ChatRoom() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [rooms, setRooms] = useState<RoomPreviewInfo[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentRoom, setCurrentRoom] = useState<RoomInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shouldShowTime = (currentMsg: Message, prevMsg: Message | null) => {
    // 如果是第一条消息，显示时间
    if (!prevMsg) return true;
    
    // 如果两条消息之间的时间间隔超过5分钟（300000毫秒），显示时间
    return currentMsg.time - prevMsg.time > 300000;
  };

  // 处理房间点击
  const handleRoomClick = useCallback(async (roomId: number) => {
    setActiveRoomId(roomId);
    setLoading(true);
    
    try {
      // 从API获取消息
      const roomMessages = await getRoomMessages(roomId);
      setMessages(roomMessages);
      
      // 设置当前房间信息
      const room = rooms.find(r => r.roomId === roomId);
      if (room) {
        setCurrentRoom({
          roomId: room.roomId,
          roomName: room.roomName,
          createdBy: room.lastMessage?.sender || '未知'
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError('获取房间消息失败');
      setLoading(false);
      console.error('获取房间消息失败:', err);
    }
  }, [rooms]);



  useEffect(() => {
    // 检查用户是否设置了昵称
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      router.push('/');
      return;
    }
    setUsername(storedUsername);

    // 获取房间列表
    const initRooms = async () => {
      try {
        setLoading(true);
        const roomList = await getRoomList();
        setRooms(roomList);
        
        // 默认选中第一个房间
        if (roomList.length > 0 && !activeRoomId) {
          const firstRoom = roomList[0];
          setActiveRoomId(firstRoom.roomId);
          
          // 获取第一个房间的消息
          const roomMessages = await getRoomMessages(firstRoom.roomId);
          setMessages(roomMessages);
          
          // 设置当前房间信息
          setCurrentRoom({
            roomId: firstRoom.roomId,
            roomName: firstRoom.roomName,
            createdBy: firstRoom.lastMessage?.sender || '未知'
          });
        }
        setLoading(false);
      } catch (err) {
        setError('获取房间列表失败');
        setLoading(false);
        console.error('获取房间列表失败:', err);
      }
    };

    initRooms();
    
    // 定期刷新房间列表
    const roomListInterval = setInterval(async () => {
      try {
        const roomList = await getRoomList();
        setRooms(roomList);
      } catch (err) {
        console.error('刷新房间列表失败:', err);
      }
    }, 60000); // 每60秒刷新一次
    
    return () => {
      clearInterval(roomListInterval);
    };
  }, [router, activeRoomId]);

  // 定期更新消息
  useEffect(() => {
    if (!activeRoomId) return;

    const messageInterval = setInterval(async () => {
      try {
        const roomMessages = await getRoomMessages(activeRoomId);
        setMessages(roomMessages);
      } catch (err) {
        console.error('获取消息更新失败:', err);
      }
    }, 10000); // 每10秒更新一次

    return () => clearInterval(messageInterval);
  }, [activeRoomId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeRoomId) {
      try {
        // 清空输入框
        const messageContent = newMessage;
        setNewMessage('');
        
        // 调用API发送消息
        await sendMessage(activeRoomId, messageContent);
        
        // 获取最新消息列表
        const roomMessages = await getRoomMessages(activeRoomId);
        setMessages(roomMessages);
      } catch (err) {
        setError('发送消息失败');
        console.error('发送消息失败:', err);
      }
    }
  };

  // 创建新房间
  const [newRoomName, setNewRoomName] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      try {
        setLoading(true);
        const newRoom = await createRoom(newRoomName);
        
        // 重新获取房间列表
        const roomList = await getRoomList();
        setRooms(roomList);
        
        // 选中新创建的房间
        handleRoomClick(newRoom.roomId);
        
        // 重置表单
        setNewRoomName('');
        setShowCreateRoom(false);
        setLoading(false);
      } catch (err) {
        setError('创建房间失败');
        setLoading(false);
        console.error('创建房间失败:', err);
      }
    }
  };
  
  return (
    <div className="chat-container">
      {/* 错误提示 */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>关闭</button>
        </div>
      )}
      
      {/* 左侧房间列表 */}
      <div className="room-list">
        <div className="room-list-header">
          <h2>聊天室列表</h2>
          <button 
            className="create-room-btn" 
            onClick={() => setShowCreateRoom(!showCreateRoom)}
          >
            {showCreateRoom ? 'x' : '+'}
          </button>
        </div>
        
        {/* 创建房间表单 */}
        {showCreateRoom && (
          <div className="create-room-form">
            <form onSubmit={handleCreateRoom}>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="输入房间名称"
                required
              />
              <button type="submit">创建</button>
            </form>
          </div>
        )}
        
        <div className="room-list-content">
          {loading && rooms.length === 0 ? (
            <div className="loading">加载中...</div>
          ) : rooms.length === 0 ? (
            <div className="no-rooms">暂无聊天室，请创建一个</div>
          ) : (
            rooms.map(room => (
              <RoomEntry
                key={room.roomId}
                room={room}
                isActive={room.roomId === activeRoomId}
                onClick={handleRoomClick}
              />
            ))
          )}
        </div>
      </div>
      
      {/* 右侧聊天窗口 */}
      <div className="chat-window">
        {activeRoomId ? (
          <>
            <div className="chat-header">
              <h2>{currentRoom?.roomName}</h2>
            </div>
            <div className="message-list">
              {loading ? (
                <div className="loading-messages">加载消息中...</div>
              ) : messages.length === 0 ? (
                <div className="no-messages">暂无消息，发送第一条消息吧</div>
              ) : (
                messages.map((message, index) => (
                  <MessageItem
                    key={message.messageId}
                    message={message}
                    isSelf={message.sender === username}
                    showTime={shouldShowTime(message, index > 0 ? messages[index - 1] : null)}
                  />
                ))
              )}
            </div>
            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`发送给 ${currentRoom?.roomName}`}
                className="message-input"
                disabled={loading}
              />
              <button type="submit" className="send-button" disabled={loading}>
                {loading ? '发送中...' : '发送'}
              </button>
            </form>
          </>
        ) : (
          <div className="no-room-selected">
            <p>请选择一个聊天室</p>
          </div>
        )}
      </div>
    </div>
  );
}
