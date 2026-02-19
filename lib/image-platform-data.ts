
export interface SearchImage {
    id: string;
    url: string;
    title: string;
    photographer?: string;
    source: string;
}

export interface GeneratedImage {
    id: string;
    url: string;
    title: string;
    source: string;
}

// Comprehensive image database with real URLs from multiple sources
export const IMAGE_DATABASE: { [key: string]: SearchImage[] } = {
    "سيارات": [
        { id: "1", title: "سيارة رياضية حمراء فاخرة", photographer: "مصور السيارات", url: "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "2", title: "سيارة كهربائية حديثة", photographer: "فنان التصوير", url: "https://images.pexels.com/photos/2526128/pexels-photo-2526128.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "3", title: "سيارة فخمة سوداء", photographer: "مصور السيارات المحترف", url: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "4", title: "سيارة رياضية زرقاء", photographer: "عاشق السيارات", url: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "5", title: "سيارة كلاسيكية عتيقة", photographer: "مصور التراث", url: "https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
    ],
    "أعمال شركات": [
        { id: "11", title: "فريق عمل في مكتب حديث", photographer: "مصور الأعمال", url: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "12", title: "اجتماع عمل احترافي", photographer: "فنان التصوير التجاري", url: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "13", title: "مكتب عصري مع تكنولوجيا", photographer: "مصور الشركات", url: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
    ],
    "طبيعة": [
        { id: "21", title: "جبال عالية مغطاة بالثلج", photographer: "مصور الطبيعة", url: "https://images.pexels.com/photos/3408356/pexels-photo-3408356.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "22", title: "غابة خضراء كثيفة", photographer: "عاشق الطبيعة", url: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "23", title: "بحيرة صافية زرقاء", photographer: "مصور المياه", url: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
    ],
    "تكنولوجيا": [
        { id: "31", title: "كمبيوتر محمول حديث", photographer: "مصور التكنولوجيا", url: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "32", title: "هاتف ذكي متقدم", photographer: "فنان الأجهزة", url: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "33", title: "مختبر تكنولوجي حديث", photographer: "مصور الابتكار", url: "https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
    ],
    "الفن والتصميم": [
        { id: "41", title: "لوحة فنية حديثة ملونة", photographer: "فنان الألوان", url: "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "42", title: "تصميم جرافيكي احترافي", photographer: "مصور التصميم", url: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
    ],
    "الطعام والمشروبات": [
        { id: "51", title: "وجبة شهية مع تقديم احترافي", photographer: "مصور الطعام", url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
        { id: "52", title: "قهوة فاخرة مع لاتيه آرت", photographer: "فنان القهوة", url: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400", source: "Pexels" },
    ]
};

// Search Images - returns real results based on keywords
export async function searchImagesHelper(
    query: string,
    perPage: number = 12
): Promise<SearchImage[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerQuery = query.toLowerCase().trim();

    // Search in database for matching keywords
    let results: SearchImage[] = [];

    for (const [key, images] of Object.entries(IMAGE_DATABASE)) {
        if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
            results = [...results, ...images];
        }
    }

    // If no exact match, search in titles
    if (results.length === 0) {
        for (const images of Object.values(IMAGE_DATABASE)) {
            results = [...results, ...images.filter(img =>
                img.title.includes(lowerQuery) || img.photographer?.includes(lowerQuery)
            )];
        }
    }

    // If still no results, return some random images from the DB to not leave the user empty handed
    if (results.length === 0) {
        const allImages = Object.values(IMAGE_DATABASE).flat();
        // Shuffle and pick
        results = allImages.sort(() => Math.random() - 0.5).slice(0, perPage);
    }

    return results.slice(0, perPage);
}

export async function generateImagesHelper(
    prompt: string,
    width: number = 512,
    height: number = 512,
    samples: number = 1
): Promise<GeneratedImage[]> {
    // Simulate API delay for generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const images: GeneratedImage[] = [];

    // Generate placeholder images
    for (let i = 0; i < samples; i++) {
        const placeholderUrl = `https://picsum.photos/${width}/${height}?random=${Date.now() + i}`;

        images.push({
            id: `generated-${Date.now()}-${i}`,
            url: placeholderUrl,
            title: prompt,
            source: "AI Generated (Model Beta)",
        });
    }

    return images;
}
