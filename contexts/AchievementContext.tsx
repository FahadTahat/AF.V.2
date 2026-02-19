"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ACHIEVEMENTS, Achievement } from '@/lib/achievements-data';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy } from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Ensure this path is correct

interface UserProgress {
    [achievementId: string]: number;
}

interface UserUnlocked {
    [achievementId: string]: boolean;
}

interface AchievementContextType {
    progress: UserProgress;
    unlocked: UserUnlocked;
    incrementProgress: (achievementId: string, amount?: number) => void;
    unlockAchievement: (achievementId: string) => void;
    addXP: (amount: number) => void;
    totalXP: number;
    level: number;
    isLoading: boolean;
}

const AchievementContext = createContext<AchievementContextType>({} as AchievementContextType);

export function useAchievements() {
    return useContext(AchievementContext);
}

export function AchievementProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { language } = useLanguage();

    const [progress, setProgress] = useState<UserProgress>({});
    const [unlocked, setUnlocked] = useState<UserUnlocked>({});
    const [totalXP, setTotalXP] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Load Data (Firestore or LocalStorage)
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            if (!user) {
                // Guest Mode: Load from LocalStorage
                const savedProgress = localStorage.getItem('guest_achievements_progress');
                const savedUnlocked = localStorage.getItem('guest_achievements_unlocked');
                if (savedProgress) setProgress(JSON.parse(savedProgress));
                if (savedUnlocked) setUnlocked(JSON.parse(savedUnlocked));
                setIsLoading(false);
                return;
            }

            try {
                // User Mode: Load from Firestore
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const firestoreProgress = data.achievementsProgress || {};
                    const firestoreUnlocked = data.achievementsUnlocked || {};

                    setProgress(firestoreProgress);
                    setUnlocked(firestoreUnlocked);

                    // Sync: If local has more progress (offline mode scenario), merge.
                    // For now, we trust Firestore as source of truth.
                } else {
                    // Initialize user doc if not exists
                    await setDoc(userRef, {
                        achievementsProgress: {},
                        achievementsUnlocked: {},
                        xp: 0
                    }, { merge: true });
                }
            } catch (error) {
                console.error("Error loading achievements:", error);
                // Fallback to local storage if offline? 
                // For simplicity, we just log error.
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]);

    // Check Seasonal Achievements (Ramadan)
    useEffect(() => {
        if (isLoading) return;

        const checkSeasonal = () => {
            const now = new Date();
            const month = now.getMonth(); // 0-indexed (Feb is 1, Mar is 2)
            const day = now.getDate();

            // Ramadan 2026: Approx Feb 18 - Mar 19
            const isRamadan = (month === 1 && day >= 18) || (month === 2 && day <= 19);

            if (isRamadan) {
                if (!unlocked['ramadan_kareem']) {
                    unlockAchievement('ramadan_kareem');
                }
            }
        };

        // Small delay to ensure data is loaded
        const timer = setTimeout(checkSeasonal, 2000);
        return () => clearTimeout(timer);
    }, [isLoading, unlocked]); // Re-run if unlocked changes to avoid infinite loop if logic flaw, but standard check is safe

    // 2. Calculate Total XP & Level
    useEffect(() => {
        let xp = 0;
        ACHIEVEMENTS.forEach(ach => {
            if (unlocked[ach.id]) {
                xp += ach.xp;
            }
        });
        setTotalXP(xp);
    }, [unlocked]);

    const level = Math.floor(totalXP / 500) + 1;

    // 2.5 Manual XP Addition (e.g. for Daily Challenges)
    const addXP = async (amount: number) => {
        const newTotalXP = totalXP + amount;
        setTotalXP(newTotalXP);

        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    xp: increment(amount)
                });
            } catch (error) {
                console.error("Error adding XP:", error);
                // Revert state if failed? For now, we trust optimistic update
            }
        }

        // Toast for XP Gain
        toast.success(`+${amount} XP`, {
            description: "تمت إضافة نقاط التحدي!",
            style: { background: '#0f172a', color: '#fbbf24', border: '1px solid #fbbf24' }
        });
    };

    // 3. Save Data (Firestore & LocalStorage)
    const saveProgress = async (newProgress: UserProgress, newUnlocked: UserUnlocked) => {
        // Always save to LocalStorage for instant access/backup
        const keyPrefix = user ? `achievements_` + user.uid : `guest_achievements`;
        localStorage.setItem(`${keyPrefix}_progress`, JSON.stringify(newProgress));
        localStorage.setItem(`${keyPrefix}_unlocked`, JSON.stringify(newUnlocked));

        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    achievementsProgress: newProgress,
                    achievementsUnlocked: newUnlocked,
                    xp: totalXP // Save total XP for leaderboard!
                });
            } catch (error) {
                console.error("Error saving to Firestore:", error);
            }
        }
    };

    const unlockAchievement = (id: string) => {
        if (unlocked[id]) return;

        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        if (!achievement) return;

        const newUnlocked = { ...unlocked, [id]: true };
        setUnlocked(newUnlocked);
        saveProgress(progress, newUnlocked);

        // Celebration Toast
        toast.success(
            <div className="flex flex-col gap-1 min-w-[200px]">
                <div className="font-bold flex items-center gap-2 text-yellow-400">
                    <Trophy className="w-5 h-5 fill-yellow-400 text-yellow-500" />
                    {language === 'ar' ? 'إنجاز جديد!' : 'Achievement Unlocked!'}
                </div>
                <div className="text-base font-bold text-white">
                    {language === 'ar' ? achievement.titleAr : achievement.titleEn}
                </div>
                <div className="text-xs text-slate-300">
                    {language === 'ar' ? achievement.descriptionAr : achievement.descriptionEn}
                </div>
                <div className="text-xs font-bold text-yellow-500 mt-1 flex items-center gap-1">
                    +{achievement.xp} XP
                </div>
            </div>,
            {
                duration: 6000,
                position: language === 'ar' ? 'bottom-left' : 'bottom-right',
                style: {
                    border: '2px solid rgba(234, 179, 8, 0.5)',
                    background: 'rgba(10, 10, 20, 0.95)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                }
            }
        );
    };

    const incrementProgress = (id: string, amount: number = 1) => {
        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        if (!achievement) return;
        if (unlocked[id]) return;

        const current = progress[id] || 0;
        const newProgressValue = Math.min(current + amount, achievement.maxProgress);

        // Check if actually changed
        if (newProgressValue === current) return;

        const newProgress = { ...progress, [id]: newProgressValue };
        setProgress(newProgress);

        // If reached max, unlock
        if (newProgressValue >= achievement.maxProgress) {
            unlockAchievement(id);
        } else {
            // Just save progress
            saveProgress(newProgress, unlocked);
        }
    };

    return (
        <AchievementContext.Provider value={{ progress, unlocked, incrementProgress, unlockAchievement, addXP, totalXP, level, isLoading }}>
            {children}
        </AchievementContext.Provider>
    );
}
