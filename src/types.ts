export interface SearchItem {
    title: string
    frontmatter: string
    tags: string[]
    link: string
    date: string
    readTime: number
}

export interface NavLink {
    label: string
    href: string
}

export interface SocialLinks {
    github?: string
    twitter?: string
    linkedin?: string
}

export interface UmamiConfig {
    websiteId?: string
    src?: string
}

export interface AnalyticsConfig {
    umami: UmamiConfig
}

export interface AuthorConfig {
    name: string
    bio: string
}

export interface SiteConfig {
    title: string
    description: string
    author: AuthorConfig
    nav: NavLink[]
    socials: SocialLinks
    postsPerPage: number
    analytics: AnalyticsConfig
}
