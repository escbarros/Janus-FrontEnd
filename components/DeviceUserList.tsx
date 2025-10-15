import { Pencil } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface AccessItemProps {
    id: string;
    accessLevel: 'OWNER' | 'ADMIN' | 'USER';
    user: {
        id: string;
        name: string;
        profilePic: string;
    };
    name: string;
    pic: string;
    canUpdate: boolean;
}

const ACCESS_LEVELS_LABEL = {
    OWNER: 'Proprietário',
    ADMIN: 'Administrador',
    USER: 'Visualizador',
};

const AccessItem = ({
    id,
    accessLevel,
    user,
    canUpdate = false,
}: AccessItemProps) => {
    return (
        <TouchableOpacity
            disabled={!canUpdate}
            className="w-full items-center justify-between flex-row pl-6"
        >
            <View className="flex-row items-center gap-3 relative">
                {canUpdate && (
                    <View className="absolute -left-6">
                        <Pencil size={16} color="white" />
                    </View>
                )}
                <View className="w-12 h-12 rounded-full bg-red-200 overflow-hidden">
                    <Image
                        source={{ uri: user.profilePic }}
                        className="w-full h-full rounded-full"
                    />
                </View>
                <Text className="text-xl color-white font-medium">
                    {user.name}
                </Text>
            </View>
            <View className="bg-emerald-400/25 rounded-lg py-1 px-2">
                <Text className="color-white">
                    {ACCESS_LEVELS_LABEL[accessLevel]}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const DeviceUserList = ({
    userId,
    accesses,
}: {
    userId: string;
    accesses: AccessItemProps[];
}) => {
    const [userCanEdit, setUserCanEdit] = useState(false);
    const [orderedAccesses, setOrderedAccesses] = useState<AccessItemProps[]>();

    const sortUsers = (access: AccessItemProps[], userId: string) => {
        const list = Object.values(access).filter((u) => typeof u === 'object');

        const priority = {
            OWNER: 2,
            ADMIN: 1,
            USER: 0,
        };

        list.sort((a, b) => {
            if (a.user.id === userId) return -1;
            if (b.user.id === userId) return 1;

            return priority[b.accessLevel] - priority[a.accessLevel];
        });

        return list;
    };
    useEffect(() => {
        const currentUserAccess = accesses.find((a) => a.user.id === userId);
        setUserCanEdit(currentUserAccess?.accessLevel !== 'USER');
        setOrderedAccesses(sortUsers(accesses, userId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accesses]);
    return (
        <FlatList
            data={orderedAccesses}
            keyExtractor={(item) => item.id || Math.random().toString()}
            contentContainerClassName="gap-5"
            renderItem={({ item }) => (
                <AccessItem
                    {...item}
                    user={{
                        ...item.user,
                        name:
                            item.user?.id !== userId ? item.user?.name : 'Você',
                    }}
                    canUpdate={
                        userCanEdit &&
                        item.user?.id !== userId &&
                        item.accessLevel !== 'OWNER'
                    }
                />
            )}
        />
    );
};

export default DeviceUserList;
