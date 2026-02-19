export interface Task {
    id: number;
    name: string;
    distributionDate: string;
    submissionDate: string;
}

export interface Unit {
    id: number;
    unitNumber: number;
    name: string;
    guideId?: string;
    tasks: Task[];
}

export interface Semester {
    id: number;
    number: number;
    name: string;
    color: string;
    gradientFrom: string;
    gradientTo: string;
    units: Unit[];
    resubmission?: {
        period: string;
        note: string;
    };
}

export interface Level {
    id: string;
    name: string;
    nameAr: string;
    semesters: Semester[];
}

export const levels: Level[] = [
    {
        id: "level2",
        name: "الصف العاشر",
        nameAr: "الصف العاشر",
        semesters: [
            {
                id: 1,
                number: 1,
                name: "الفصل الدراسي الأول",
                color: "#3b82f6",
                gradientFrom: "#3b82f6",
                gradientTo: "#60a5fa",
                units: [
                    {
                        id: 1,
                        unitNumber: 1,
                        name: "استخدام تكنولوجيا المعلومات (Using Technology)",
                        guideId: "it-support",
                        tasks: [
                            {
                                id: 1,
                                name: "المهمة الكاملة",
                                distributionDate: "11 سبتمبر",
                                submissionDate: "13 نوفمبر",
                            },
                        ],
                    },
                    {
                        id: 2,
                        unitNumber: 2,
                        name: "نمذجة البيانات (Data Modelling)",
                        guideId: "data-modeling",
                        tasks: [
                            {
                                id: 1,
                                name: "المهمة الكاملة",
                                distributionDate: "16 نوفمبر",
                                submissionDate: "20 نوفمبر",
                            },
                        ],
                    },
                ],
                resubmission: {
                    period: "بعد انتهاء الفصل الأول",
                    note: "خلال 15 يوم عمل",
                },
            },
            {
                id: 2,
                number: 2,
                name: "الفصل الدراسي الثاني",
                color: "#a855f7",
                gradientFrom: "#a855f7",
                gradientTo: "#c084fc",
                units: [
                    {
                        id: 3,
                        unitNumber: 3,
                        name: "الشبكات (Networks)",
                        guideId: "networks",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "24 ديسمبر",
                                submissionDate: "30 ديسمبر",
                            },
                            {
                                id: 2,
                                name: "هدف ب & ج (Goal B & C)",
                                distributionDate: "2 مارس",
                                submissionDate: "8 مارس",
                            },
                        ],
                    },
                    {
                        id: 4,
                        unitNumber: 4,
                        name: "البرمجة (Programming)",
                        guideId: "programming",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "21 ديسمبر",
                                submissionDate: "23 ديسمبر",
                            },
                            {
                                id: 2,
                                name: "هدف ب & ج (Goal B & C)",
                                distributionDate: "25 فبراير",
                                submissionDate: "1 مارس",
                            },
                        ],
                    },
                    {
                        id: 5,
                        unitNumber: 5,
                        name: "الرسومات (Graphics)",
                        guideId: "graphics",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "14 ديسمبر",
                                submissionDate: "16 ديسمبر",
                            },
                            {
                                id: 2,
                                name: "هدف ب & ج (Goal B & C)",
                                distributionDate: "19 فبراير",
                                submissionDate: "24 فبراير",
                            },
                        ],
                    },
                ],
                resubmission: {
                    period: "بعد انتهاء الفصل الثاني",
                    note: "خلال 15 يوم عمل",
                },
            },
            {
                id: 3,
                number: 3,
                name: "الفصل الدراسي الثالث",
                color: "#22c55e",
                gradientFrom: "#22c55e",
                gradientTo: "#4ade80",
                units: [
                    {
                        id: 6,
                        unitNumber: 6,
                        name: "تطوير الويب (Web Development)",
                        guideId: "web",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "26 مارس",
                                submissionDate: "30 مارس",
                            },
                            {
                                id: 2,
                                name: "هدف ب & ج (Goal B & C)",
                                distributionDate: "24 مايو",
                                submissionDate: "4 يونيو",
                            },
                        ],
                    },
                    {
                        id: 7,
                        unitNumber: 7,
                        name: "التطبيقات (Applications)",
                        guideId: "apps",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "31 مارس",
                                submissionDate: "2 أبريل",
                            },
                            {
                                id: 2,
                                name: "هدف ب & ج (Goal B & C)",
                                distributionDate: "18 مايو",
                                submissionDate: "24 مايو",
                            },
                        ],
                    },
                    {
                        id: 8,
                        unitNumber: 8,
                        name: "الألعاب (Games)",
                        guideId: "games",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "2 أبريل",
                                submissionDate: "8 أبريل",
                            },
                            {
                                id: 2,
                                name: "هدف ب & ج (Goal B & C)",
                                distributionDate: "10 مايو",
                                submissionDate: "14 مايو",
                            },
                        ],
                    },
                ],
                resubmission: {
                    period: "بعد انتهاء الفصل الثالث",
                    note: "خلال 15 يوم عمل",
                },
            },
        ],
    },
    {
        id: "level3y1",
        name: "الأول ثانوي",
        nameAr: "الصف الأول ثانوي",
        semesters: [
            {
                id: 1,
                number: 1,
                name: "الفصل الدراسي الأول",
                color: "#3b82f6",
                gradientFrom: "#3b82f6",
                gradientTo: "#60a5fa",
                units: [
                    {
                        id: 1,
                        unitNumber: 1,
                        name: "انظمة تكنولوجيا (Technology Systems)",
                        guideId: "tech-systems",
                        tasks: [
                            {
                                id: 1,
                                name: "المهمة الكاملة",
                                distributionDate: "9 نوفمبر",
                                submissionDate: "13 نوفمبر",
                            },
                        ],
                    },
                ],
                resubmission: {
                    period: "بعد انتهاء الفصل الأول",
                    note: "خلال 15 يوم عمل",
                },
            },
            {
                id: 2,
                number: 2,
                name: "الفصل الدراسي الثاني",
                color: "#a855f7",
                gradientFrom: "#a855f7",
                gradientTo: "#c084fc",
                units: [
                    {
                        id: 2,
                        unitNumber: 2,
                        name: "تطوير الويب (Web Funding)",
                        guideId: "web-dev",
                        tasks: [
                            {
                                id: 1,
                                name: "المهمة الكاملة",
                                distributionDate: "1 مارس",
                                submissionDate: "8 مارس",
                            },
                        ],
                    },
                    {
                        id: 3,
                        unitNumber: 3,
                        name: "تطوير التطبيقات (Mobile Apps)",
                        guideId: "apps-dev",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "28 ديسمبر",
                                submissionDate: "30 ديسمبر",
                            },
                            {
                                id: 2,
                                name: "هدف ب & ج (Goal B & C)",
                                distributionDate: "22 فبراير",
                                submissionDate: "1 مارس",
                            },
                        ],
                    },
                ],
                resubmission: {
                    period: "بعد انتهاء الفصل الثاني",
                    note: "خلال 15 يوم عمل",
                },
            },
            {
                id: 3,
                number: 3,
                name: "الفصل الدراسي الثالث",
                color: "#22c55e",
                gradientFrom: "#22c55e",
                gradientTo: "#4ade80",
                units: [
                    {
                        id: 4,
                        unitNumber: 4,
                        name: "الدعم الفني (Technical Support)",
                        guideId: "tech-support",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "31 مارس",
                                submissionDate: "5 أبريل",
                            },
                            {
                                id: 2,
                                name: "هدف ب (Goal B)",
                                distributionDate: "23 أبريل",
                                submissionDate: "30 أبريل",
                            },
                            {
                                id: 3,
                                name: "هدف ج (Goal C)",
                                distributionDate: "20 مايو",
                                submissionDate: "4 يونيو",
                            },
                        ],
                    },
                    {
                        id: 5,
                        unitNumber: 5,
                        name: "تصميم الألعاب (Game Design)",
                        guideId: "game-design",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "2 أبريل",
                                submissionDate: "7 أبريل",
                            },
                            {
                                id: 2,
                                name: "هدف ب & ج (Goal B & C)",
                                distributionDate: "11 مايو",
                                submissionDate: "20 مايو",
                            },
                        ],
                    },
                ],
                resubmission: {
                    period: "بعد انتهاء الفصل الثالث",
                    note: "خلال 15 يوم عمل",
                },
            },
        ],
    },
    {
        id: "level3y2",
        name: "التوجيهي",
        nameAr: "الصف الثاني ثانوي",
        semesters: [
            {
                id: 1,
                number: 1,
                name: "الفصل الدراسي الأول",
                color: "#3b82f6",
                gradientFrom: "#3b82f6",
                gradientTo: "#60a5fa",
                units: [
                    {
                        id: 1,
                        unitNumber: 1,
                        name: "الأمن السيبراني (Cyber Security)",
                        guideId: "cyber-security",
                        tasks: [
                            {
                                id: 1,
                                name: "المهمة الكاملة",
                                distributionDate: "16 نوفمبر",
                                submissionDate: "23 نوفمبر",
                            },
                        ],
                    },
                    {
                        id: 2,
                        unitNumber: 2,
                        name: "الذكاء الاصطناعي (AI)",
                        guideId: "ai",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "11 نوفمبر",
                                submissionDate: "16 نوفمبر",
                            },
                        ],
                    },
                ],
                resubmission: {
                    period: "بعد انتهاء الفصل الأول",
                    note: "خلال 15 يوم عمل",
                },
            },
            {
                id: 2,
                number: 2,
                name: "الفصل الدراسي الثاني",
                color: "#a855f7",
                gradientFrom: "#a855f7",
                gradientTo: "#c084fc",
                units: [
                    {
                        id: 2,
                        unitNumber: 2,
                        name: "الذكاء الاصطناعي (AI) - استكمال",
                        guideId: "ai-cont",
                        tasks: [
                            {
                                id: 2,
                                name: "هدف ب & ج (Goal B & C)",
                                distributionDate: "19 فبراير",
                                submissionDate: "24 فبراير",
                            },
                        ],
                    },
                    {
                        id: 3,
                        unitNumber: 3,
                        name: "البرمجة (Programming)",
                        guideId: "programming-adv",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "28 ديسمبر",
                                submissionDate: "31 ديسمبر",
                            },
                            {
                                id: 2,
                                name: "هدف ب & ج (Goal B & C)",
                                distributionDate: "2 مارس",
                                submissionDate: "8 مارس",
                            },
                        ],
                    },
                    {
                        id: 4,
                        unitNumber: 4,
                        name: "أداة المشاريع (IT Project Management)",
                        guideId: "project-tool",
                        tasks: [
                            {
                                id: 1,
                                name: "هدف أ (Goal A)",
                                distributionDate: "9 مارس",
                                submissionDate: "12 مارس",
                            },
                        ],
                    },
                ],
                resubmission: {
                    period: "بعد انتهاء الفصل الثاني",
                    note: "خلال 15 يوم عمل",
                },
            },
            {
                id: 3,
                number: 3,
                name: "الفصل الدراسي الثالث",
                color: "#22c55e",
                gradientFrom: "#22c55e",
                gradientTo: "#4ade80",
                units: [
                    {
                        id: 4,
                        unitNumber: 4,
                        name: "أداة المشاريع (IT Project Management) - استكمال",
                        guideId: "project-tool-cont",
                        tasks: [
                            {
                                id: 2,
                                name: "هدف ب & ج (Goal B & C)",
                                distributionDate: "7 أبريل",
                                submissionDate: "12 أبريل",
                            },
                        ],
                    },
                ],
                resubmission: {
                    period: "بعد انتهاء الفصل الثالث",
                    note: "خلال 15 يوم عمل",
                },
            },
        ],
    },
];
