export interface Event {
    id: string;
    timestamp: Date;
    userId: string | null;
    deviceSerialNumber: string;
    type: EventType;
    readAt: Date | null;
    device?: {
        serialNumber: string;
        nickname: string;
    };
}

export interface EventResponse extends Omit<Event, 'timestamp'> {
    timestamp: string; // API returns timestamp as string
}

export type EventType =
    | 'door-locked'
    | 'door-unlocked'
    | 'DOORBELL'
    | 'INVITE_SENT'
    | 'INVITE_RECEIVED'
    | 'invite-accepted'
    | 'link-invite';
