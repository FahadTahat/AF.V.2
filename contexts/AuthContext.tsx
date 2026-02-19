"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
    user: User | null
    loading: boolean
    signup: (email: string, password: string, displayName: string) => Promise<void>
    login: (email: string, password: string) => Promise<void>
    loginWithGoogle: () => Promise<void>
    loginWithApple: () => Promise<void>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Enforce email verification
        if (!loading && user && !user.emailVerified) {
            const isAuthPage = pathname?.startsWith('/auth/')

            // Allow access to verify-email and other auth pages, but redirect to verify-email if trying to access app
            if (!isAuthPage || (isAuthPage && !pathname?.includes('verify-email'))) {
                // Redirect to verify-email
                if (pathname !== '/auth/verify-email') {
                    router.push('/auth/verify-email')
                }
            }
        }
    }, [user, loading, pathname, router])

    useEffect(() => {
        let unsubscribeUserDoc: () => void

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Listen to user's Firestore document for custom avatar (photoBase64)
                // This bypasses Firebase Storage if it's not set up
                try {
                    const { onSnapshot, doc } = await import('firebase/firestore')
                    const { db } = await import('@/lib/firebase')

                    // Add error handler for onSnapshot to catch permission errors
                    unsubscribeUserDoc = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
                        const userData = docSnap.data()
                        // Create a shallow copy to modify photoURL without error
                        const customUser = { ...currentUser }

                        if (userData) {
                            // @ts-ignore
                            if (userData.photoBase64) customUser.photoURL = userData.photoBase64
                            // @ts-ignore
                            if (userData.displayName) customUser.displayName = userData.displayName
                            // @ts-ignore
                            if (userData.emailVerified !== undefined) customUser.emailVerified = userData.emailVerified
                        }
                        // @ts-ignore
                        setUser(customUser)
                    }, (error) => {
                        console.error("Firestore user listener error:", error)
                        // Fallback to auth user only if firestore fails
                        setUser(currentUser)
                    })
                } catch (e) {
                    console.error("Error setting up user listener:", e)
                    setUser(currentUser)
                }
            } else {
                setUser(null)
                if (unsubscribeUserDoc) unsubscribeUserDoc()
            }
            setLoading(false)
        })

        return () => {
            unsubscribeAuth()
            if (unsubscribeUserDoc) unsubscribeUserDoc()
        }
    }, [])

    const saveUserToFirestore = async (user: User) => {
        try {
            const { doc, setDoc, serverTimestamp, getDoc } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase')

            const userRef = doc(db, 'users', user.uid)
            const userSnap = await getDoc(userRef)

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp(),
                    role: 'طالب'
                }, { merge: true })
            } else {
                await setDoc(userRef, {
                    lastLogin: serverTimestamp(),
                    email: user.email, // Update email if changed
                    displayName: user.displayName || userSnap.data().displayName, // Keep existing display name if auth display name is empty
                    photoURL: user.photoURL || userSnap.data().photoURL // Keep existing photo if auth photo is empty
                }, { merge: true })
            }
        } catch (error) {
            console.error("Error saving user to Firestore (permissions?):", error)
            // Continue execution, don't block login
        }
    }

    const signup = async (email: string, password: string, displayName: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCredential.user, { displayName })
        await saveUserToFirestore(userCredential.user)
        router.push('/profile')
    }

    const login = async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        await saveUserToFirestore(userCredential.user)
        router.push('/')
    }

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        const userCredential = await signInWithPopup(auth, provider)
        await saveUserToFirestore(userCredential.user)
        router.push('/')
    }

    const loginWithApple = async () => {
        const provider = new OAuthProvider('apple.com')
        provider.addScope('email')
        provider.addScope('name')
        provider.setCustomParameters({ locale: 'ar' })
        const userCredential = await signInWithPopup(auth, provider)
        await saveUserToFirestore(userCredential.user)
        router.push('/')
    }

    const logout = async () => {
        await signOut(auth)
        router.push('/')
    }

    const refreshUser = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload()
            setUser({ ...auth.currentUser })
        }
    }

    const value = {
        user,
        loading,
        signup,
        login,
        loginWithGoogle,
        loginWithApple,
        logout,
        refreshUser
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
