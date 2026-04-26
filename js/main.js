/**
 * 北疆红韵 - 门户化前端渲染脚本
 * 通过统一数据源驱动专题页、资源页和视频页渲染。
 */

document.addEventListener("DOMContentLoaded", () => {
    const DEFAULT_PROJECT_TEXT = "东北红色精神思政资源整合平台";
    const IMAGE_PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
    const pathname = window.location.pathname.split("/").pop() || "index.html";
    const query = new URLSearchParams(window.location.search);

    const getPortalData = () => window.PortalData || null;
    const portalData = getPortalData();
    const siteConfig = portalData?.siteConfig || {};
    const homePageConfig = portalData?.homePage || {};
    const siteBackgrounds = portalData?.siteBackgrounds || {};
    const metricRanges = siteConfig.metricRanges || {};
    const quickStatsCopy = siteConfig.quickStats || {};
    const govChromeCopy = siteConfig.govChrome || {};
    const PROJECT_TEXT = portalData?.projectText || DEFAULT_PROJECT_TEXT;
    const SITE_NAME = siteConfig.siteName || "北疆红韵";
    const SITE_SUBTITLE = siteConfig.siteSubtitle || "东北红色精神思政资源整合平台";
    const SITE_TOTAL_VISITS = siteConfig.totalVisits || "6.8万+";
    const DEFAULT_HOME_HERO_SLIDES = [
        {
            title: "东北抗联精神",
            subtitle: "赵一曼等抗联英烈以生命铸就白山黑水的精神丰碑",
            ctaLabel: "进入专题",
            ctaHref: "spirit-anti-japanese.html",
            image: IMAGE_PLACEHOLDER
        },
        {
            title: "北大荒精神",
            subtitle: "艰苦奋斗、勇于开拓的创业史诗",
            ctaLabel: "深入了解",
            ctaHref: "spirit-beidahuang.html",
            image: IMAGE_PLACEHOLDER
        },
        {
            title: "大庆精神",
            subtitle: "石油大会战激荡起爱国、创业、求实、奉献的工业史诗",
            ctaLabel: "进入专题",
            ctaHref: "spirit-daqing.html",
            image: IMAGE_PLACEHOLDER
        },
        {
            title: "铁人精神",
            subtitle: "王进喜挺起民族工业脊梁，树起工人阶级精神坐标",
            ctaLabel: "进入专题",
            ctaHref: "spirit-ironman.html",
            image: IMAGE_PLACEHOLDER
        }
    ];
    const ARTICLE_READ_RANGE = {
        min: metricRanges.articleReads?.min || 12000,
        max: metricRanges.articleReads?.max || 30000,
        step: metricRanges.articleReads?.step || 100,
        displayRange: metricRanges.articleReads?.displayRange || "1.2万 - 3万"
    };
    const VIDEO_PLAY_RANGE = {
        min: metricRanges.videoPlays?.min || 30000,
        max: metricRanges.videoPlays?.max || 80000,
        step: metricRanges.videoPlays?.step || 100,
        displayRange: metricRanges.videoPlays?.displayRange || "3万 - 8万"
    };

    const hashSeed = (input = "") =>
        String(input)
            .split("")
            .reduce((total, char, index) => total + char.charCodeAt(0) * (index + 17), 0);

    const formatCountValue = (value) => `${(value / 10000).toFixed(1).replace(/\.0$/, "")}万`;

    const createStaticCount = (seed, min, max, step = 100) => {
        const totalSteps = Math.floor((max - min) / step);
        const hash = hashSeed(seed);
        const value = min + (hash % (totalSteps + 1)) * step;
        return formatCountValue(value);
    };

    const getArticleReadCount = (seed) =>
        createStaticCount(`read-${seed}`, ARTICLE_READ_RANGE.min, ARTICLE_READ_RANGE.max, ARTICLE_READ_RANGE.step);
    const getVideoPlayCount = (seed) =>
        createStaticCount(`play-${seed}`, VIDEO_PLAY_RANGE.min, VIDEO_PLAY_RANGE.max, VIDEO_PLAY_RANGE.step);

    const renderMetricBadge = ({ icon, label, value, modifier = "" }) => `
        <span class="data-metric ${modifier}">
            <i class="${icon}"></i>
            <span>${label}</span>
            <strong>${value}</strong>
        </span>
    `;

    const updateQuery = (changes = {}, hash = "") => {
        const next = new URLSearchParams(window.location.search);

        Object.entries(changes).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "" || value === "all" || value === 1) {
                next.delete(key);
            } else {
                next.set(key, String(value));
            }
        });

        const search = next.toString();
        window.location.href = `${pathname}${search ? `?${search}` : ""}${hash}`;
    };

    const formatParagraphs = (text = "") =>
        text
            .split("\n\n")
            .filter(Boolean)
            .map((paragraph) => `<p>${paragraph}</p>`)
            .join("");

    const getNormalizedVideoConfig = (videoConfig) => {
        const categories = videoConfig?.categories || [];
        const categoryMap = Object.fromEntries(categories.map((item) => [item.id, item]));
        const lectureCategory = categoryMap.lecture || { description: "", items: [] };
        const historyCategory = categoryMap.history || { description: "", items: [] };
        const beidahuangCategory = categoryMap.beidahuang || { description: "", items: [] };
        const daqingCategory = categoryMap.daqing || { description: "", items: [] };
        const microCategory = categoryMap.micro || { description: "", items: [] };

        return {
            overview: videoConfig?.overview || "",
            categories: [
                {
                    id: "antiJapanese",
                    title: "抗联精神视频档案",
                    description: lectureCategory.description || "聚焦东北抗联精神与权威历史影像，形成专题式归档展示。",
                    items: [...lectureCategory.items, ...historyCategory.items]
                },
                {
                    id: "beidahuang",
                    title: "北大荒精神视频档案",
                    description: beidahuangCategory.description || "围绕垦荒创业、黑土地建设和北大荒精神进行专题归档。",
                    items: [...beidahuangCategory.items]
                },
                {
                    id: "daqing",
                    title: "大庆铁人精神视频档案",
                    description: daqingCategory.description || "统一收录大庆精神、铁人精神相关纪录片和人物专题。",
                    items: [...daqingCategory.items]
                },
                {
                    id: "longjiang",
                    title: "龙江思政科普视频档案",
                    description: microCategory.description || "保留微课与龙江思政科普素材，适合课程嵌入与移动端学习。",
                    items: [...microCategory.items]
                }
            ]
        };
    };

    const getPortalModal = () => {
        let overlay = document.querySelector(".portal-modal-overlay");

        if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = "portal-modal-overlay";
            overlay.innerHTML = `
                <div class="portal-modal">
                    <button class="portal-modal-close" type="button" aria-label="关闭详情">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="portal-modal-body"></div>
                </div>
            `;
            document.body.appendChild(overlay);

            const closeModal = () => {
                overlay.classList.remove("show");
                document.body.style.overflow = "";
            };

            overlay.querySelector(".portal-modal-close").addEventListener("click", closeModal);
            overlay.addEventListener("click", (event) => {
                if (event.target === overlay) {
                    closeModal();
                }
            });
        }

        return overlay;
    };

    const openPortalModal = ({ title, meta, body, footer }) => {
        const overlay = getPortalModal();
        const modalBody = overlay.querySelector(".portal-modal-body");

        modalBody.innerHTML = `
            <div class="portal-modal-head">
                <h3>${title}</h3>
                ${meta ? `<div class="portal-modal-meta">${meta}</div>` : ""}
            </div>
            <div class="portal-modal-content">${formatParagraphs(body || "")}</div>
            ${footer ? `<div class="portal-modal-footer">${footer}</div>` : ""}
        `;

        overlay.classList.add("show");
        document.body.style.overflow = "hidden";
    };

    const createMobileMenu = () => {
        const navContainer = document.querySelector(".nav-container");
        const navLinks = document.querySelector(".nav-links");

        if (!navContainer || !navLinks || navContainer.querySelector(".menu-btn")) {
            return;
        }

        const menuBtn = document.createElement("button");
        menuBtn.className = "menu-btn";
        menuBtn.type = "button";
        menuBtn.setAttribute("aria-label", "切换导航菜单");
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.style.cssText = "display:none;font-size:1.6rem;cursor:pointer;color:var(--light-gold);background:none;border:none;";
        navContainer.appendChild(menuBtn);

        const openMenu = () => {
            navLinks.style.cssText = `
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 70px;
                left: 0;
                width: 100%;
                background: linear-gradient(180deg, #7f091d, #4b0610);
                padding: 16px;
                z-index: 1000;
                border-bottom: 3px solid var(--secondary-gold);
                box-shadow: 0 16px 28px rgba(0,0,0,0.18);
            `;
        };

        const closeMenu = () => {
            navLinks.style.cssText = "";
        };

        const syncMenuState = () => {
            if (window.innerWidth <= 768) {
                menuBtn.style.display = "block";
                if (!navLinks.style.display) {
                    navLinks.style.display = "none";
                }
            } else {
                menuBtn.style.display = "none";
                closeMenu();
            }
        };

        menuBtn.addEventListener("click", () => {
            const isOpen = navLinks.style.display === "flex";
            navLinks.style.display = isOpen ? "none" : "";

            if (!isOpen) {
                openMenu();
            }
        });

        window.addEventListener("resize", syncMenuState);
        syncMenuState();
    };

    const initBackToTop = () => {
        if (document.getElementById("back-to-top")) return;

        const backToTop = document.createElement("div");
        backToTop.id = "back-to-top";
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTop);

        window.addEventListener("scroll", () => {
            backToTop.classList.toggle("show", window.scrollY > 300);
        });

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    };

    const initVideoPopup = () => {
        const thumbs = document.querySelectorAll(".video-thumb");
        if (!thumbs.length) return;

        const oldOverlay = document.querySelector(".video-overlay");
        if (oldOverlay) {
            oldOverlay.remove();
        }

        const overlay = document.createElement("div");
        overlay.className = "video-overlay";
        overlay.innerHTML = `
            <div class="video-popup-container">
                <div class="close-video"><i class="fas fa-times"></i></div>
                <div class="video-popup-head">
                    <div class="video-popup-heading">
                        <h3 class="video-popup-title"></h3>
                        <p class="video-popup-subtitle"></p>
                    </div>
                    <div class="video-popup-count"></div>
                </div>
                <div class="video-popup-layout">
                    <div class="video-wrapper"></div>
                    <aside class="video-side-panel">
                        <p class="video-side-label">专题播放数据</p>
                        <div class="video-side-count"></div>
                        <p class="video-side-description"></p>
                        <div class="video-side-project">平台说明：权威思政资源整合展示</div>
                    </aside>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector(".close-video");
        const wrapper = overlay.querySelector(".video-wrapper");
        const titleNode = overlay.querySelector(".video-popup-title");
        const subtitleNode = overlay.querySelector(".video-popup-subtitle");
        const popupCountNode = overlay.querySelector(".video-popup-count");
        const sideCountNode = overlay.querySelector(".video-side-count");
        const sideDescriptionNode = overlay.querySelector(".video-side-description");

        thumbs.forEach((thumb) => {
            thumb.addEventListener("click", function () {
                const videoUrl = this.getAttribute("data-video-url");
                if (!videoUrl) return;
                const videoTitle = this.getAttribute("data-title") || "专题视频";
                const videoMeta = this.getAttribute("data-meta") || "";
                const videoCategory = this.getAttribute("data-category-label") || "红色专题视频";
                const videoDescription = this.getAttribute("data-description") || "本视频内容用于思政专题展示与课堂辅助播放。";
                const playCount = this.getAttribute("data-play-count") || getVideoPlayCount(videoTitle);

                titleNode.textContent = videoTitle;
                subtitleNode.textContent = [videoCategory, videoMeta].filter(Boolean).join(" | ");
                popupCountNode.innerHTML = renderMetricBadge({
                    icon: "fas fa-circle-play",
                    label: "播放量",
                    value: playCount,
                    modifier: "data-metric-video"
                });
                sideCountNode.innerHTML = `<strong>${playCount}</strong><span>静态预设展示播放量</span>`;
                sideDescriptionNode.textContent = videoDescription;

                if (videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm")) {
                    wrapper.innerHTML = `<video src="${videoUrl}" controls autoplay></video>`;
                } else {
                    wrapper.innerHTML = `<iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
                }

                overlay.style.display = "flex";
                document.body.style.overflow = "hidden";
            });
        });

        const closePopup = () => {
            overlay.style.display = "none";
            wrapper.innerHTML = "";
            titleNode.textContent = "";
            subtitleNode.textContent = "";
            popupCountNode.innerHTML = "";
            sideCountNode.innerHTML = "";
            sideDescriptionNode.textContent = "";
            document.body.style.overflow = "";
        };

        closeBtn.addEventListener("click", closePopup);
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) {
                closePopup();
            }
        });
    };

    const initHeroSlider = () => {
        const slides = document.querySelectorAll(".hero-slide");
        if (slides.length <= 1) return;

        let currentSlide = 0;
        slides.forEach((slide, index) => {
            slide.style.opacity = index === 0 ? "1" : "0";
        });

        window.setInterval(() => {
            slides[currentSlide].style.opacity = "0";
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].style.opacity = "1";
        }, 5000);
    };

    const renderEmptyState = (message) => `<div class="portal-empty">${message}</div>`;

    const bindListingModalButtons = (root, config, type) => {
        root.querySelectorAll(".portal-detail-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const itemId = button.getAttribute("data-id");
                const item = config.items.find((entry) => entry.id === itemId);
                if (!item) return;

                let meta = "";
                if (type === "articles") {
                    meta = `${item.spirit} | ${item.source} | ${item.date}`;
                } else if (type === "resources") {
                    meta = `${item.meta} | 来源：${item.source}`;
                } else if (type === "literature") {
                    meta = `作者：${item.author} | 来源：${item.source}`;
                } else if (type === "classroom") {
                    meta = `栏目：${item.source}`;
                }

                meta = `${meta ? `${meta} | ` : ""}阅读量：${getArticleReadCount(item.id || item.title)}`;

                openPortalModal({
                    title: item.title,
                    meta,
                    body: item.body || item.summary,
                    footer: `平台说明：内容依据公开权威资料整理展示`
                });
            });
        });
    };

    const renderListingCards = (type, items) => {
        if (!items.length) {
            return renderEmptyState("当前筛选条件下暂无内容。");
        }

        if (type === "articles") {
            return items
                .map(
                    (item) => `
                        <article class="portal-card portal-article-card">
                            <div class="portal-card-image">
                                <img src="${item.image}" alt="${item.title}">
                            </div>
                            <div class="portal-card-body">
                                <span class="portal-tag">${item.spirit}</span>
                                <h3>${item.title}</h3>
                                <p>${item.summary}</p>
                                <div class="portal-card-meta">
                                    <span>${item.source}</span>
                                    <span>${item.date}</span>
                                </div>
                                <div class="portal-card-footer">
                                    ${renderMetricBadge({
                                        icon: "fas fa-chart-line",
                                        label: "阅读量",
                                        value: getArticleReadCount(item.id || item.title),
                                        modifier: "data-metric-read"
                                    })}
                                </div>
                                <button class="portal-detail-btn" type="button" data-id="${item.id}">阅读全文</button>
                            </div>
                        </article>
                    `
                )
                .join("");
        }

        if (type === "resources") {
            return items
                .map(
                    (item) => `
                        <article class="portal-card portal-resource-card">
                            <div class="portal-resource-icon"><i class="${item.icon}"></i></div>
                            <div class="portal-card-body">
                                <span class="portal-tag">${item.meta}</span>
                                <h3>${item.title}</h3>
                                <p>${item.summary}</p>
                                <div class="portal-card-meta">
                                    <span>来源：${item.source}</span>
                                </div>
                                <div class="portal-card-footer">
                                    ${renderMetricBadge({
                                        icon: "fas fa-book-open-reader",
                                        label: "阅读量",
                                        value: getArticleReadCount(item.id || item.title),
                                        modifier: "data-metric-read"
                                    })}
                                </div>
                                <button class="portal-detail-btn" type="button" data-id="${item.id}">${item.actionLabel || "查看详情"}</button>
                            </div>
                        </article>
                    `
                )
                .join("");
        }

        if (type === "literature") {
            return items
                .map(
                    (item) => `
                        <article class="portal-card portal-book-card">
                            <div class="portal-book-cover">
                                <img src="${item.cover}" alt="${item.title}">
                            </div>
                            <div class="portal-card-body">
                                <span class="portal-tag">${item.category}</span>
                                <h3>${item.title}</h3>
                                <p>${item.summary}</p>
                                <div class="portal-card-meta">
                                    <span>作者：${item.author}</span>
                                    <span>${item.source}</span>
                                </div>
                                <div class="portal-card-footer">
                                    ${renderMetricBadge({
                                        icon: "fas fa-book-bookmark",
                                        label: "阅读量",
                                        value: getArticleReadCount(item.id || item.title),
                                        modifier: "data-metric-read"
                                    })}
                                </div>
                                <button class="portal-detail-btn" type="button" data-id="${item.id}">查看详情</button>
                            </div>
                        </article>
                    `
                )
                .join("");
        }

        return items
            .map(
                (item) => `
                    <article class="portal-card portal-story-card">
                        <div class="portal-story-icon"><i class="${item.icon}"></i></div>
                        <div class="portal-card-body">
                            <span class="portal-tag">${item.source}</span>
                            <h3>${item.title}</h3>
                            <p>${item.summary}</p>
                            <div class="portal-card-footer">
                                ${renderMetricBadge({
                                    icon: "fas fa-eye",
                                    label: "阅读量",
                                    value: getArticleReadCount(item.id || item.title),
                                    modifier: "data-metric-read"
                                })}
                            </div>
                            <button class="portal-detail-btn" type="button" data-id="${item.id}">展开内容</button>
                        </div>
                    </article>
                `
            )
            .join("");
    };

    const renderListingPage = (root, listKey) => {
        const portalData = getPortalData();
        if (!portalData || !portalData.listings[listKey]) return;

        const config = portalData.listings[listKey];
        const filters = config.filters || [];
        const activeFilter = filters.some((item) => item.id === query.get("cat")) ? query.get("cat") : "all";
        const filteredItems = activeFilter === "all" ? config.items : config.items.filter((item) => item.category === activeFilter);
        const totalPages = Math.max(1, Math.ceil(filteredItems.length / config.pageSize));
        const currentPage = Math.min(Math.max(Number(query.get("page")) || 1, 1), totalPages);
        const pageItems = filteredItems.slice((currentPage - 1) * config.pageSize, currentPage * config.pageSize);
        const gridClass =
            listKey === "resources"
                ? "portal-grid portal-resource-grid"
                : listKey === "literature"
                  ? "portal-grid portal-book-grid"
                  : listKey === "classroom"
                    ? "portal-grid portal-story-grid"
                    : "portal-grid portal-article-grid";

        root.innerHTML = `
            <section class="unified-section portal-toolbar-section">
                <div class="section-container">
                    <div class="portal-overview"><p>${config.overview}</p></div>
                    <div class="portal-highlight-box">
                        <div>
                            <h2>${config.highlight.title}</h2>
                            <p>${config.highlight.description}</p>
                        </div>
                        <div class="portal-highlight-points">
                            ${config.highlight.points.map((point) => `<span>${point}</span>`).join("")}
                        </div>
                    </div>
                    <div class="portal-filter-bar">
                        ${filters
                            .map(
                                (filter) => `
                                    <button class="portal-filter-btn ${activeFilter === filter.id ? "active" : ""}" type="button" data-filter="${filter.id}">
                                        ${filter.label}
                                    </button>
                                `
                            )
                            .join("")}
                    </div>
                </div>
            </section>
            <section class="unified-section">
                <div class="section-container">
                    <div class="${gridClass}">
                        ${renderListingCards(listKey, pageItems)}
                    </div>
                    <div class="portal-pagination">
                        ${Array.from({ length: totalPages }, (_, index) => index + 1)
                            .map(
                                (page) => `
                                    <button class="portal-page-btn ${page === currentPage ? "active" : ""}" type="button" data-page="${page}">
                                        ${page}
                                    </button>
                                `
                            )
                            .join("")}
                    </div>
                </div>
            </section>
        `;

        root.querySelectorAll(".portal-filter-btn").forEach((button) => {
            button.addEventListener("click", () => {
                updateQuery({ cat: button.getAttribute("data-filter"), page: 1 });
            });
        });

        root.querySelectorAll(".portal-page-btn").forEach((button) => {
            button.addEventListener("click", () => {
                updateQuery({ cat: activeFilter, page: button.getAttribute("data-page") });
            });
        });

        bindListingModalButtons(root, config, listKey);
    };

    const renderVideoPage = (root) => {
        const portalData = getPortalData();
        if (!portalData || !portalData.videos) return;

        const config = getNormalizedVideoConfig(portalData.videos);
        const categoryIds = config.categories.map((item) => item.id);
        const activeFilter = categoryIds.includes(query.get("cat")) ? query.get("cat") : "all";
        const visibleCategories =
            activeFilter === "all" ? config.categories : config.categories.filter((category) => category.id === activeFilter);

        root.innerHTML = `
            <section class="unified-section portal-toolbar-section">
                <div class="section-container">
                    <div class="portal-overview"><p>${config.overview}</p></div>
                    <div class="portal-filter-bar">
                        <button class="portal-filter-btn ${activeFilter === "all" ? "active" : ""}" type="button" data-filter="all">全部视频</button>
                        ${config.categories
                            .map(
                                (category) => `
                                    <button class="portal-filter-btn ${activeFilter === category.id ? "active" : ""}" type="button" data-filter="${category.id}">
                                        ${category.title.replace("精神", "").replace("视频", "").replace("影像", "")}
                                    </button>
                                `
                            )
                            .join("")}
                    </div>
                </div>
            </section>
            <section class="unified-section video-page">
                <div class="section-container">
                    <div class="section-title">
                        <h2>四大视频栏目</h2>
                        <div class="divider"></div>
                        <p class="section-title-lead">依照政务资源归档思路统一为抗联精神、北大荒精神、大庆铁人精神、龙江思政科普四类视频专栏，保持站内原地播放。</p>
                    </div>
                    ${visibleCategories
                        .map(
                            (category) => `
                                <section class="video-category" id="video-${category.id}" data-category-group="${category.id}">
                                    <div class="video-category-header">
                                        <h3>${category.title}</h3>
                                        <p>${category.description}</p>
                                    </div>
                                    <div class="video-category-grid">
                                        ${category.items
                                            .map(
                                                (item, index) => `
                                                    <article class="video-card" data-category="${category.id}">
                                                        <div
                                                            class="video-thumb"
                                                            data-video-url="${item.url}"
                                                            data-title="${item.title}"
                                                            data-meta="${item.meta}"
                                                            data-description="${item.description}"
                                                            data-category-label="${category.title}"
                                                            data-play-count="${getVideoPlayCount(`${category.id}-${index}-${item.title}`)}"
                                                        >
                                                            <img src="${item.image}" alt="${item.title}">
                                                            <div class="play-overlay"><i class="fas fa-play-circle"></i></div>
                                                        </div>
                                                        <div class="video-card-stats">
                                                            ${renderMetricBadge({
                                                                icon: "fas fa-circle-play",
                                                                label: "播放量",
                                                                value: getVideoPlayCount(`${category.id}-${index}-${item.title}`),
                                                                modifier: "data-metric-video"
                                                            })}
                                                        </div>
                                                        <div class="video-card-content">
                                                            <span class="video-badge">${item.badge}</span>
                                                            <h4>${item.title}</h4>
                                                            <p class="video-meta">${item.meta}</p>
                                                            <p class="video-description">官方简介：${item.description}</p>
                                                        </div>
                                                    </article>
                                                `
                                            )
                                            .join("")}
                                    </div>
                                </section>
                            `
                        )
                        .join("")}
                </div>
            </section>
        `;

        root.querySelectorAll(".portal-filter-btn").forEach((button) => {
            button.addEventListener("click", () => {
                updateQuery({ cat: button.getAttribute("data-filter") });
            });
        });
    };

    const renderSpiritPage = (root, spiritKey) => {
        const portalData = getPortalData();
        if (!portalData || !portalData.spirits[spiritKey]) return;

        const spirit = portalData.spirits[spiritKey];

        root.innerHTML = `
            <section class="unified-section">
                <div class="section-container">
                    <div class="portal-spirit-intro">
                        <div class="section-title">
                            <h2>精神内涵</h2>
                            <div class="divider"></div>
                        </div>
                        <div class="portal-prose-card">
                            <p>${spirit.intro}</p>
                            <div class="portal-facet-grid">
                                ${spirit.facets
                                    .map(
                                        (facet) => `
                                            <article class="portal-facet-card">
                                                <h3>${facet.title}</h3>
                                                <p>${facet.text}</p>
                                            </article>
                                        `
                                    )
                                    .join("")}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="unified-section">
                <div class="section-container">
                    <div class="section-title">
                        <h2>人物群像</h2>
                        <div class="divider"></div>
                    </div>
                    <div class="people-grid">
                        ${spirit.people
                            .map(
                                (person) => `
                                    <article class="card people-card">
                                        <div class="people-img-wrapper">
                                            <img src="${person.image}" class="people-img" alt="${person.name}">
                                        </div>
                                        <div class="people-info">
                                            <h3>${person.name}</h3>
                                            <span class="role">${person.role}</span>
                                            ${person.fact ? `<p class="people-fact">${person.fact}</p>` : ""}
                                            <p>${person.description}</p>
                                        </div>
                                    </article>
                                `
                            )
                            .join("")}
                    </div>
                </div>
            </section>
            <section class="unified-section">
                <div class="section-container">
                    <div class="section-title">
                        <h2>图文资料</h2>
                        <div class="divider"></div>
                    </div>
                    <div class="portal-grid portal-gallery-grid">
                        ${spirit.gallery
                            .map(
                                (item) => `
                                    <article class="portal-card portal-gallery-card">
                                        <div class="portal-card-image">
                                            <img src="${item.image}" alt="${item.title}">
                                        </div>
                                        <div class="portal-card-body">
                                            <h3>${item.title}</h3>
                                            <p>${item.text}</p>
                                        </div>
                                    </article>
                                `
                            )
                            .join("")}
                    </div>
                </div>
            </section>
            <section class="unified-section">
                <div class="section-container">
                    <div class="section-title">
                        <h2>专题视频中心</h2>
                        <div class="divider"></div>
                    </div>
                    <div class="video-category-grid">
                        ${spirit.videos
                            .map(
                                (video) => `
                                    <article class="video-card">
                                        <div
                                            class="video-thumb"
                                            data-video-url="${video.url}"
                                            data-title="${video.title}"
                                            data-meta="${video.meta}"
                                            data-description="${video.description}"
                                            data-category-label="专题视频中心"
                                            data-play-count="${getVideoPlayCount(`${spiritKey}-${video.title}`)}"
                                        >
                                            <img src="${video.image}" alt="${video.title}">
                                            <div class="play-overlay"><i class="fas fa-play-circle"></i></div>
                                        </div>
                                        <div class="video-card-stats">
                                            ${renderMetricBadge({
                                                icon: "fas fa-circle-play",
                                                label: "播放量",
                                                value: getVideoPlayCount(`${spiritKey}-${video.title}`),
                                                modifier: "data-metric-video"
                                            })}
                                        </div>
                                        <div class="video-card-content">
                                            <h4>${video.title}</h4>
                                            <p class="video-meta">${video.meta}</p>
                                            <p class="video-description">${video.description}</p>
                                        </div>
                                    </article>
                                `
                            )
                            .join("")}
                    </div>
                </div>
            </section>
            <section class="unified-section">
                <div class="section-container">
                    <div class="section-title">
                        <h2>权威学习文章</h2>
                        <div class="divider"></div>
                    </div>
                    <div class="article-list">
                        ${spirit.articles
                            .map(
                                (article, index) => `
                                    <article class="article-item">
                                        <div class="article-item-head">
                                            <div>
                                                <h4>${article.title}</h4>
                                                <div class="meta">${article.meta}</div>
                                            </div>
                                            <div class="article-item-stats">
                                                ${renderMetricBadge({
                                                    icon: "fas fa-eye",
                                                    label: "阅读量",
                                                    value: getArticleReadCount(`${spiritKey}-${article.title}`),
                                                    modifier: "data-metric-read"
                                                })}
                                            </div>
                                        </div>
                                        <p>${article.summary}</p>
                                        <button class="portal-detail-btn portal-inline-btn" type="button" data-index="${index}">点击阅读全文</button>
                                    </article>
                                `
                            )
                            .join("")}
                    </div>
                </div>
            </section>
        `;

        root.querySelectorAll(".portal-detail-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const article = spirit.articles[Number(button.getAttribute("data-index"))];
                if (!article) return;

                openPortalModal({
                    title: article.title,
                    meta: `${article.meta} | 阅读量：${getArticleReadCount(`${spiritKey}-${article.title}`)}`,
                    body: article.body || article.summary,
                    footer: `平台说明：内容依据公开权威资料整理展示`
                });
            });
        });
    };

    const renderAboutPage = (root) => {
        const portalData = getPortalData();
        const about = portalData?.aboutPage;
        if (!about) return;

        if (about.metaTitle) {
            document.title = about.metaTitle;
        }

        const banner = document.querySelector(".page-banner");
        if (banner && about.banner?.image) {
            banner.setAttribute("data-banner-image", about.banner.image);
            const bannerTitle = banner.querySelector("h1");
            const bannerSubtitle = banner.querySelector("p");
            if (bannerTitle && about.banner.title) bannerTitle.textContent = about.banner.title;
            if (bannerSubtitle && about.banner.subtitle) bannerSubtitle.textContent = about.banner.subtitle;
        }

        root.innerHTML = `
            <section class="unified-section">
                <div class="section-container">
                    <div class="section-header">
                        <h2>${about.header?.title || "关于平台"}</h2>
                        <p>${about.header?.subtitle || ""}</p>
                    </div>
                </div>
            </section>
            <section class="unified-section">
                <div class="section-container">
                    <div class="intro-card">
                        <h3><i class="${about.mission?.icon || "fas fa-bullseye"}"></i> ${about.mission?.title || "平台建设意义"}</h3>
                        <p>${about.mission?.body || ""}</p>
                        <div class="highlight-box">
                            <strong>${about.mission?.highlight || ""}</strong>
                        </div>
                    </div>
                </div>
            </section>
            <section class="unified-section">
                <div class="section-container">
                    <div class="intro-card">
                        <h3><i class="${about.features?.icon || "fas fa-rocket"}"></i> ${about.features?.title || "创新亮点"}</h3>
                        <div class="feature-grid">
                            ${(about.features?.items || [])
                                .map(
                                    (item) => `
                                        <div class="feature-item">
                                            <i class="${item.icon || "fas fa-star"}"></i>
                                            <h4>${item.title}</h4>
                                            <p>${item.description}</p>
                                        </div>
                                    `
                                )
                                .join("")}
                        </div>
                    </div>
                </div>
            </section>
            <section class="unified-section">
                <div class="section-container">
                    <div class="intro-card">
                        <h3><i class="${about.scenes?.icon || "fas fa-users"}"></i> ${about.scenes?.title || "应用场景"}</h3>
                        <ul class="about-scene-list">
                            ${(about.scenes?.items || []).map((item) => `<li><strong>${item.split("：")[0]}：</strong>${item.split("：").slice(1).join("：")}</li>`).join("")}
                        </ul>
                    </div>
                </div>
            </section>
            <section class="unified-section" id="feedback-section">
                <div class="section-container">
                    <div class="intro-card">
                        <h3><i class="${about.feedback?.icon || "fas fa-comments"}"></i> ${about.feedback?.title || "建议反馈"}</h3>
                        <form id="feedback-form" class="about-feedback-form">
                            <div class="about-feedback-grid">
                                <div>
                                    <label class="about-form-label">${about.feedback?.nameLabel || "姓名/组织"}</label>
                                    <input type="text" name="name" class="about-form-control" required>
                                </div>
                                <div>
                                    <label class="about-form-label">${about.feedback?.typeLabel || "反馈类型"}</label>
                                    <select name="type" class="about-form-control">
                                        ${(about.feedback?.typeOptions || []).map((item) => `<option>${item}</option>`).join("")}
                                    </select>
                                </div>
                            </div>
                            <div class="about-feedback-field">
                                <label class="about-form-label">${about.feedback?.contentLabel || "反馈详情"}</label>
                                <textarea name="content" rows="5" class="about-form-control about-form-textarea" required></textarea>
                            </div>
                            <button type="submit" class="about-feedback-submit">${about.feedback?.submitLabel || "提交反馈"}</button>
                        </form>
                    </div>
                </div>
            </section>
        `;
    };

    const initPortalPages = () => {
        const shell = document.querySelector(".portal-shell[data-page-kind]");
        if (!shell) return;

        const pageKind = shell.getAttribute("data-page-kind");
        if (pageKind === "listing") {
            renderListingPage(shell, shell.getAttribute("data-list-key"));
        }

        if (pageKind === "videos") {
            renderVideoPage(shell);
        }

        if (pageKind === "spirit") {
            renderSpiritPage(shell, shell.getAttribute("data-spirit-key"));
        }

        if (pageKind === "about") {
            renderAboutPage(shell);
        }
    };

    const syncVideoDropdown = () => {
        const videoNavLink = Array.from(document.querySelectorAll(".nav-item > a")).find((link) => link.getAttribute("href") === "videos.html");
        if (!videoNavLink) return;

        const dropdown = videoNavLink.parentElement.querySelector(".dropdown");
        if (!dropdown) return;

        dropdown.innerHTML = `
            <a href="videos.html?cat=antiJapanese">抗联精神视频档案</a>
            <a href="videos.html?cat=beidahuang">北大荒精神视频档案</a>
            <a href="videos.html?cat=daqing">大庆铁人精神视频档案</a>
            <a href="videos.html?cat=longjiang">龙江思政科普视频档案</a>
        `;
    };

    const injectGovChrome = () => {
        const navbar = document.querySelector(".navbar");
        if (navbar && !document.querySelector(".gov-topbar")) {
            const topbarChips = Array.isArray(govChromeCopy.topbarChips) && govChromeCopy.topbarChips.length
                ? govChromeCopy.topbarChips
                : ["静态展示站点", "红色思政资源整合平台"];
            const topbar = document.createElement("div");
            topbar.className = "gov-topbar";
            topbar.innerHTML = `
                <div class="gov-topbar-inner">
                    <div class="gov-site-sign">
                        <span class="gov-site-sign-label">${govChromeCopy.topbarLabel || "政府网标准公示通栏"}</span>
                        <span>${PROJECT_TEXT}</span>
                    </div>
                    <div class="gov-topbar-meta">
                        ${topbarChips.map((chip) => `<span class="gov-topbar-chip">${chip}</span>`).join("")}
                        <span class="gov-topbar-chip gov-topbar-chip-strong">全站访问总点击量 <strong>${SITE_TOTAL_VISITS}</strong></span>
                    </div>
                </div>
            `;
            navbar.insertAdjacentElement("beforebegin", topbar);
        }

        const footer = document.querySelector(".footer");
        if (footer && !footer.querySelector(".gov-footer-note")) {
            const footerNotes = Array.isArray(govChromeCopy.footerNotes) && govChromeCopy.footerNotes.length
                ? govChromeCopy.footerNotes
                : ["适配静态站云端覆盖上传"];
            const footerNote = document.createElement("div");
            footerNote.className = "gov-footer-note";
            footerNote.innerHTML = `
                <span>官方展示标注：${PROJECT_TEXT}</span>
                <span>全站访问总点击量：<strong>${SITE_TOTAL_VISITS}</strong></span>
                ${footerNotes.map((note) => `<span>${note}</span>`).join("")}
            `;

            const footerBottom = footer.querySelector(".footer-bottom");
            if (footerBottom) {
                footerBottom.insertAdjacentElement("beforebegin", footerNote);
            } else {
                footer.appendChild(footerNote);
            }
        }
    };

    const injectHomeQuickStats = () => {
        if (pathname !== "index.html") return;

        const heroBanner = document.querySelector(".hero-banner");
        if (!heroBanner) return;

        let stats = document.querySelector(".quick-stats");
        if (!stats) {
            stats = document.createElement("section");
            stats.className = "quick-stats";
            stats.innerHTML = `
                <article class="stat-item" data-stat-kind="article-reads">
                    <span class="stat-label">${quickStatsCopy.articleReadsLabel || "单篇图文阅读量"}</span>
                    <h3>${ARTICLE_READ_RANGE.displayRange}</h3>
                    <p>${quickStatsCopy.articleReadsDescription || "覆盖思政推文、科普文章、教学文献"}</p>
                </article>
                <article class="stat-item" data-stat-kind="video-plays">
                    <span class="stat-label">${quickStatsCopy.videoPlaysLabel || "专题视频播放量"}</span>
                    <h3>${VIDEO_PLAY_RANGE.displayRange}</h3>
                    <p>${quickStatsCopy.videoPlaysDescription || "覆盖抗联、北大荒、大庆铁人、龙江专题视频"}</p>
                </article>
            `;
            heroBanner.insertAdjacentElement("afterend", stats);
        }

        if (!stats.querySelector('[data-stat-kind="site-visits"]')) {
            const visitCard = document.createElement("article");
            visitCard.className = "stat-item stat-item-emphasis";
            visitCard.setAttribute("data-stat-kind", "site-visits");
            visitCard.innerHTML = `
                <span class="stat-label">${quickStatsCopy.siteVisitsLabel || "全站访问总点击量"}</span>
                <h3>${SITE_TOTAL_VISITS}</h3>
                <p>${quickStatsCopy.siteVisitsDescription || "基于站内专题内容生成的静态展示数值"}</p>
            `;
            stats.prepend(visitCard);
        }
    };

    const syncHomepageContent = () => {
        if (pathname !== "index.html") return;

        if (homePageConfig.metaTitle) {
            document.title = homePageConfig.metaTitle;
        }

        const navLogo = document.querySelector(".nav-logo");
        if (navLogo) {
            navLogo.innerHTML = `<i class="fas fa-landmark"></i> ${SITE_NAME}`;
        }

        const heroSlides = document.querySelectorAll(".hero-banner .hero-slide");
        const heroSlidesConfig = Array.isArray(homePageConfig.heroSlides) && homePageConfig.heroSlides.length
            ? homePageConfig.heroSlides
            : DEFAULT_HOME_HERO_SLIDES;
        if (heroSlides.length) {
            heroSlides.forEach((slide, index) => {
                const slideConfig = heroSlidesConfig[index] || DEFAULT_HOME_HERO_SLIDES[index] || {};

                if (slideConfig.image) {
                    slide.style.backgroundImage = `url('${slideConfig.image}')`;
                }

                const titleNode = slide.querySelector(".hero-content h1");
                const subtitleNode = slide.querySelector(".hero-content p");
                const ctaNode = slide.querySelector(".hero-content a");

                if (titleNode && slideConfig.title) titleNode.textContent = slideConfig.title;
                if (subtitleNode && slideConfig.subtitle) subtitleNode.textContent = slideConfig.subtitle;
                if (ctaNode) {
                    if (slideConfig.ctaLabel) ctaNode.innerHTML = slideConfig.ctaLabel;
                    if (slideConfig.ctaHref) ctaNode.setAttribute("href", slideConfig.ctaHref);
                }
            });
        }

        const spiritTitle = document.querySelector("#spirit-intro .section-title h2");
        const spiritSubtitle = document.querySelector("#spirit-intro .section-title p");
        if (spiritTitle && homePageConfig.spiritIntro?.title) {
            spiritTitle.textContent = homePageConfig.spiritIntro.title;
        }
        if (spiritSubtitle && homePageConfig.spiritIntro?.subtitle) {
            spiritSubtitle.textContent = homePageConfig.spiritIntro.subtitle;
        }

        const spiritCardImages = [
            homePageConfig.heroSlides?.[0]?.image || portalData?.spirits?.antiJapanese?.gallery?.[0]?.image,
            homePageConfig.heroSlides?.[1]?.image || portalData?.spirits?.beidahuang?.gallery?.[0]?.image,
            homePageConfig.heroSlides?.[2]?.image || portalData?.spirits?.daqing?.gallery?.[0]?.image,
            homePageConfig.heroSlides?.[3]?.image || portalData?.spirits?.ironman?.gallery?.[0]?.image
        ];
        document.querySelectorAll("#spirit-intro .people-card .people-img").forEach((imageNode, index) => {
            if (spiritCardImages[index]) {
                imageNode.setAttribute("src", spiritCardImages[index]);
            }
        });

        const mainSections = document.querySelectorAll("main.container > section");
        const longjiangSection = mainSections[0];
        if (longjiangSection && homePageConfig.longjiangFeature) {
            const titleNode = longjiangSection.querySelector("h2");
            const descNode = longjiangSection.querySelector("p");
            const ctaNode = longjiangSection.querySelector("a");
            const imageNode = longjiangSection.querySelector("img");

            if (titleNode && homePageConfig.longjiangFeature.title) titleNode.textContent = homePageConfig.longjiangFeature.title;
            if (descNode && homePageConfig.longjiangFeature.description) descNode.textContent = homePageConfig.longjiangFeature.description;
            if (ctaNode) {
                if (homePageConfig.longjiangFeature.ctaLabel) {
                    ctaNode.innerHTML = `${homePageConfig.longjiangFeature.ctaLabel} <i class="fas fa-arrow-right"></i>`;
                }
                if (homePageConfig.longjiangFeature.ctaHref) {
                    ctaNode.setAttribute("href", homePageConfig.longjiangFeature.ctaHref);
                }
            }
            if (imageNode && homePageConfig.longjiangFeature.image) {
                imageNode.setAttribute("src", homePageConfig.longjiangFeature.image);
            }
        }

        const latestSectionTitle = document.querySelector("main.container > section:nth-of-type(2) .section-title");
        if (latestSectionTitle && homePageConfig.latestSectionTitle) {
            latestSectionTitle.textContent = homePageConfig.latestSectionTitle;
        }

        const previewCards = document.querySelectorAll("main.container > section:nth-of-type(2) .resource-grid .card");
        const previewConfig = homePageConfig.latestPreviews || {};

        const articleCard = previewCards[0];
        if (articleCard && previewConfig.articles) {
            articleCard.innerHTML = `
                <h4><i class="${previewConfig.articles.icon || "fas fa-book"}"></i> ${previewConfig.articles.title || "最新思政文章"}</h4>
                <ul class="home-preview-list">
                    ${(previewConfig.articles.items || [])
                        .map(
                            (item) => `
                                <li class="home-preview-list__item">
                                    <a href="${item.href || "articles.html"}">${item.title}</a>
                                    ${item.meta ? `<span class="home-preview-list__meta">${item.meta}</span>` : ""}
                                </li>
                            `
                        )
                        .join("")}
                </ul>
                <a href="${previewConfig.articles.moreHref || "articles.html"}" class="home-preview-card__action">${previewConfig.articles.moreLabel || "查看更多"} <i class="fas fa-angle-right"></i></a>
            `;
        }

        const videoCard = previewCards[1];
        if (videoCard && previewConfig.videos) {
            videoCard.innerHTML = `
                <h4><i class="${previewConfig.videos.icon || "fas fa-video"}"></i> ${previewConfig.videos.title || "精选视频资源"}</h4>
                <div class="home-preview-gallery">
                    ${(previewConfig.videos.items || [])
                        .map(
                            (item) => `
                                <div class="home-preview-gallery__item">
                                    <img src="${item.image}" alt="${item.title}" class="home-preview-gallery__image">
                                    <p class="home-preview-gallery__title">${item.title}</p>
                                </div>
                            `
                        )
                        .join("")}
                </div>
                <a href="${previewConfig.videos.moreHref || "videos.html"}" class="home-preview-card__action home-preview-card__action--block">${previewConfig.videos.moreLabel || "更多视频"} <i class="fas fa-angle-right"></i></a>
            `;
        }

        const resourceCard = previewCards[2];
        if (resourceCard && previewConfig.resources) {
            resourceCard.innerHTML = `
                <h4><i class="${previewConfig.resources.icon || "fas fa-file-powerpoint"}"></i> ${previewConfig.resources.title || "热门教学资源"}</h4>
                <ul class="home-preview-list">
                    ${(previewConfig.resources.items || [])
                        .map(
                            (item) => `
                                <li class="home-preview-list__item home-preview-list__item--plain">
                                    <i class="${item.icon || "far fa-file-lines"} home-preview-list__icon"></i> ${item.title}
                                </li>
                            `
                        )
                        .join("")}
                </ul>
                <a href="${previewConfig.resources.moreHref || "resources.html"}" class="home-preview-card__action">${previewConfig.resources.moreLabel || "下载专区"} <i class="fas fa-angle-right"></i></a>
            `;
        }

        const footerBrandTitle = document.querySelector(".footer-grid > div:first-child h4");
        const footerBrandProject = document.querySelector(".footer-grid > div:first-child p:first-of-type");
        const footerBrandDesc = document.querySelector(".footer-grid > div:first-child p:nth-of-type(2)");
        if (footerBrandTitle) footerBrandTitle.textContent = SITE_NAME;
        if (footerBrandProject) footerBrandProject.textContent = PROJECT_TEXT;
        if (footerBrandDesc && homePageConfig.footerDescription) {
            footerBrandDesc.textContent = homePageConfig.footerDescription;
        }
    };

    const syncSiteBackgrounds = () => {
        const globalBackground = siteBackgrounds.global;
        if (globalBackground) {
            document.body.style.setProperty("--site-bg-image", `url('${globalBackground}')`);
        }
    };

    const syncDataBannerImages = () => {
        const resolveBannerImage = () => {
            if (!portalData) return "";

            const mappedBanner = siteBackgrounds.pageBanners?.[pathname];
            const bannerMap = {
                "about.html": mappedBanner || portalData.aboutPage?.banner?.image,
                "spirit-anti-japanese.html": portalData.spirits?.antiJapanese?.gallery?.[0]?.image || portalData.homePage?.heroSlides?.[0]?.image,
                "spirit-beidahuang.html": portalData.spirits?.beidahuang?.gallery?.[0]?.image || portalData.homePage?.heroSlides?.[1]?.image,
                "spirit-daqing.html": portalData.spirits?.daqing?.gallery?.[0]?.image || portalData.homePage?.heroSlides?.[2]?.image,
                "spirit-ironman.html": portalData.spirits?.ironman?.gallery?.[0]?.image || portalData.spirits?.ironman?.people?.[0]?.image,
                "spirit-longjiang.html": portalData.spirits?.longjiang?.gallery?.[0]?.image || portalData.homePage?.longjiangFeature?.image,
                "articles.html": portalData.listings?.articles?.items?.[0]?.image,
                "literature.html": portalData.channels?.literature?.items?.[0]?.cover,
                "classroom.html": portalData.listings?.articles?.items?.[5]?.image || portalData.homePage?.heroSlides?.[0]?.image,
                "resources.html": portalData.aboutPage?.banner?.image || portalData.homePage?.heroSlides?.[0]?.image,
                "videos.html": portalData.videos?.categories?.[0]?.items?.[0]?.image || portalData.homePage?.heroSlides?.[0]?.image
            };

            return mappedBanner || bannerMap[pathname] || "";
        };

        document.querySelectorAll("[data-banner-image]").forEach((section) => {
            const bannerImage = section.getAttribute("data-banner-image") || resolveBannerImage();
            if (bannerImage) {
                section.style.backgroundImage = `url('${bannerImage}')`;
            }
        });
    };

    const injectProjectMarks = () => {
        document.querySelectorAll(".footer p").forEach((paragraph) => {
            if (paragraph.textContent.includes("站点示例占位文案")) {
                paragraph.textContent = PROJECT_TEXT;
            }

            if (paragraph.textContent.includes("备案号：黑ICP备XXXXXXXX号") || paragraph.textContent.includes("申报单位：[您的大学名称]")) {
                paragraph.textContent = `© 2026 ${SITE_NAME} - ${SITE_SUBTITLE}`;
            }
        });

        const resourcePages = [
            "articles.html",
            "resources.html",
            "literature.html",
            "classroom.html",
            "spirit-anti-japanese.html",
            "spirit-beidahuang.html",
            "spirit-daqing.html",
            "spirit-ironman.html",
            "spirit-longjiang.html",
            "videos.html"
        ];

        if (resourcePages.includes(pathname) && !document.querySelector(".resource-tailmark")) {
            const footer = document.querySelector("footer.footer");
            const tailmark = document.createElement("div");
            tailmark.className = "resource-tailmark";
            tailmark.textContent = "平台说明：本页内容依据权威红色文化与思政资源进行整合展示，仅用于公益性思政学习、课堂辅助与科普传播。";

            if (footer) {
                footer.insertAdjacentElement("beforebegin", tailmark);
            } else {
                document.body.appendChild(tailmark);
            }
        }
    };

    initPortalPages();
    createMobileMenu();
    initBackToTop();
    syncVideoDropdown();
    injectGovChrome();
    syncSiteBackgrounds();
    syncDataBannerImages();
    syncHomepageContent();
    injectHomeQuickStats();
    injectProjectMarks();
    initVideoPopup();
    initHeroSlider();

    console.log("北疆红韵 - 门户化渲染脚本加载完成");
});
