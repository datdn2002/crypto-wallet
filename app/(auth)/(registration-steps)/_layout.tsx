import { useAuthStore } from "@/store/auth";
import { Redirect, Stack, usePathname } from "expo-router";

export default function AuthLayout() {
	const { registrationData } = useAuthStore();
	const pathName = usePathname();

	if (!registrationData?.email && !pathName.includes("register")) {
		return <Redirect href="/(auth)/(registration-steps)/register" />;
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		/>
	);
}
