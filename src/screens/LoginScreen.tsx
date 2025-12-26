import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import {
    SPACING,
    FONT_SIZES,
    FONT_WEIGHTS,
    RADIUS,
    GOOGLE_CLIENT_ID,
    REDIRECT_URI,
} from "../constants";

WebBrowser.maybeCompleteAuthSession();

export const LoginScreen: React.FC = () => {
    const { colors } = useTheme();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Use Expo's auth redirect URI (required for Google OAuth with Web Client ID)
    const redirectUri = REDIRECT_URI;

    // Log the expected URI for debugging
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔍 GOOGLE OAUTH DEBUG INFO:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Redirect URI:", redirectUri);
    console.log("Google Client ID:", GOOGLE_CLIENT_ID.web);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  ADD THIS EXACT URI TO GOOGLE CLOUD CONSOLE:");
    console.log(redirectUri);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: GOOGLE_CLIENT_ID.web,
        redirectUri: redirectUri,
    });

    React.useEffect(() => {
        if (request) {
            console.log("✅ Request created successfully");
            console.log(
                "📍 Actual Redirect URI being used:",
                request.redirectUri
            );
            if (request.redirectUri !== redirectUri) {
                console.warn("⚠️  WARNING: Redirect URI mismatch!");
                console.warn("Expected:", redirectUri);
                console.warn("Actual:", request.redirectUri);
            }
        }
    }, [request]);

    React.useEffect(() => {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📥 AUTH RESPONSE:", response?.type || "No response yet");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        if (response?.type === "success") {
            console.log("✅ SUCCESS! Got response from Google");
            console.log(
                "Response params:",
                JSON.stringify(response.params, null, 2)
            );

            const { id_token } = response.params;
            if (id_token) {
                console.log("✅ ID Token received, logging in...");
                handleGoogleLogin(id_token);
            } else {
                console.error("❌ No ID token in response");
                console.error(
                    "Full response:",
                    JSON.stringify(response, null, 2)
                );
                Alert.alert(
                    "Authentication Error",
                    "Failed to get authentication token. Please try again."
                );
            }
        } else if (response?.type === "error") {
            console.error("❌ AUTH ERROR");
            console.error(
                "Error details:",
                JSON.stringify(response.error, null, 2)
            );
            Alert.alert(
                "Authentication Error",
                response.error?.message ||
                    "Something went wrong during authentication. Please try again."
            );
        } else if (response?.type === "cancel") {
            console.log("⚠️  User cancelled authentication");
        } else if (response?.type === "dismiss") {
            console.log("⚠️  Authentication dismissed");
            console.log(
                "This usually means the browser was closed before completing auth"
            );
        } else if (response) {
            console.warn("⚠️  Unknown response type:", response.type);
            console.warn("Full response:", JSON.stringify(response, null, 2));
        }
    }, [response]);

    const handleGoogleLogin = async (idToken: string) => {
        try {
            setIsLoading(true);
            await login(idToken);
        } catch (error: any) {
            Alert.alert(
                "Login Failed",
                error?.message ||
                    "Failed to login with Google. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginPress = () => {
        promptAsync();
    };

    if (isLoading) {
        return <Loading message="Signing you in..." />;
    }

    // DEBUG: Show redirect URI to help user fix configuration
    console.log("Current Redirect URI:", redirectUri);

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.content}>
                {/* Logo/Icon */}
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: colors.primary },
                    ]}
                >
                    <Ionicons name="people" size={64} color="#FFFFFF" />
                </View>

                {/* Title */}
                <Text style={[styles.title, { color: colors.text }]}>
                    Group Expense Manager
                </Text>

                {/* Subtitle */}
                <Text
                    style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                    Manage shared expenses with friends, family, and teams
                </Text>

                {/* Features */}
                <View style={styles.features}>
                    <FeatureItem
                        icon="people-outline"
                        text="Create unlimited groups"
                        colors={colors}
                    />
                    <FeatureItem
                        icon="cash-outline"
                        text="Track expenses & income"
                        colors={colors}
                    />
                    <FeatureItem
                        icon="analytics-outline"
                        text="Monthly summaries"
                        colors={colors}
                    />
                    <FeatureItem
                        icon="swap-horizontal-outline"
                        text="Auto-calculate settlements"
                        colors={colors}
                    />
                </View>
            </View>

            {/* Login Button */}
            <View style={styles.footer}>
                <Button
                    title="Sign in with Google"
                    onPress={handleLoginPress}
                    disabled={!request}
                    fullWidth
                    size="large"
                    icon={
                        <Ionicons
                            name="logo-google"
                            size={20}
                            color="#FFFFFF"
                            style={{ marginRight: SPACING.sm }}
                        />
                    }
                />

                <Text
                    style={[styles.disclaimer, { color: colors.textSecondary }]}
                >
                    By signing in, you agree to our Terms of Service and Privacy
                    Policy
                </Text>
            </View>
        </View>
    );
};

interface FeatureItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    colors: any;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text, colors }) => (
    <View style={styles.featureItem}>
        <Ionicons name={icon} size={24} color={colors.primary} />
        <Text style={[styles.featureText, { color: colors.text }]}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.xl,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: RADIUS.xl,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold,
        textAlign: "center",
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        textAlign: "center",
        marginBottom: SPACING.xxl,
    },
    features: {
        width: "100%",
        marginTop: SPACING.lg,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.md,
    },
    featureText: {
        fontSize: FONT_SIZES.md,
        marginLeft: SPACING.md,
    },
    footer: {
        padding: SPACING.xl,
    },
    devNote: {
        fontSize: FONT_SIZES.sm,
        textAlign: "center",
        marginTop: SPACING.sm,
        fontWeight: FONT_WEIGHTS.medium,
    },
    disclaimer: {
        fontSize: FONT_SIZES.xs,
        textAlign: "center",
        marginTop: SPACING.md,
    },
});
