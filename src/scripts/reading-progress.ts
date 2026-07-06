let onScroll: (() => void) | null = null
let observer: IntersectionObserver | null = null

document.addEventListener("astro:before-swap", () => {
    if (onScroll) {
        window.removeEventListener("scroll", onScroll)
        onScroll = null
    }
    if (observer) {
        observer.disconnect()
        observer = null
    }
})

document.addEventListener("astro:page-load", () => {
    onScroll = () => {
        const winScroll =
            document.body.scrollTop || document.documentElement.scrollTop
        const height =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight
        const scrolled = height <= 0 ? 100 : (winScroll / height) * 100
        const progressBar = document.getElementById("progress-bar")
        if (progressBar) {
            progressBar.style.width = scrolled + "%"
        }
    }

    window.addEventListener("scroll", onScroll)

    const activeLiClasses = ["border-l-2", "border-primary", "-ml-[1px]"]
    const activeLinkClasses = ["text-foreground", "font-medium"]

    const activeHeadings = new Set<string>()

    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const id = entry.target.getAttribute("id")
                if (!id) return
                if (entry.isIntersecting) {
                    activeHeadings.add(id)
                } else {
                    activeHeadings.delete(id)
                }
            })

            const headers = Array.from(document.querySelectorAll("h2, h3, h4"))
            const firstActive = headers.find((h) =>
                activeHeadings.has(h.getAttribute("id") || "")
            )

            if (firstActive) {
                const id = firstActive.getAttribute("id")
                const desktopLink = id
                    ? document.querySelector(`aside a[href="#${id}"]`)
                    : null
                const mobileLink = id
                    ? document.querySelector(
                          `#mobile-toc-menu a[href="#${id}"]`
                      )
                    : null

                document.querySelectorAll("aside li").forEach((el) => {
                    el.classList.remove(...activeLiClasses)
                    const a = el.querySelector("a")
                    if (a) {
                        a.classList.remove(...activeLinkClasses)
                        a.classList.add("text-muted-foreground")
                    }
                })

                document
                    .querySelectorAll("#mobile-toc-menu li")
                    .forEach((el) => {
                        el.classList.remove(...activeLiClasses)
                        const a = el.querySelector("a")
                        if (a) {
                            a.classList.remove(...activeLinkClasses)
                            a.classList.add("text-muted-foreground")
                        }
                    })

                if (desktopLink) {
                    const asideLi = desktopLink.parentElement
                    if (asideLi) asideLi.classList.add(...activeLiClasses)
                    desktopLink.classList.add(...activeLinkClasses)
                    desktopLink.classList.remove("text-muted-foreground")
                }

                if (mobileLink) {
                    const mobileLi = mobileLink.parentElement
                    if (mobileLi) mobileLi.classList.add(...activeLiClasses)
                    mobileLink.classList.add(...activeLinkClasses)
                    mobileLink.classList.remove("text-muted-foreground")
                }
            }
        },
        { rootMargin: "0px 0px -80% 0px" }
    )

    document.querySelectorAll("h2, h3, h4").forEach((header) => {
        observer!.observe(header)
    })
})
