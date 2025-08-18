/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,

    // bổ sung
    border: "#E5E7EB",       // viền nhạt
    card: "#FFFFFF",         // nền thẻ/sheet
    muted: "#6B7280",        // chữ phụ
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    // bổ sung
    border: "#2D2F31",       // viền tối hơn nền
    card: "#1A1C1E",         // nền thẻ/sheet tối
    muted: "#9BA1A6",        // chữ phụ (giống icon)
  },
};

