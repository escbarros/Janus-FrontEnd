export interface Event {
    id: string;
    timestamp: Date;
    userId: string | null;
    deviceSerialNumber: string;
    type: EventType;
    readAt: Date | null;
    inviteId?: string | null;
    device?: {
        serialNumber: string;
        nickname: string;
    };
    user?: {
        id: string;
        name: string;
        picUrl: string;
    };
}

export interface EventResponse extends Omit<Event, 'timestamp'> {
    timestamp: string; // API returns timestamp as string
}

export type EventType =
    | 'DOOR_LOCKED'
    | 'DOOR_UNLOCKED'
    | 'DOORBELL'
    | 'INVITE_SENT'
    | 'INVITE_RECEIVED'
    | 'INVITE_ACCEPTED'
    | 'LINK_INVITE';
