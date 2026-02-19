"use client"

import { useState, useEffect } from 'react'
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    setDoc,
    getDoc,
    Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { checkMessageContent, TIMEOUT_DURATION_MS } from '@/lib/chat-utils'
import { toast } from 'sonner'

export interface Message {
    id: string
    text: string
    userId: string
    displayName: string
    photoURL?: string
    channel: string
    createdAt: Timestamp
}

export function useChat(channelName: string) {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [isTimedOut, setIsTimedOut] = useState(false)
    const [timeoutUntil, setTimeoutUntil] = useState<Date | null>(null)
    const [indexLink, setIndexLink] = useState<string | null>(null)

    // Listen for messages in the current channel
    useEffect(() => {
        if (!channelName) return

        // Query messages for the specific channel
        // This requires a composite index on Firestore: channel (ASC) + createdAt (DESC)
        // If the index is missing, this query will fail with a link to create it in the console.
        const q = query(
            collection(db, 'messages'),
            where('channel', '==', channelName),
            orderBy('createdAt', 'desc'),
            limit(50)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const channelMsgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[]

            setMessages(channelMsgs.reverse())
            setLoading(false)
            setLoading(false)
        }, (error: any) => {
            console.error("Chat Error:", error)
            // If the error is about a missing index, we should inform the developer (you)
            if (error.code === 'failed-precondition' || error.message?.includes('index')) {
                console.warn("🔥 MISSING INDEX DETECTED 🔥")
                // Extract the URL from the error message if possible
                const matches = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]*/)
                if (matches && matches[0]) {
                    setIndexLink(matches[0])
                    toast.error("مطلوب إعداد قاعدة البيانات (اضغط على الزر الذي سيظهر)")
                } else {
                    toast.error("مطلوب إنشاء فهرس في قاعدة البيانات")
                }
            } else {
                toast.error(`حدث خطأ: ${error.message}`)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [channelName])

    // Listen for user timeout status
    useEffect(() => {
        if (!user) return

        const userRef = doc(db, 'users', user.uid)
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data()
                if (data.timeoutUntil) {
                    const timeoutTime = data.timeoutUntil.toDate()
                    if (timeoutTime > new Date()) {
                        setIsTimedOut(true)
                        setTimeoutUntil(timeoutTime)
                    } else {
                        setIsTimedOut(false)
                        setTimeoutUntil(null)
                    }
                }
            }
        })

        return () => unsubscribe()
    }, [user])

    const sendMessage = async (text: string) => {
        if (!user) {
            toast.error('يجب عليك تسجيل الدخول للمشاركة')
            return
        }

        if (isTimedOut) {
            toast.error(`أنت معاقب حتى ${timeoutUntil?.toLocaleTimeString()}`)
            return
        }

        // Check for bad words
        const check = checkMessageContent(text)

        if (!check.safe) {
            // User swore! Retrieve existing timeout count or just set timeout
            const punishmentTime = new Date(Date.now() + TIMEOUT_DURATION_MS)

            await setDoc(doc(db, 'users', user.uid), {
                timeoutUntil: Timestamp.fromDate(punishmentTime),
                displayName: user.displayName,
                email: user.email,
                lastViolation: serverTimestamp()
            }, { merge: true })

            toast.error(`تم حظرك مؤقتاً لمدة 5 دقائق بسبب مخالفة القواعد!`)
            return
        }

        try {
            await addDoc(collection(db, 'messages'), {
                text,
                userId: user.uid,
                displayName: user.displayName || 'مستخدم',
                photoURL: user.photoURL,
                channel: channelName,
                createdAt: serverTimestamp()
            })
        } catch (error) {
            console.error('Error sending message:', error)
            toast.error('حدث خطأ أثناء إرسال الرسالة')
        }
    }

    // Extract unique active users from messages
    const activeUsers = messages.reduce((acc: any[], msg) => {
        if (!acc.find(u => u.userId === msg.userId)) {
            acc.push({
                userId: msg.userId,
                displayName: msg.displayName,
                photoURL: msg.photoURL,
                lastSeen: msg.createdAt
            })
        }
        return acc
    }, [])

    return {
        messages,
        loading,
        sendMessage,
        isTimedOut,
        timeoutUntil,
        user,
        indexLink,
        activeUsers
    }
}
