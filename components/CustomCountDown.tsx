import { ColorPalatte } from '@/constants/Colors';
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const Colors = ColorPalatte()
function CustomCountDown({ until, onFinish }) {
    const [remainingTime, setRemainingTime] = useState(until);

    useEffect(() => {
        if (remainingTime <= 0) {
            onFinish();
            return;
        }

        const interval = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime]);

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
        <Text style={{ color: Colors.theme.fontColor, fontFamily: 'Poppins-Bold' }}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Text>
    );
}

export default CustomCountDown;
