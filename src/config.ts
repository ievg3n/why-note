import type { SiteConfig } from "./types"

export const siteConfig: SiteConfig = {
    title: "WayeDigital",
    description: "Notes from someone still figuring it out — shipped anyway.",
    author: {
        name: "ievg3n",
        bio: ""
    },
    nav: [
        { label: "Writing", href: "/" },
        { label: "Stories", href: "/stories" },
        { label: "Tags", href: "/tags" },
        { label: "About", href: "/about" }
    ],
    socials: {
        github: "",
        linkedin: "https://ph.linkedin.com/in/ievg3n"
    },
    postsPerPage: 5,
    analytics: {
        umami: {
            websiteId: "",
            src: ""
        }
    }
}
