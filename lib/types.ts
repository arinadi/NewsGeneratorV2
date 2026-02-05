export const ANGLES = ['straight', 'impact', 'accountability', 'human_interest'] as const;
export const STYLES = ['formal', 'professional', 'casual', 'friendly', 'authoritative', 'conversational'] as const;
export const GOALS = ['google_news', 'seo_ranking', 'viral_social', 'informational'] as const;

export type Angle = typeof ANGLES[number];
export type Style = typeof STYLES[number];
export type Goal = typeof GOALS[number];

export type MetadataSource = 'ai' | 'manual' | 'file';

export interface Metadata {
    location: string;
    date: string;
    byline: string;
    personsInvolved: string[];
    source: MetadataSource;
}

export interface InputState {
    transcript: string;
    context: string;
    metadata: Metadata;
}

export interface Settings {
    angle: Angle;
    style: Style;
    goal: Goal;
}

export interface GeneratedResult {
    titles: string[];
    body: string;
    hashtags: string;
}
