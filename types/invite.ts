export interface InviteDetails {
    sender: { id: string; name: string | null } | null;
    revoked: { id: string; name: string | null } | null;
    receiver: { id: string; name: string | null } | null;
    accessLevel: 'USER' | 'ADMIN' | 'OWNER';
    device: { serialNumber: string };
}
