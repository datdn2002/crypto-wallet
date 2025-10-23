import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedModal } from "./theme";

export function PercentageSelector({
	value,
	onChange,
	visible,
	onClose,
}: {
	value: number;
	onChange: (value: number) => void;
	visible: boolean;
	onClose: () => void;
}) {
	const presets = [0.1, 0.5, 1.0, 2.5];

	const increase = () => onChange(+(value + 0.1).toFixed(1));
	const decrease = () => onChange(Math.max(0, +(value - 0.1).toFixed(1)));
	const selectPreset = (v: number) => onChange(v);

	return (
		<ThemedModal visible={visible} onClose={onClose} heightPercent={0.85}>
			<Text>Thiết lập mức trượt giá tối đa</Text>
			<View style={styles.container}>
				{/* top row: - 2.0 % + */}
				<View style={styles.topRow}>
					<TouchableOpacity style={styles.roundBtn} onPress={decrease}>
						<MaterialIcons name="remove" size={20} color="#333" />
					</TouchableOpacity>

					<Text style={styles.valueText}>{value.toFixed(1)} %</Text>

					<TouchableOpacity style={styles.roundBtn} onPress={increase}>
						<MaterialIcons name="add" size={20} color="#333" />
					</TouchableOpacity>
				</View>

				{/* bottom row: presets */}
				<View style={styles.bottomRow}>
					{presets.map((p) => (
						<TouchableOpacity
							key={p}
							style={[styles.presetBtn, value === p && styles.presetBtnActive]}
							onPress={() => selectPreset(p)}
						>
							<Text style={[styles.presetText, value === p && styles.presetTextActive]}>{p.toFixed(1)}%</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>
		</ThemedModal>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#f8f8fa",
		borderRadius: 16,
		paddingVertical: 12,
		paddingHorizontal: 16,
		alignItems: "center",
		width: "100%",
		marginTop: 16,
	},
	topRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 10,
	},
	roundBtn: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#d1d1d1",
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 12,
	},
	valueText: {
		fontSize: 20,
		fontWeight: "600",
		color: "#333",
	},
	bottomRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	presetBtn: {
		flex: 1,
		paddingVertical: 6,
		borderRadius: 8,
		backgroundColor: "#fff",
		marginHorizontal: 4,
		alignItems: "center",
	},
	presetBtnActive: {
		backgroundColor: "#4CAF50",
	},
	presetText: {
		fontSize: 14,
		color: "#333",
	},
	presetTextActive: {
		color: "#fff",
		fontWeight: "600",
	},
});
