// src/components/RoomEntry.tsx
import { RoomPreviewInfo } from '../types';
import { useState } from 'react';

interface RoomEntryProps {
  room: RoomPreviewInfo;
  isActive: boolean;
  onClick: (roomId: number) => void;
}

export default function RoomEntry({ room, isActive, onClick }: RoomEntryProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`room-entry ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
      onClick={() => onClick(room.roomId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="room-icon">
        {room.roomName.charAt(0).toUpperCase()}
      </div>
      <div className="room-info">
          <div className="room-name">{room.roomName}</div>
          <div className="last-message">
            {room.lastMessage ? room.lastMessage.content : '暂无消息'}
          </div>
        </div>
    </div>
  );
}
