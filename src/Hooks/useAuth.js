import { useMutation } from '@tanstack/react-query';
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../firebase.js';
import { useAtom } from 'jotai';
import { authUserAtom } from '../Utils';
import { userAPI } from '../config/api.js';

export const useAuth = () => {
    const [user, setUser] = useAtom(authUserAtom);

    // Mutation for Google sign in
    const googleSignIn = useMutation({
        mutationFn: async ({ isNewUser = false }) => {
            if (isNewUser) {
                provider.setCustomParameters({
                    prompt: "select_account",
                });
            }
            const result = await signInWithPopup(auth, provider);
            return result.user;
        },
        onSuccess: async (firebaseUser) => {
            try {
                // Send email to our webhook
                const response = await userAPI.authWebhook({
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    firebaseUid: firebaseUser.uid,
                    photoURL: firebaseUser.photoURL
                });

                if (!response.success) {
                    throw new Error(response.message || 'Authentication failed');
                }

                // Store the user data from our database
                setUser(response.user);
                return response.user;
            } catch (error) {
                console.error('Detailed auth error:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });

                // If user not found in our database, create them
                if (error.response?.status === 404) {
                    try {
                        const createResponse = await userAPI.createUser({
                            email: firebaseUser.email,
                            name: firebaseUser.displayName,
                            firebaseUid: firebaseUser.uid,
                            photoURL: firebaseUser.photoURL
                        });

                        if (createResponse.success) {
                            setUser(createResponse.user);
                            return createResponse.user;
                        }
                    } catch (createError) {
                        console.error('Error creating user:', createError);
                    }
                }

                // If we get here, something went wrong - sign out
                await signOut(auth);
                setUser(null);
                throw new Error(error.response?.data?.message || 'Authentication failed');
            }
        },
        onError: (error) => {
            console.error('Google sign in error:', error);
            setUser(null);
        },
    });

    // Mutation for email/password sign in
    const emailSignIn = useMutation({
        mutationFn: async ({ email, password }) => {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        },
        onSuccess: async (firebaseUser) => {
            try {
                // Send email to our webhook
                const response = await userAPI.authWebhook({
                    email: firebaseUser.email
                });

                if (!response.success) {
                    throw new Error(response.message);
                }

                // Store the user data from our database
                setUser(response.user);
            } catch (error) {
                // If user not found in our database, sign out from Firebase
                await signOut(auth);
                setUser(null);
                throw new Error('User not found in our database', error);
            }
        },
        onError: (error) => {
            console.error('Email sign in error:', error);
            setUser(null);

            // Translate Firebase errors to English
            let errorMessage = "Login error";

            switch (error.code) {
                case 'auth/invalid-credential':
                    errorMessage = "Invalid email or password";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "No user found with this email";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "Wrong password";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Invalid email address";
                    break;
                case 'auth/user-disabled':
                    errorMessage = "Account is disabled";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many login attempts. Please try again later";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Internet connection problem";
                    break;
                default:
                    errorMessage = "Login error. Please try again";
            }

            // Create a new error with the translated message
            const translatedError = new Error(errorMessage);
            translatedError.originalError = error;
            throw translatedError;
        },
    });

    // Mutation for email/password sign up
    const emailSignUp = useMutation({
        mutationFn: async ({ email, password }) => {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result.user;
        },
        onSuccess: async (firebaseUser) => {
            try {
                // Send email to our webhook
                const response = await userAPI.authWebhook({
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    firebaseUid: firebaseUser.uid,
                    photoURL: firebaseUser.photoURL
                });

                if (!response.success) {
                    throw new Error(response.message || 'Authentication failed');
                }

                // Store the user data from our database
                setUser(response.user);
                return response.user;
            } catch (error) {
                console.error('Detailed auth error:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });

                // If user not found in our database, create them
                if (error.response?.status === 404) {
                    try {
                        const createResponse = await userAPI.createUser({
                            email: firebaseUser.email,
                            name: firebaseUser.displayName,
                            firebaseUid: firebaseUser.uid,
                            photoURL: firebaseUser.photoURL
                        });

                        if (createResponse.success) {
                            setUser(createResponse.user);
                            return createResponse.user;
                        }
                    } catch (createError) {
                        console.error('Error creating user:', createError);
                    }
                }

                // If we get here, something went wrong - sign out
                await signOut(auth);
                setUser(null);
                throw new Error(error.response?.data?.message || 'Authentication failed');
            }
        },
        onError: (error) => {
            console.error('Email sign up error:', error);
            setUser(null);

            // Translate Firebase errors to English
            let errorMessage = "Registration error";

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = "Email address already exists in the system";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Invalid email address";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Password must contain at least 6 characters";
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = "Registration with email and password is not enabled";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Internet connection problem";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many attempts. Please try again later";
                    break;
                default:
                    errorMessage = "Registration error. Please try again";
            }

            // Create a new error with the translated message
            const translatedError = new Error(errorMessage);
            translatedError.originalError = error;
            throw translatedError;
        },
    });

    // Mutation for password reset
    const resetPassword = useMutation({
        mutationFn: async ({ email }) => {
            try {
                // Use our server to send beautiful password reset email
                const response = await userAPI.resetPassword(email);
                return response;
            } catch (error) {
                console.error('❌ Password reset error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message,
                    fullError: error
                });

                throw error;
            }
        },
        onSuccess: () => {
        },
        onError: (error) => {
            console.error('💥 Password reset mutation error:', error);
            throw error;
        },
    });

    // Mutation for sign out
    const signOutMutation = useMutation({
        mutationFn: async () => {
            await signOut(auth);
        },
        onSuccess: () => {
            setUser(null);
        },
    });

    return {
        user,
        isLoading: googleSignIn.isLoading || emailSignIn.isLoading || emailSignUp.isLoading || resetPassword.isLoading,
        error: googleSignIn.error || emailSignIn.error || emailSignUp.error || resetPassword.error,
        googleSignIn,
        emailSignIn,
        emailSignUp,
        resetPassword,
        signOut: signOutMutation.mutate,
    };
}; 