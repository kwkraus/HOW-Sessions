export interface IBingSearchResult {
    value: Array<IBingMediaSearch | IBingNewsSearch>;
}

export interface IBingMediaSearch {
    name: string;
    webSearchUrl: string;
    thumbnailUrl: string;
    motionThumbnailUrl: string;
    contentUrl: string;
    hostPageUrl: string;
    hostPageDisplayUrl: string;
    width: number;
    height: number;
    thumbnail: {
        width: number;
        height: number;
    };
    hoveredOver: boolean;
}

export interface IBingNewsSearch {
    name: string;
    url: string;
    image: {
        thumbnail: {
            contentUrl: string;
            width: number;
            height: number;
        };
    };
    description: string;
    displayUrl: string;
    snippet: string;
}
