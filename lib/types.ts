export interface Campaign {
    id: number;
    name: string;
    url: string;
    fullUrl: string;
    networkName?: string;
    serverName?: string;
    serverIP?: string;
    domainExpiringDate?: string;
    nicheName?: string;
    status: number;
    indexer: boolean;
    rating: boolean;
    mssType: number;
    createdAt: string;
    dateBuilt?: string;
    trackNumber?: string;
    atrafficId?: number;
    country: string;

    // Foreign Keys
    networkId: number;
    serverId: number;
    nicheId: number;

    // Additional fields
    searchConsole: boolean;
    bing: boolean;
    wpNumPosts?: number;
    buildInfo?: string;
    gIndex?: number;
    bIndex?: number;
    gIndexDate?: string;
    bIndexDate?: string;
}

export interface Network {
    id: number;
    name: string;
    short: string;
    url?: string;
    status: boolean;
}

export interface Server {
    id: number;
    name: string;
    ip: string;
    status: boolean;
}

export interface Niche {
    id: number;
    name: string;
    status: boolean;
}

export interface Task {
    id: number;
    task_cid: number;
    task_details: string;
    price?: number;
    source?: string;
    gigtitle?: string;
    gigtype?: number;
    subgigtype?: number;
    linkingto?: string;
    anchortexts?: string;
    comments?: string;
    indexing?: boolean;
    status: string;
    created_at?: string;
}
