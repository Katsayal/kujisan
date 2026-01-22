import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  // FIX 1: Set to false so we get fresh data when Next.js revalidates
  useCdn: false, 
});

// FIX 2: Global Fetch Configuration (ISR)
// This limits API calls to once every 60 seconds per query
const FETCH_CONFIG = { next: { revalidate: 60 } };

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
  generation?: number;
  birthDate?: string;
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
    "settings": *[_type == "siteSettings"][0] {
      heroTitle,
      heroSubtitle,
      heroImage,
      aboutTitle,
      aboutImage,
      aboutContent
    },
    "stats": {
      "children": count(*[_type == "person" && isDescendant == true && generation == 2]),
      "grandchildren": count(*[_type == "person" && isDescendant == true && generation == 3]),
      "greatGrandchildren": count(*[_type == "person" && isDescendant == true && generation == 4])
    },
    "latestAlbums": *[_type == "photoAlbum"] | order(date desc)[0...3] {
      _id, title, slug, coverImage, date
    }
  }`;

  // Apply Global Config
  const result = await client.fetch(query, {}, FETCH_CONFIG);

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
    "audioGallery": audioGallery[]{
      "url": asset->url,
      "title": title
    },
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

    "unionsData": *[_type == "union" && ^._id in partners[]._ref] | order(marriageDate asc){
      _id,
      marriageDate, 
      partners[]->{ _id, fullName, slug, profileImage, sex, isDescendant, generation },
      children[]->{ _id, fullName, slug, profileImage, sex, isDescendant, generation }
    }
  }`;
  
  // Apply Global Config
  return await client.fetch(query, { slug }, FETCH_CONFIG);
};

export const getPeople = async (): Promise<MinimalPerson[]> => {
  return await client.fetch(
    `*[_type == "person"] | order(fullName asc){ 
      _id, fullName, slug, profileImage, sex, isDescendant, generation, birthDate
    }`, 
    {}, 
    FETCH_CONFIG // Apply Global Config (Replaces 'no-store')
  ); 
};

export const getFamilies = async (): Promise<FamilyDirectoryItem[]> => {
  const query = `*[_type == "family"] | order(headOfFamily->birthDate asc) {
    _id,
    familyName,
    slug,
    mainImage,
    headOfFamily->{ fullName, birthDate },
    "wivesCount": count(*[_type == "union" && ^.headOfFamily._ref in partners[]._ref]),
    "childrenCount": count(*[_type == "union" && ^.headOfFamily._ref in partners[]._ref].children[])
  }`;

  // Apply Global Config
  return await client.fetch(query, {}, FETCH_CONFIG);
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

  // Apply Global Config
  const result = await client.fetch(query, { slug }, FETCH_CONFIG);

  if (!result) return null;

  const wives: MinimalPerson[] = [];
  let allChildren: (MinimalPerson & { birthDate?: string })[] = [];

  if (result.rawUnions) {
    result.rawUnions.forEach((u: any) => {
      if (u.partners) {
        u.partners.forEach((partner: MinimalPerson) => {
           if (partner._id !== result.headOfFamily._id) {
             wives.push(partner);
           }
        });
      }
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

export const getGalleryAlbums = async (): Promise<PhotoAlbum[]> => {
  return await client.fetch(
    `*[_type == "photoAlbum"] | order(date desc) {
      _id,
      title,
      slug,
      date,
      coverImage,
      description
    }`,
    {},
    FETCH_CONFIG // Apply Global Config
  );
};

export const getAlbum = async (slug: string): Promise<PhotoAlbum | null> => {
  return await client.fetch(
    `*[_type == "photoAlbum" && slug.current == $slug][0] {
      ...,
      images[]{
        asset,
        "url": asset->url,
        "aspectRatio": asset->metadata.dimensions.aspectRatio
      }
    }`, 
    { slug },
    FETCH_CONFIG // Apply Global Config
  );
};


// --- ANCESTRY TREE API ---

export interface TreePerson {
  _id: string;
  fullName: string;
  generation: number;
  sex: 'male' | 'female';
  profileImage?: any;
  slug?: { current: string };
  unions: {
    _id: string;
    partner?: {
      _id: string;
      fullName: string;
      profileImage?: any;
      slug?: { current: string };
    };
    children: {
      _id: string;
      fullName: string;
      generation: number;
      sex: 'male' | 'female';
      profileImage?: any;
      childCount: number;
      slug?: { current: string };
    }[];
  }[];
}

const treeFields = `
  _id, fullName, generation, sex, profileImage, slug,
  "unions": *[_type == "union" && ^._id in partners[]._ref] {
    _id,
    "partner": partners[@._ref != ^.^._id][0]->{ _id, fullName, profileImage, slug },
    children[]-> {
      _id, fullName, generation, sex, profileImage, slug,
      "childCount": count(*[_type == "union" && ^._id in partners[]._ref].children)
    }
  }
`;

// 1. Get Root (Sani)
export const getTreeRoot = async (): Promise<TreePerson[]> => {
  return await client.fetch(
    `*[_type == "person" && generation == 1 && sex == "male"] { ${treeFields} }`,
    {},
    FETCH_CONFIG // Apply Global Config (Replaces 'no-store')
  );
};

// 2. Get Branch (Descendants)
export const getTreeBranch = async (personId: string): Promise<TreePerson | null> => {
  if (!personId) {
    console.error("getTreeBranch called with null ID");
    return null;
  }
  return await client.fetch(
    `*[_type == "person" && _id == $nodeId][0] { ${treeFields} }`, 
    { nodeId: personId },
    FETCH_CONFIG // Apply Global Config
  );
};