import BackButton from '@/components/BackButton';
import { log } from '@/constants';
import { useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

const EditProfile = () => {
    const { user } = useUser();
    const [isUploading, setIsUploading] = useState(false);

    const requestPermissions = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permissão necessária',
                'Precisamos de permissão para acessar sua galeria de fotos.',
                [{ text: 'OK' }],
            );
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        try {
            const hasPermission = await requestPermissions();
            if (!hasPermission) return;

            // Mostrar opções para o usuário
            Alert.alert(
                'Escolher foto',
                'Como você gostaria de adicionar sua foto?',
                [
                    {
                        text: 'Galeria',
                        onPress: () => openImageLibrary(),
                    },
                    {
                        text: 'Câmera',
                        onPress: () => openCamera(),
                    },
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                ],
            );
        } catch (error) {
            log.error('Error in pickImage:', error);
        }
    };

    const openImageLibrary = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                await updateProfileImage(result.assets[0]);
            }
        } catch (error) {
            log.error('Error opening image library:', error);
            Alert.alert('Erro', 'Não foi possível abrir a galeria.');
        }
    };

    const openCamera = async () => {
        try {
            // Solicitar permissão da câmera
            const { status } =
                await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permissão necessária',
                    'Precisamos de permissão para acessar sua câmera.',
                    [{ text: 'OK' }],
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                await updateProfileImage(result.assets[0]);
            }
        } catch (error) {
            log.error('Error opening camera:', error);
            Alert.alert('Erro', 'Não foi possível abrir a câmera.');
        }
    };

    const updateProfileImage = async (asset: ImagePicker.ImagePickerAsset) => {
        try {
            setIsUploading(true);
            log.debug('Updating profile image...');

            if (!user) {
                Alert.alert('Erro', 'Usuário não encontrado.');
                return;
            }

            const response = await fetch(asset.uri);
            const blob = await response.blob();

            await user.setProfileImage({ file: blob });

            log.debug('Profile image updated successfully');
            Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
        } catch (error) {
            log.error('Error updating profile image:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <View className="w-full h-full bg-transparent items-center gap-11">
            <View className="w-full relative flex-row justify-center items-center">
                <View className="absolute left-0 top-0">
                    <BackButton />
                </View>
                <Text className="color-white text-2xl font-bold">
                    Editar Perfil
                </Text>
            </View>
            <View className="w-full items-center">
                <TouchableOpacity
                    className="h-40 w-40 rounded-full overflow-hidden bg-gray-200 relative"
                    onPress={pickImage}
                    disabled={isUploading}
                >
                    <Image
                        source={{ uri: user?.imageUrl }}
                        className="w-full h-full"
                    />
                    {isUploading && (
                        <View className="absolute inset-0 bg-black/50 justify-center items-center">
                            <Text className="color-white text-sm">
                                Enviando...
                            </Text>
                        </View>
                    )}
                    <View className="absolute bottom-2 right-2 bg-emerald-400 p-2 rounded-full">
                        <Camera color="#000000" size={16} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EditProfile;
