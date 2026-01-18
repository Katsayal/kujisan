import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true, // true for production, false for development
});

// --- INTERFACES ---

export interface HomepageData {
  hero: {
    title: string;
    subtitle?: string;
    heroImage?: any;
  };
  about: {
    title: string;
    image?: any;
    content?: any;
  };
  stats: {
    children: number;
    grandchildren: number;
    greatGrandchildren: number;
  };
  latestAlbums: {
    _id: string;
    title: string;
    slug: { current: string };
    coverImage: any;
    date?: string;
  }[];
}

export interface MinimalPerson {
  _id: string;
  fullName: string;
  slug: { current: string };
  profileImage?: any;
  sex: 'male' | 'female';
  isDescendant: boolean;
  generation?: number; // <--- NEW: Added Generation Level
  birthDate?: string;  // <--- NEW: Added for sorting
}

export interface PersonDetail extends MinimalPerson {
  birthDate?: string;
  deathDate?: string;
  isDeceased: boolean;

  audioGallery?: {
    url: string;
    title: string;
  }[];
  
  bio?: any;
  gallery?: any[];
  
  relevantFamily?: {
    slug: { current: string };
    familyName: string;
  };

  parentsData: {
    _id: string;
    partners: (MinimalPerson & {
      parents: MinimalPerson[];
    })[];
    children: MinimalPerson[]; 
  }[];

  unionsData: {
    _id: string;
    marriageDate?: string;
    partners: MinimalPerson[];
    children: MinimalPerson[];
  }[];
}

export interface FamilyPageData {
  _id: string;
  familyName: string;
  slug: { current: string };
  mainImage?: any;
  familyBio?: any;
  familyAudioUrl?: string;
  gallery?: any[];
  
  headOfFamily: MinimalPerson;
  wives: MinimalPerson[];
  children: (MinimalPerson & { birthDate?: string })[];
}

export interface FamilyDirectoryItem {
  _id: string;
  familyName: string;
  slug: { current: string };
  mainImage?: any;
  headOfFamily: {
    fullName: string;
    birthDate?: string;
  };
  wivesCount: number;
  childrenCount: number;
}

export interface PhotoAlbum {
  _id: string;
  title: string;
  slug: { current: string };
  date?: string;
  coverImage: any;
  description?: string;
  images?: any[];
}

// --- FETCH FUNCTIONS ---

export const getHomepageData = async (): Promise<HomepageData> => {
  const query = `{
    // 1. Fetch Site Settings (Hero & About)
    "settings": *[_type == "siteSettings"][0] {
      heroTitle,
      heroSubtitle,
      heroImage,
      aboutTitle,
      aboutImage,
      aboutContent
    },

    // 2. Calculate Live Stats based on Generation & Lineage
    "stats": {
      "children": count(*[_type == "person" && isDescendant == true && generation == 2]),
      "grandchildren": count(*[_type == "person" && isDescendant == true && generation == 3]),
      "greatGrandchildren": count(*[_type == "person" && isDescendant == true && generation == 4])
    },

    // 3. Fetch 3 Latest Photo Albums
    "latestAlbums": *[_type == "photoAlbum"] | order(date desc)[0...3] {
      _id, title, slug, coverImage, date
    }
  }`;

  const result = await client.fetch(query);

  return {
    hero: {
      title: result.settings?.heroTitle || "KUJISAN",
      subtitle: result.settings?.heroSubtitle,
      heroImage: result.settings?.heroImage,
    },
    about: {
      title: result.settings?.aboutTitle || "Our Legacy",
      image: result.settings?.aboutImage,
      content: result.settings?.aboutContent,
    },
    stats: result.stats,
    latestAlbums: result.latestAlbums || [],
  };
};

export const getPerson = async (slug: string): Promise<PersonDetail | null> => {
  const query = `*[_type == "person" && slug.current == $slug][0] {
    ...,
    
    // Fetch new Audio Array
    "audioGallery": audioGallery[]{
      "url": asset->url,
      "title": title
    },
    
    // ... keep relevantFamily logic ...
    "relevantFamily": coalesce(
      *[_type == "family" && headOfFamily._ref == ^._id][0],
      *[_type == "family" && headOfFamily._ref in *[_type == "union" && ^.^._id in partners[]._ref].partners[]._ref][0],
      *[_type == "family" && headOfFamily._ref in *[_type == "union" && ^.^._id in children[]._ref].partners[]._ref][0]
    ) { slug, familyName },

    "parentsData": *[_type == "union" && ^._id in children[]._ref]{
      _id,
      partners[]->{ 
        _id, fullName, slug, profileImage, sex, isDescendant, generation,
        "parents": *[_type == "union" && ^._id in children[]._ref].partners[]->{
             _id, fullName, slug, profileImage, sex, isDescendant, generation
        }
      },
      children[]->{ _id, fullName, slug, profileImage, sex, isDescendant, generation }
    },

    // UPDATE: Sort Unions by Marriage Date (Oldest to Newest)
    "unionsData": *[_type == "union" && ^._id in partners[]._ref] | order(marriageDate asc){
      _id,
      marriageDate, // Fetch the date
      partners[]->{ _id, fullName, slug, profileImage, sex, isDescendant, generation },
      children[]->{ _id, fullName, slug, profileImage, sex, isDescendant, generation }
    }
  }`;
  
  return await client.fetch(query, { slug });
};

export const getPeople = async (): Promise<MinimalPerson[]> => {
  // Updated to fetch generation and birthDate
  return await client.fetch(`*[_type == "person"] | order(fullName asc){ 
    _id, fullName, slug, profileImage, sex, isDescendant, generation, birthDate
  }`);
};

export const getFamilies = async (): Promise<FamilyDirectoryItem[]> => {
  const query = `*[_type == "family"] | order(headOfFamily->birthDate asc) {
    _id,
    familyName,
    slug,
    mainImage,
    headOfFamily->{ fullName, birthDate },
    
    // LOGIC FIX: Count the Union documents directly (1 Union = 1 Wife)
    "wivesCount": count(*[_type == "union" && ^.headOfFamily._ref in partners[]._ref]),
    
    // LOGIC FIX: Count the flattened children array (Individual kids)
    "childrenCount": count(*[_type == "union" && ^.headOfFamily._ref in partners[]._ref].children[])
  }`;

  return await client.fetch(query);
};

export const getFamily = async (slug: string): Promise<FamilyPageData | null> => {
  const query = `*[_type == "family" && slug.current == $slug][0] {
    _id,
    familyName,
    slug,
    mainImage,
    familyBio,
    gallery,
    "familyAudioUrl": familyAudio.asset->url,
    
    headOfFamily->{ _id, fullName, slug, profileImage, sex, isDescendant, generation },

    "rawUnions": *[_type == "union" && ^.headOfFamily._ref in partners[]._ref] | order(marriageDate asc) {
      _id,
      partners[]->{ _id, fullName, slug, profileImage, sex, isDescendant, generation },
      children[]->{ _id, fullName, slug, profileImage, sex, birthDate, isDescendant, generation }
    }
  }`;

  const result = await client.fetch(query, { slug });

  if (!result) return null;

  const wives: MinimalPerson[] = [];
  let allChildren: (MinimalPerson & { birthDate?: string })[] = [];

  if (result.rawUnions) {
    result.rawUnions.forEach((u: any) => {
      // 1. Filter Partners to find Wives (Exclude Head)
      if (u.partners) {
        u.partners.forEach((partner: MinimalPerson) => {
           if (partner._id !== result.headOfFamily._id) {
             wives.push(partner);
           }
        });
      }
      // 2. Collect Children
      if (u.children) {
        allChildren.push(...u.children);
      }
    });
  }

  const uniqueWives = Array.from(new Map(wives.map(item => [item._id, item])).values());

  allChildren.sort((a, b) => {
    const dateA = a.birthDate ? new Date(a.birthDate).getTime() : 0;
    const dateB = b.birthDate ? new Date(b.birthDate).getTime() : 0;
    if (dateA === 0) return 1;
    if (dateB === 0) return -1;
    return dateA - dateB;
  });

  return {
    _id: result._id,
    familyName: result.familyName,
    slug: result.slug,
    mainImage: result.mainImage,
    familyBio: result.familyBio,
    familyAudioUrl: result.familyAudioUrl,
    gallery: result.gallery,
    headOfFamily: result.headOfFamily,
    wives: uniqueWives,
    children: allChildren
  };
};

// 1. Fetch All Albums (For the Gallery Directory)
export const getGalleryAlbums = async (): Promise<PhotoAlbum[]> => {
  return await client.fetch(`*[_type == "photoAlbum"] | order(date desc) {
    _id,
    title,
    slug,
    date,
    coverImage,
    description
  }`);
};

// 2. Fetch Single Album (For the detail view)
export const getAlbum = async (slug: string): Promise<PhotoAlbum | null> => {
  return await client.fetch(`*[_type == "photoAlbum" && slug.current == $slug][0] {
    ...,
    images[]{
      asset,
      "url": asset->url,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    }
  }`, { slug });
};