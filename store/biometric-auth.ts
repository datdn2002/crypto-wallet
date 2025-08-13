import * as LocalAuthentication from 'expo-local-authentication';

export async function authenticateBiometric(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (!hasHardware || !isEnrolled) {
        console.warn('Thiết bị không hỗ trợ sinh trắc học');
        return false;
    }

    if (!types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        console.warn('Thiết bị không hỗ trợ Face ID');
        return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Xác thực người dùng',
        fallbackLabel: 'Dùng mật khẩu',
        cancelLabel: 'Huỷ',
    });

    return result.success;
}
