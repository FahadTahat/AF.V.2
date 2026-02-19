import { db } from './firebase'
import {
    doc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    getDoc,
    serverTimestamp,
    addDoc,
    updateDoc,
    increment,
    orderBy,
    limit
} from 'firebase/firestore'

export interface Bookmark {
    id: string
    userId: string
    resourceId: string
    resourceTitle: string
    resourceType: string
    createdAt: any
}

export interface Progress {
    userId: string
    resourceId: string
    status: 'not_started' | 'in_progress' | 'completed'
    percentage: number
    lastAccessed: any
}

export interface Comment {
    id: string
    resourceId: string
    userId: string
    userName: string
    text: string
    createdAt: any
}

export interface Rating {
    userId: string
    resourceId: string
    rating: number // 1-5
}

export interface Note {
    id: string
    userId: string
    resourceId: string
    content: string
    createdAt: any
    updatedAt: any
}

export interface ChatHistory {
    id: string
    userId: string
    messages: Array<{ role: string; content: string }>
    createdAt: any
    updatedAt: any
}

export interface Activity {
    id: string
    userId: string
    type: 'bookmark' | 'download' | 'complete' | 'rating' | 'comment' | 'note'
    resourceId?: string
    resourceTitle?: string
    details: string
    createdAt: any
}

export interface Achievement {
    id: string
    userId: string
    type: string
    title: string
    description: string
    icon: string
    unlockedAt: any
}

// ================== BOOKMARKS ==================
export const toggleBookmark = async (userId: string, resource: any) => {
    const bookmarkRef = doc(db, 'bookmarks', `${userId}_${resource.id}`)
    const bookmarkSnap = await getDoc(bookmarkRef)

    if (bookmarkSnap.exists()) {
        await deleteDoc(bookmarkRef)
        await logActivity(userId, 'bookmark', resource.id, resource.title, 'إزالة من المفضلة')
        return false
    } else {
        await setDoc(bookmarkRef, {
            userId,
            resourceId: resource.id,
            resourceTitle: resource.title,
            resourceType: resource.type,
            createdAt: serverTimestamp()
        })
        await logActivity(userId, 'bookmark', resource.id, resource.title, 'إضافة للمفضلة')
        return true
    }
}

export const getBookmarks = async (userId: string) => {
    const q = query(
        collection(db, 'bookmarks'),
        where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    const bookmarks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
    return bookmarks.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
}

export const checkIsBookmarked = async (userId: string, resourceId: string) => {
    const docRef = doc(db, 'bookmarks', `${userId}_${resourceId}`)
    const docSnap = await getDoc(docRef)
    return docSnap.exists()
}

// ================== PROGRESS ==================
export const updateProgress = async (userId: string, resourceId: string, status: 'not_started' | 'in_progress' | 'completed', percentage: number = 0) => {
    const progressRef = doc(db, 'progress', `${userId}_${resourceId}`)
    await setDoc(progressRef, {
        userId,
        resourceId,
        status,
        percentage,
        lastAccessed: serverTimestamp()
    }, { merge: true })

    if (status === 'completed') {
        await checkAndUnlockAchievements(userId)
    }
}

export const getProgress = async (userId: string, resourceId: string) => {
    const progressRef = doc(db, 'progress', `${userId}_${resourceId}`)
    const progressSnap = await getDoc(progressRef)
    return progressSnap.exists() ? progressSnap.data() : null
}

export const getUserProgress = async (userId: string) => {
    const q = query(
        collection(db, 'progress'),
        where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data())
}

// ================== COMMENTS ==================
export const addComment = async (resourceId: string, userId: string, userName: string, text: string) => {
    await addDoc(collection(db, 'comments'), {
        resourceId,
        userId,
        userName,
        text,
        createdAt: serverTimestamp()
    })
    await logActivity(userId, 'comment', resourceId, '', 'أضاف تعليق')
}

export const getResourceComments = async (resourceId: string) => {
    const q = query(
        collection(db, 'comments'),
        where('resourceId', '==', resourceId)
    )
    const snapshot = await getDocs(q)
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
    return comments.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
}

// ================== RATINGS ==================
export const addRating = async (resourceId: string, userId: string, rating: number) => {
    const ratingRef = doc(db, 'ratings', `${userId}_${resourceId}`)
    await setDoc(ratingRef, {
        userId,
        resourceId,
        rating,
        updatedAt: serverTimestamp()
    })
    await logActivity(userId, 'rating', resourceId, '', `قيّم بـ ${rating} نجوم`)
}

export const getResourceRating = async (resourceId: string) => {
    const q = query(
        collection(db, 'ratings'),
        where('resourceId', '==', resourceId)
    )
    const snapshot = await getDocs(q)
    const ratings = snapshot.docs.map(doc => doc.data().rating)

    if (ratings.length === 0) return { average: 0, count: 0 }

    const sum = ratings.reduce((a, b) => a + b, 0)
    return {
        average: parseFloat((sum / ratings.length).toFixed(1)),
        count: ratings.length
    }
}

export const getUserRating = async (userId: string, resourceId: string) => {
    const ratingRef = doc(db, 'ratings', `${userId}_${resourceId}`)
    const ratingSnap = await getDoc(ratingRef)
    return ratingSnap.exists() ? ratingSnap.data().rating : 0
}

// ================== NOTES ==================
export const saveNote = async (userId: string, resourceId: string, content: string) => {
    const noteRef = doc(db, 'notes', `${userId}_${resourceId}`)
    const noteSnap = await getDoc(noteRef)

    if (noteSnap.exists()) {
        await updateDoc(noteRef, {
            content,
            updatedAt: serverTimestamp()
        })
    } else {
        await setDoc(noteRef, {
            userId,
            resourceId,
            content,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })
    }
    await logActivity(userId, 'note', resourceId, '', 'حفظ ملاحظة')
}

export const getNote = async (userId: string, resourceId: string) => {
    const noteRef = doc(db, 'notes', `${userId}_${resourceId}`)
    const noteSnap = await getDoc(noteRef)
    return noteSnap.exists() ? noteSnap.data() : null
}

export const getUserNotes = async (userId: string) => {
    const q = query(
        collection(db, 'notes'),
        where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// ================== CHAT HISTORY ==================
export const saveChatHistory = async (userId: string, messages: Array<{ role: string; content: string }>) => {
    const chatRef = doc(db, 'chatHistory', userId)
    await setDoc(chatRef, {
        userId,
        messages,
        updatedAt: serverTimestamp()
    }, { merge: true })
}

export const getChatHistory = async (userId: string) => {
    const chatRef = doc(db, 'chatHistory', userId)
    const chatSnap = await getDoc(chatRef)
    return chatSnap.exists() ? chatSnap.data().messages : []
}

// ================== ACTIVITY LOG ==================
export const logActivity = async (
    userId: string,
    type: 'bookmark' | 'download' | 'complete' | 'rating' | 'comment' | 'note',
    resourceId: string = '',
    resourceTitle: string = '',
    details: string
) => {
    await addDoc(collection(db, 'activities'), {
        userId,
        type,
        resourceId,
        resourceTitle,
        details,
        createdAt: serverTimestamp()
    })
}

export const getUserActivities = async (userId: string, limit: number = 50) => {
    const q = query(
        collection(db, 'activities'),
        where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
    return activities
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, limit)
}

// ================== ACHIEVEMENTS ==================
export const checkAndUnlockAchievements = async (userId: string) => {
    const bookmarks = await getBookmarks(userId)
    const progress = await getUserProgress(userId)
    const completedCount = progress.filter((p: any) => p.status === 'completed').length

    const achievements = [
        { type: 'first_bookmark', title: 'أول خطوة', description: 'حفظت أول مورد', icon: '🎯', condition: bookmarks.length >= 1 },
        { type: 'bookworm', title: 'محب القراءة', description: 'حفظت 10 موارد', icon: '📚', condition: bookmarks.length >= 10 },
        { type: 'collector', title: 'جامع الكنوز', description: 'حفظت 50 مورد', icon: '💎', condition: bookmarks.length >= 50 },
        { type: 'first_complete', title: 'إنجاز أول', description: 'أكملت أول مورد', icon: '✅', condition: completedCount >= 1 },
        { type: 'achiever', title: 'المنجز', description: 'أكملت 5 موارد', icon: '🏆', condition: completedCount >= 5 },
        { type: 'master', title: 'الأستاذ', description: 'أكملت 20 مورد', icon: '👑', condition: completedCount >= 20 },
    ]

    for (const achievement of achievements) {
        if (achievement.condition) {
            await unlockAchievement(userId, achievement)
        }
    }
}

const unlockAchievement = async (userId: string, achievement: any) => {
    const achRef = doc(db, 'achievements', `${userId}_${achievement.type}`)
    const achSnap = await getDoc(achRef)

    if (!achSnap.exists()) {
        await setDoc(achRef, {
            userId,
            type: achievement.type,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            unlockedAt: serverTimestamp()
        })
    }
}

export const getUserAchievements = async (userId: string) => {
    const q = query(
        collection(db, 'achievements'),
        where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    const achievements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
    return achievements.sort((a, b) => (b.unlockedAt?.seconds || 0) - (a.unlockedAt?.seconds || 0))
}

// ================== STATISTICS ==================
export const getUserStats = async (userId: string) => {
    const bookmarks = await getBookmarks(userId)
    const progress = await getUserProgress(userId)
    const activities = await getUserActivities(userId, 100)
    const achievements = await getUserAchievements(userId)
    const notes = await getUserNotes(userId)

    // Fetch user doc (for cached counts)
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)
    const userData = userDocSnap.exists() ? userDocSnap.data() : {}

    const completedCount = progress.filter((p: any) => p.status === 'completed').length
    const inProgressCount = progress.filter((p: any) => p.status === 'in_progress').length

    // Calculate total points (or use cached)
    const calculatedPoints = (completedCount * 50) + (bookmarks.length * 10) + (activities.length * 5) + (achievements.length * 100)

    return {
        bookmarksCount: bookmarks.length,
        completedCount,
        inProgressCount,
        activitiesCount: activities.length,
        achievementsCount: achievements.length,
        notesCount: notes.length,
        lastActivity: activities[0] || null,
        totalPoints: calculatedPoints,
        followersCount: userData.followersCount || 0,
        followingCount: userData.followingCount || 0
    }
}

// ================== LEADERBOARD ==================
export const getLeaderboard = async () => {
    // fetching all users requires a collection for user profiles
    // Assuming 'users' collection exists or we create one on login
    // For now, we simulate pulling top users or use a dedicated 'leaderboard' collection

    // REAL IMPLEMENTATION: query(collection(db, 'users'), orderBy('points', 'desc'), limit(10))
    // Since we don't have a 'users' collection with points yet, we'll fetch from a new 'leaderboard' collection

    const q = query(
        collection(db, 'leaderboard'),
        orderBy('points', 'desc'),
        limit(10)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const updateLeaderboardEntry = async (user: any) => {
    if (!user) return


    const stats = await getUserStats(user.uid)
    const userRef = doc(db, 'leaderboard', user.uid)

    await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || 'مستخدم مجهول',
        photoURL: user.photoURL || '',
        points: stats.totalPoints,
        achievements: stats.achievementsCount,
        lastActive: serverTimestamp()
    }, { merge: true })
}


// ================== SOCIAL ==================

export const followUser = async (currentUserId: string, targetUserId: string) => {
    if (currentUserId === targetUserId) return;

    const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
    const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId);

    await Promise.all([
        setDoc(followingRef, {
            uid: targetUserId,
            createdAt: serverTimestamp()
        }),
        setDoc(followerRef, {
            uid: currentUserId,
            createdAt: serverTimestamp()
        })
    ]);

    // Update counts (optional, but good for performance)
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);

    await Promise.all([
        updateDoc(currentUserRef, { followingCount: increment(1) }).catch(() => setDoc(currentUserRef, { followingCount: 1 }, { merge: true })),
        updateDoc(targetUserRef, { followersCount: increment(1) }).catch(() => setDoc(targetUserRef, { followersCount: 1 }, { merge: true }))
    ]);
}

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
    const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId);

    await Promise.all([
        deleteDoc(followingRef),
        deleteDoc(followerRef)
    ]);

    // Update counts
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);

    await Promise.all([
        updateDoc(currentUserRef, { followingCount: increment(-1) }).catch(() => { }),
        updateDoc(targetUserRef, { followersCount: increment(-1) }).catch(() => { })
    ]);
}

export const checkIsFollowing = async (currentUserId: string, targetUserId: string) => {
    const docRef = doc(db, 'users', currentUserId, 'following', targetUserId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
}

export const getFollowers = async (userId: string) => {
    const q = query(collection(db, 'users', userId, 'followers'));
    const snapshot = await getDocs(q);
    const followerIds = snapshot.docs.map(doc => doc.id);

    // Fetch user details for each follower
    if (followerIds.length === 0) return [];

    const followers = await Promise.all(followerIds.map(async (id) => {
        const userDoc = await getDoc(doc(db, 'users', id));
        return userDoc.exists() ? { uid: userDoc.id, ...userDoc.data() } : null;
    }));

    return followers.filter(f => f !== null);
}

export const getFollowing = async (userId: string) => {
    const q = query(collection(db, 'users', userId, 'following'));
    const snapshot = await getDocs(q);
    const followingIds = snapshot.docs.map(doc => doc.id);

    if (followingIds.length === 0) return [];

    const following = await Promise.all(followingIds.map(async (id) => {
        const userDoc = await getDoc(doc(db, 'users', id));
        return userDoc.exists() ? { uid: userDoc.id, ...userDoc.data() } : null;
    }));

    return following.filter(f => f !== null);
}

export const getUserProfile = async (userId: string) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
        return { uid: userDoc.id, ...userDoc.data() };
    }
    return null;
}

export const updateUserProfile = async (userId: string, profileData: {
    username?: string;
    fullName?: string;
    bio?: string;
    program?: string;
    location?: string;
    socialLinks?: {
        github?: string;
        linkedin?: string;
        website?: string;
    };
}) => {
    const userRef = doc(db, 'users', userId);

    // If username is being set, check uniqueness (excluding current user)
    if (profileData.username) {
        const usernameQuery = query(
            collection(db, 'users'),
            where('username', '==', profileData.username.toLowerCase())
        );
        const usernameSnap = await getDocs(usernameQuery);
        const existingUser = usernameSnap.docs.find(d => d.id !== userId);
        if (existingUser) {
            throw new Error('USERNAME_TAKEN');
        }
    }

    // Update the user document
    // We also update displayName to match fullName if provided
    const updateData: any = {
        ...profileData,
        updatedAt: serverTimestamp()
    }

    if (profileData.fullName) {
        updateData.displayName = profileData.fullName
    }

    if (profileData.username) {
        updateData.username = profileData.username.toLowerCase()
    }

    await setDoc(userRef, updateData, { merge: true });
}

// ================== STUDENT MESSAGES (TESTIMONIALS) ==================
export interface StudentMessage {
    id?: string
    name: string
    message: string
    grade: string
    rating: number
    createdAt?: any
    approved?: boolean
}

export const getStudentMessages = async (): Promise<StudentMessage[]> => {
    const q = query(
        collection(db, 'studentMessages'),
        orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as StudentMessage[]
}

export const addStudentMessage = async (msg: Omit<StudentMessage, 'id' | 'createdAt' | 'approved'>) => {
    await addDoc(collection(db, 'studentMessages'), {
        ...msg,
        createdAt: serverTimestamp(),
        approved: true,
    })
}

export const seedStudentMessages = async (messages: Omit<StudentMessage, 'id' | 'createdAt'>[]) => {
    // Check if collection already has data
    const existing = await getDocs(query(collection(db, 'studentMessages'), limit(1)))
    if (!existing.empty) {
        console.log('Student messages already seeded.')
        return false
    }

    // Seed all messages
    for (const msg of messages) {
        await addDoc(collection(db, 'studentMessages'), {
            ...msg,
            createdAt: serverTimestamp(),
            approved: true,
        })
    }
    console.log(`Seeded ${messages.length} student messages.`)
    return true
}
