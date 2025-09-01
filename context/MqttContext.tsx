import React, { createContext, useContext } from 'react';
import { usePahoMqtt } from '../hooks/usePahoMqtt';

type MqttContextType = ReturnType<typeof usePahoMqtt>;

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export function MqttProvider({ children }: { children: React.ReactNode }) {
    const mqttValues = usePahoMqtt();
    return (
        <MqttContext.Provider value={mqttValues}>
            {children}
        </MqttContext.Provider>
    );
}

export function useMqtt() {
    const context = useContext(MqttContext);
    if (context === undefined) {
        throw new Error('useMqtt must be used within an MqttProvider');
    }
    return context;
}
