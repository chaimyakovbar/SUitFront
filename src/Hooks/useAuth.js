import { useMutation } from '@tanstack/react-query';
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useAtom } from 'jotai';
import { authUserAtom } from '../Utils';
import axios from 'axios';

const baseURL = "http://localhost:3020";
// const baseURL = "https://suitback.onrender.com";

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

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
                const response = await axiosInstance.post('/user/auth-webhook', {
                    email: firebaseUser.email
                });

                if (!response.data.success) {
                    throw new Error(response.data.message);
                }

                // Store the user data from our database
                setUser(response.data.user);
            } catch (error) {
                // If user not found in our database, sign out from Firebase
                await signOut(auth);
                setUser(null);
                throw new Error('User not found in our database', error);
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
                const response = await axiosInstance.post('/user/auth-webhook', {
                    email: firebaseUser.email
                });

                if (!response.data.success) {
                    throw new Error(response.data.message);
                }

                // Store the user data from our database
                setUser(response.data.user);
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
            throw error;
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
                const response = await axiosInstance.post('/user/auth-webhook', {
                    email: firebaseUser.email
                });

                if (!response.data.success) {
                    throw new Error(response.data.message);
                }

                // Store the user data from our database
                setUser(response.data.user);
            } catch (error) {
                // If user not found in our database, sign out from Firebase
                await signOut(auth);
                setUser(null);
                throw new Error('User not found in our database', error);
            }
        },
        onError: (error) => {
            console.error('Email sign up error:', error);
            setUser(null);
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
        isLoading: googleSignIn.isLoading || emailSignIn.isLoading || emailSignUp.isLoading,
        error: googleSignIn.error || emailSignIn.error || emailSignUp.error,
        googleSignIn,
        emailSignIn,
        emailSignUp,
        signOut: signOutMutation.mutate,
    };
}; 