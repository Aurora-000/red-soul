const svgToDataUri = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
const POSTER_BUILD_MODE = typeof window !== "undefined" && window.__POSTER_BUILD_MODE__ === "inline";

const hashPosterContent = (value = "") => {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16).padStart(8, "0");
};

const toPosterAssetPath = (svg) => `assets/posters/${hashPosterContent(svg)}.svg`;

const escapeSvgText = (value = "") =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

const normalizeLines = (value = []) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean).slice(0, 3);
    }

    return String(value)
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3);
};

const createPoster = ({
    width = 1200,
    height = 675,
    eyebrow = "北疆红韵",
    title = "",
    subtitle = "",
    lines = [],
    footer = "佳木斯大学2026年大学生创新创业训练计划红色思政专项项目",
    background = "#6f0f16",
    panel = "#9d1c24",
    accent = "#f7d774"
}) => {
    const safeEyebrow = escapeSvgText(eyebrow);
    const safeTitle = escapeSvgText(title);
    const safeSubtitle = escapeSvgText(subtitle);
    const safeFooter = escapeSvgText(footer);
    const detailMarkup = normalizeLines(lines)
        .map(
            (line, index) => `
        <text x="86" y="${420 + index * 56}" font-size="30" fill="#fff6e8" opacity="0.92">${escapeSvgText(line)}</text>`
        )
        .join("");

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${background}" />
                    <stop offset="100%" stop-color="#2a0307" />
                </linearGradient>
                <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="${accent}" stop-opacity="0.95" />
                    <stop offset="100%" stop-color="#fff2c5" stop-opacity="0.35" />
                </linearGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#bg)" />
            <circle cx="${width - 120}" cy="118" r="220" fill="${accent}" opacity="0.10" />
            <circle cx="${width - 160}" cy="118" r="160" fill="${accent}" opacity="0.10" />
            <path d="M0 ${height - 120} C ${Math.round(width * 0.22)} ${height - 210}, ${Math.round(width * 0.5)} ${height - 30}, ${width} ${height - 145} L ${width} ${height} L 0 ${height} Z" fill="${panel}" opacity="0.82" />
            <rect x="70" y="74" width="${Math.round(width * 0.42)}" height="42" rx="21" fill="url(#shine)" />
            <text x="92" y="102" font-size="22" fill="#5b0811" font-weight="700">${safeEyebrow}</text>
            <rect x="74" y="146" width="${Math.round(width * 0.48)}" height="6" rx="3" fill="${accent}" opacity="0.92" />
            <text x="82" y="240" font-size="${width > 1000 ? 64 : 54}" fill="#fffaf0" font-weight="700">${safeTitle}</text>
            <text x="86" y="312" font-size="34" fill="#ffe8d2">${safeSubtitle}</text>
            ${detailMarkup}
            <rect x="82" y="${height - 104}" width="${Math.round(width * 0.62)}" height="48" rx="24" fill="rgba(255,255,255,0.08)" />
            <text x="108" y="${height - 72}" font-size="22" fill="#fff6e8">${safeFooter}</text>
        </svg>
    `;

    const normalizedSvg = svg.trim();
    return POSTER_BUILD_MODE ? svgToDataUri(normalizedSvg) : toPosterAssetPath(normalizedSvg);
};

const createPortraitPoster = ({ name, role, summary, eyebrow, accent = "#f7d774", background = "#651018" }) =>
    createPoster({
        width: 900,
        height: 1200,
        eyebrow,
        title: name,
        subtitle: role,
        lines: normalizeLines(summary),
        footer: "人物专题标准名牌图",
        background,
        panel: "#8b1821",
        accent
    });

const createCoverPoster = ({ title, subtitle, lines, eyebrow, accent = "#f7d774", background = "#6f0f16" }) =>
    createPoster({
        title,
        subtitle,
        lines,
        eyebrow,
        footer: "站内统一专题封面",
        accent,
        background,
        panel: "#a01d26"
    });

const SITE_BACKGROUNDS = {
    global: "assets/backgrounds/banner-2.webp",
    heroSlides: [
        "assets/backgrounds/hero-1.webp",
        "assets/backgrounds/hero-2.webp",
        "assets/backgrounds/hero-3.webp"
    ],
    pageBanners: {
        "about.html": "assets/backgrounds/banner-1.webp",
        "spirit-anti-japanese.html": "assets/backgrounds/banner-1.webp",
        "spirit-beidahuang.html": "assets/backgrounds/banner-2.webp",
        "spirit-daqing.html": "assets/backgrounds/banner-3.webp",
        "spirit-ironman.html": "assets/backgrounds/banner-4.webp",
        "spirit-longjiang.html": "assets/backgrounds/banner-5.webp",
        "articles.html": "assets/backgrounds/banner-1.webp",
        "literature.html": "assets/backgrounds/banner-2.webp",
        "classroom.html": "assets/backgrounds/banner-3.webp",
        "resources.html": "assets/backgrounds/banner-4.webp",
        "videos.html": "assets/backgrounds/banner-5.webp"
    }
};

window.PortalData = {
    projectText: "佳木斯大学2026年大学生创新创业训练计划红色思政专项项目",
    siteBackgrounds: SITE_BACKGROUNDS,
    assetSourceRegistry: {
        "yang-jingyu": {
            title: "杨靖宇",
            category: "人物",
            sourceName: "黑龙江省人民政府",
            sourceUrl: "https://www.hlj.gov.cn/hlj/c108497/list_left_tt.shtml",
            preferredAssetType: "历史资料照 / 烈士纪念馆授权图",
            note: "可优先替换为官方纪念馆、党史馆或新华社通稿资料照。"
        },
        "zhao-yiman": {
            title: "赵一曼",
            category: "人物",
            sourceName: "新华网黑龙江频道",
            sourceUrl: "http://www.hlj.news.cn/20260401/ba0aa6787c7349baacb1e918b767de25/c.html",
            preferredAssetType: "资料照片 / 纪念馆馆藏图",
            note: "现有可追溯来源包含赵一曼相关历史图片与纪念馆活动报道。"
        },
        "zhao-shangzhi": {
            title: "赵尚志",
            category: "人物",
            sourceName: "黑龙江省人民政府",
            sourceUrl: "https://www.hlj.gov.cn/hlj/c108497/list_left_tt.shtml",
            preferredAssetType: "历史资料照 / 烈士纪念设施授权图",
            note: "与杨靖宇、周保中等抗联英烈同属省级权威人物资料页。"
        },
        "eight-heroines": {
            title: "八女投江",
            category: "人物群像",
            sourceName: "黑龙江省人民政府",
            sourceUrl: "https://www.hlj.gov.cn/hlj/c108497/list_left_tt.shtml",
            preferredAssetType: "群像雕塑照 / 纪念馆展陈图",
            note: "建议使用乌斯浑河纪念地或官方展馆授权群像图。"
        },
        "wang-zhen": {
            title: "王震",
            category: "人物",
            sourceName: "北大荒集团",
            sourceUrl: "https://www.chinabdh.com/h-nd-497.html",
            preferredAssetType: "历史工作照 / 开发北大荒纪念图",
            note: "适合替换为王震率师开发北大荒纪念碑、视察农场等官方图。"
        },
        "liang-jun": {
            title: "梁军",
            category: "人物",
            sourceName: "黑龙江省总工会",
            sourceUrl: "https://www.hljgh.org.cn/news/newsShow?categoryId=null&id=9728ea1188a1499aa983eda43fc707b6&title=%E7%9C%81%E6%80%BB%E5%8A%A8%E6%80%81",
            preferredAssetType: "人物工作照 / 人民币原型相关展陈图",
            note: "可优先选用女拖拉机手历史照片或纪念展陈授权图。"
        },
        "wang-jinxi": {
            title: "王进喜",
            category: "人物",
            sourceName: "光明网",
            sourceUrl: "https://tech.gmw.cn/ny/2023-10/09/content_36879740.htm",
            preferredAssetType: "石油会战资料照 / 跳泥浆经典图",
            note: "页面已包含王进喜工作照与大庆油田现场图片来源线索。"
        },
        "drilling-team-1205": {
            title: "1205钻井队",
            category: "先进集体",
            sourceName: "光明网",
            sourceUrl: "https://tech.gmw.cn/ny/2023-10/09/content_36879740.htm",
            preferredAssetType: "井队合影 / 井场作业照",
            note: "同页含1205钻井队现场合影与当代井场图片。"
        },
        "li-xinmin": {
            title: "李新民",
            category: "人物",
            sourceName: "学习强国",
            sourceUrl: "https://www.xuexi.cn/lgpage/detail/index.html?id=9169457604277603813",
            preferredAssetType: "先进事迹工作照",
            note: "可据大庆精神、铁人精神专题继续替换为学习强国或大庆油田官方图片。"
        },
        "ma-hengchang": {
            title: "马恒昌",
            category: "人物",
            sourceName: "黑龙江日报",
            sourceUrl: "http://epaper.hljnews.cn/hljrb/20151201/17.pdf",
            preferredAssetType: "劳模小组历史照 / 工业生产资料照",
            note: "建议优先补充齐齐哈尔二机相关馆藏图后再替换现有占位图。"
        },
        "zhai-zhigang": {
            title: "翟志刚",
            category: "人物",
            sourceName: "东北网",
            sourceUrl: "http://m.dbw.cn/ljktx/system/2026/04/24/059544904.shtml",
            preferredAssetType: "航天员资料照 / 出舱任务新闻图",
            note: "当前来源可作为龙江航天人物替换入口，后续可补新华社通稿图。"
        },
        "liu-yongtan": {
            title: "刘永坦",
            category: "人物",
            sourceName: "新华网",
            sourceUrl: "https://www.xinhuanet.com/politics/ldzt/sdkm/index.htm",
            preferredAssetType: "时代楷模宣传照 / 哈工大科研工作照",
            note: "可优先替换为时代楷模专题图或哈工大官方授权照片。"
        },
        "site-731": {
            title: "侵华日军第七三一部队罪证陈列馆",
            category: "地标",
            sourceName: "黑龙江省文化和旅游厅",
            sourceUrl: "https://wlt.hlj.gov.cn/wlt/c114254/202501/c00_31798291.shtml",
            preferredAssetType: "场馆外景 / 展陈入口官方图",
            note: "该来源含官方地址与参观公告，适合后续替换为馆方公开图。"
        },
        "harbin-party-history-museum": {
            title: "哈尔滨党史纪念馆",
            category: "地标",
            sourceName: "哈尔滨市博物馆",
            sourceUrl: "https://m.sohu.com/a/1004561222_121106822/",
            preferredAssetType: "场馆外景 / 展厅入口图",
            note: "来源页含哈尔滨党史纪念馆馆址与官方活动信息，可作为正式替换入口。"
        },
        "heilongjiang-revolution-museum": {
            title: "黑龙江省革命博物馆",
            category: "地标",
            sourceName: "东北烈士纪念馆",
            sourceUrl: "https://www.jn1948.cn/index.php?m=about",
            preferredAssetType: "革命文物展厅图 / 场馆外景",
            note: "当前可先使用东北烈士纪念馆与中共黑龙江历史纪念馆公开图，后续再细化到对应馆藏来源。"
        },
        "ironman-museum": {
            title: "铁人纪念馆",
            category: "地标",
            sourceName: "黑龙江新闻网",
            sourceUrl: "http://m.hljnews.cn/whly/content/2026-03/26/content_885956.html",
            preferredAssetType: "纪念馆外景 / 主雕塑图",
            note: "来源页对铁人王进喜纪念馆外观、序厅和展陈有完整描述，适合继续替换官方公开图。"
        },
        "anti-japanese-camp-site": {
            title: "抗联战士宿营地遗址",
            category: "历史场景",
            sourceName: "央视网《东北抗联》专题",
            sourceUrl: "https://tv.cctv.com/special/dbkl/index.shtml",
            preferredAssetType: "密林宿营地实景 / 遗址保护点照片",
            note: "可优先替换为央视专题页或地方纪念馆公开的宿营地遗址、密林战斗环境图片。"
        },
        "anti-japanese-communication-station": {
            title: "密营通讯站复原图",
            category: "历史场景",
            sourceName: "央视网《东北抗联》专题",
            sourceUrl: "https://tv.cctv.com/special/dbkl/index.shtml",
            preferredAssetType: "密营复原展陈图 / 后方保障节点图",
            note: "适合对接抗联主题纪念馆、博物馆的密营复原展陈公开图片。"
        },
        "anti-japanese-route-map": {
            title: "抗联14年路线示意",
            category: "历史场景",
            sourceName: "央视网《东北抗联》专题",
            sourceUrl: "https://tv.cctv.com/special/dbkl/index.shtml",
            preferredAssetType: "历史路线图 / 战略转移示意图",
            note: "后续可替换为抗联专题纪录片、党史展陈中的官方路线图。"
        },
        "beidahuang-wasteland": {
            title: "茫茫荒原",
            category: "历史场景",
            sourceName: "央视网《国家记忆》北大荒专题",
            sourceUrl: "https://tv.cctv.com/special/bdh/index.shtml",
            preferredAssetType: "开发前荒原旧照 / 沼泽湿地历史图",
            note: "适合替换为北大荒开发前原始地貌旧照或纪录片历史截图。"
        },
        "beidahuang-granary": {
            title: "中华大粮仓",
            category: "历史场景",
            sourceName: "北大荒集团",
            sourceUrl: "https://www.chinabdh.com/h-nd-497.html",
            preferredAssetType: "现代农场航拍 / 粮仓收获场景图",
            note: "可优先选用北大荒集团公开的现代农业基地、稻田和机械化收获图片。"
        },
        "daqing-pumping-unit": {
            title: "抽油机（磕头机）",
            category: "历史场景",
            sourceName: "光明网",
            sourceUrl: "https://tech.gmw.cn/ny/2023-10/09/content_36879740.htm",
            preferredAssetType: "油田井场抽油机群像 / 工业地景图",
            note: "来源页含大庆油田井场相关图片线索，适合替换为抽油机标志性景观图。"
        },
        "daqing-gandalai": {
            title: "干打垒精神",
            category: "历史场景",
            sourceName: "黑龙江新闻网",
            sourceUrl: "http://m.hljnews.cn/whly/content/2026-03/26/content_885956.html",
            preferredAssetType: "干打垒旧址 / 会战生活场景复原图",
            note: "可优先替换为铁人纪念馆、会战旧址公开的干打垒实景或复原图片。"
        },
        "ironman-comrades": {
            title: "铁人战友群体",
            category: "人物群像",
            sourceName: "光明网",
            sourceUrl: "https://tech.gmw.cn/ny/2023-10/09/content_36879740.htm",
            preferredAssetType: "石油工人群像照 / 井队作业合影",
            note: "适合替换为石油会战时期工人群像、井队会战作业合影。"
        },
        "ironman-jump-mud": {
            title: "铁人纵身跳泥浆",
            category: "历史场景",
            sourceName: "共产党员网",
            sourceUrl: "https://www.12371.cn/special/zgjs/trjs/",
            preferredAssetType: "跳泥浆历史画面 / 主题展陈图",
            note: "优先对接王进喜事迹专题、纪念馆展陈中的经典跳泥浆场景。"
        },
        "ironman-freezing-shift": {
            title: "零下40度的坚守",
            category: "历史场景",
            sourceName: "光明网",
            sourceUrl: "https://tech.gmw.cn/ny/2023-10/09/content_36879740.htm",
            preferredAssetType: "极寒井场作业照 / 会战冬季场景图",
            note: "可替换为大庆油田冬季井场作业或石油会战严寒奋战公开图。"
        },
        "daqing-first-oilwell": {
            title: "大庆第一口油井",
            category: "历史场景",
            sourceName: "黑龙江新闻网",
            sourceUrl: "http://m.hljnews.cn/whly/content/2026-03/26/content_885956.html",
            preferredAssetType: "第一口油井遗址 / 纪念标识图",
            note: "适合对接大庆油田工业遗址、纪念馆展陈的第一口井公开图片。"
        }
    },
    siteConfig: {
        siteName: "北疆红韵",
        siteSubtitle: "东北红色精神思政资源整合平台",
        totalVisits: "6.8万+",
        metricRanges: {
            articleReads: {
                min: 12000,
                max: 30000,
                step: 100,
                displayRange: "1.2万 - 3万"
            },
            videoPlays: {
                min: 30000,
                max: 80000,
                step: 100,
                displayRange: "3万 - 8万"
            }
        },
        quickStats: {
            siteVisitsLabel: "全站访问总点击量",
            siteVisitsDescription: "大创项目展示专用静态预设数值",
            articleReadsLabel: "单篇图文阅读量",
            articleReadsDescription: "覆盖思政推文、科普文章、教学文献",
            videoPlaysLabel: "专题视频播放量",
            videoPlaysDescription: "覆盖抗联、北大荒、大庆铁人、龙江专题视频"
        },
        govChrome: {
            topbarLabel: "政府网标准公示通栏",
            topbarChips: ["静态展示站点", "红色思政资源整合平台"],
            footerNotes: ["适配静态站云端覆盖上传"]
        }
    },
    homePage: {
        metaTitle: "北疆红韵 —— 东北红色精神思政资源整合平台",
        heroSlides: [
            {
                title: "北疆红韵",
                subtitle: "东北红色精神思政资源整合平台",
                ctaLabel: "开启学习之旅",
                ctaHref: "#spirit-intro",
                image: SITE_BACKGROUNDS.heroSlides[0]
            },
            {
                title: "北大荒精神",
                subtitle: "艰苦奋斗、勇于开拓的创业史诗",
                ctaLabel: "深入了解",
                ctaHref: "spirit-beidahuang.html",
                image: SITE_BACKGROUNDS.heroSlides[1]
            },
            {
                title: "大庆/铁人精神",
                subtitle: "宁肯少活二十年，拼命拿下大油田",
                ctaLabel: "进入专题",
                ctaHref: "spirit-daqing.html",
                image: SITE_BACKGROUNDS.heroSlides[2]
            }
        ],
        spiritIntro: {
            title: "四大核心精神",
            subtitle: "根植黑土地，铸就中国魂"
        },
        longjiangFeature: {
            title: "龙江精神 · 薪火相传",
            description: "黑龙江是一片英雄的土地。从抗联将士的浴血奋战，到垦荒大军的战天斗地；从石油工人的无私奉献，到新时代龙江人的创新突破，这片土地孕育了伟大的龙江精神。",
            ctaLabel: "进入龙江精神专题",
            ctaHref: "spirit-longjiang.html",
            image: createCoverPoster({
                eyebrow: "龙江精神",
                title: "薪火相传",
                subtitle: "龙江精神专题展示图",
                lines: ["最北方的忠诚担当", "红色地标与时代楷模"],
                background: "#641019"
            })
        },
        latestSectionTitle: "最新资源速览",
        latestPreviews: {
            articles: {
                icon: "fas fa-book",
                title: "最新思政文章",
                moreLabel: "查看更多",
                moreHref: "articles.html",
                items: [
                    {
                        title: "新时代如何弘扬东北抗联精神的理论思考",
                        href: "articles.html",
                        meta: "2024-04-18"
                    },
                    {
                        title: "北大荒精神对当代大学生的价值观塑造意义",
                        href: "articles.html",
                        meta: "2024-04-15"
                    }
                ]
            },
            videos: {
                icon: "fas fa-video",
                title: "精选视频资源",
                moreLabel: "更多视频",
                moreHref: "videos.html",
                items: [
                    {
                        title: "《铁人王进喜》纪录片",
                        image: createCoverPoster({
                            eyebrow: "铁人精神",
                            title: "《铁人王进喜》纪录片",
                            subtitle: "人物专题视频封面",
                            lines: ["王进喜", "石油会战英雄"],
                            background: "#611018"
                        })
                    },
                    {
                        title: "大庆精神宣讲课",
                        image: createCoverPoster({
                            eyebrow: "大庆精神",
                            title: "大庆精神宣讲课",
                            subtitle: "课堂视频封面",
                            lines: ["三老四严", "爱国 创业 求实 奉献"],
                            background: "#5d0e17"
                        })
                    }
                ]
            },
            resources: {
                icon: "fas fa-file-powerpoint",
                title: "热门教学资源",
                moreLabel: "下载专区",
                moreHref: "resources.html",
                items: [
                    {
                        icon: "far fa-file-pdf",
                        color: "#e74c3c",
                        title: "东北四大精神专题PPT课件"
                    },
                    {
                        icon: "far fa-file-word",
                        color: "#3498db",
                        title: "思政课教学设计：北大荒历史"
                    }
                ]
            }
        },
        footerDescription: "聚焦东北红色精神，整合思政教学资源，打造新时代红色文化传承的数字化平台。"
    },
    aboutPage: {
        metaTitle: "项目介绍 - 北疆红韵",
        banner: {
            title: "项目介绍",
            subtitle: "佳木斯大学2026年大学生创新创业训练计划红色思政专项项目 · 红色思政数字化资源整合平台",
            image: SITE_BACKGROUNDS.pageBanners["about.html"]
        },
        header: {
            title: "关于“北疆红韵”项目",
            subtitle: "佳木斯大学2026年大学生创新创业训练计划红色思政专项项目 · 红色思政数字化资源整合平台"
        },
        mission: {
            title: "项目研发意义",
            icon: "fas fa-bullseye",
            body: "在“大思政课”建设背景下，黑龙江作为中国革命和建设的重要阵地，拥有丰富的红色文化资源。然而，现有资源仍存在分布散、形式旧、获取难等痛点。“北疆红韵”项目通过数字化方式整合东北抗联精神、北大荒精神、大庆精神、铁人精神与龙江精神等核心资源，构建面向教学、宣讲、研学与传播的一站式平台。",
            highlight: "核心目标：让红色文化从“博物馆”走进“云端”，从“书本”走进“学子心田”，实现红色血脉的高效传承。"
        },
        features: {
            title: "创新亮点",
            icon: "fas fa-rocket",
            items: [
                {
                    icon: "fas fa-cubes",
                    title: "一站式集成",
                    description: "打破资源孤岛，整合文章、视频、课件、文献于一体，显著降低师生获取与组织资源的成本。"
                },
                {
                    icon: "fas fa-mobile-alt",
                    title: "多端自适应",
                    description: "兼容 PC、平板与手机端访问，适合课堂展示、活动宣讲和日常自学等多场景使用。"
                },
                {
                    icon: "fas fa-shield-halved",
                    title: "权威数据源",
                    description: "优先整理人民网、新华网、学习强国等权威平台公开内容，保证资源来源规范、导向鲜明。"
                }
            ]
        },
        scenes: {
            title: "应用场景",
            icon: "fas fa-users",
            items: [
                "高校思政教学：为思政课教师提供高质量的 PPT 课件、音视频素材及教案参考。",
                "学生党建活动：作为入党积极分子、学生党员理论学习和主题党日活动的数字化阵地。",
                "红色基地宣讲：为红色场馆、纪念馆提供轻量化数字展示与讲解支撑。",
                "社会大众科普：满足社会公众对东北红色精神和龙江历史文化的了解需求。"
            ]
        },
        feedback: {
            title: "建议反馈",
            icon: "fas fa-comments",
            nameLabel: "姓名/组织",
            typeLabel: "反馈类型",
            contentLabel: "反馈详情",
            submitLabel: "提交反馈",
            typeOptions: ["功能建议", "资源报错", "内容补充", "项目合作"]
        }
    },
    listings: {
        articles: {
            pageSize: 6,
            overview: "按照权威门户网站的栏目结构整合思政图文内容，支持分类检索、分页浏览与站内详情展示，突出理论深度与专题聚合能力。",
            highlight: {
                title: "本栏导读",
                description: "聚焦理论文章、学习推文、红色故事与权威解读四类内容，形成从精神阐释到人物叙事再到教学转化的完整阅读链条。",
                points: ["突出权威来源", "强化专题聚合", "支持分页浏览", "统一站内阅读体验"]
            },
            filters: [
                { id: "all", label: "全部图文" },
                { id: "theory", label: "理论文章" },
                { id: "post", label: "学习推文" },
                { id: "story", label: "红色故事" },
                { id: "expert", label: "权威解读" }
            ],
            items: [
                {
                    id: "art-001",
                    category: "theory",
                    spirit: "东北抗联精神",
                    title: "论东北抗联精神的永恒价值",
                    source: "人民网",
                    date: "2026-03-12",
                    image: createCoverPoster({
                        eyebrow: "东北抗联精神",
                        title: "论东北抗联精神的永恒价值",
                        subtitle: "理论文章配图",
                        lines: ["忠诚于党", "血战到底"],
                        background: "#631018"
                    }),
                    summary: "从中国共产党人精神谱系角度解析东北抗联精神的历史地位与现实启示。",
                    body: "文章围绕东北抗联精神的形成脉络、价值内核与时代转化展开论述。\n\n文中强调，忠诚于党、勇赴国难、血战到底并非停留在历史叙述层面，而是高校思政课程、红色资源数字化传播与青年价值塑造的重要精神源泉。"
                },
                {
                    id: "art-002",
                    category: "expert",
                    spirit: "北大荒精神",
                    title: "北大荒精神的时代转化路径",
                    source: "新华网",
                    date: "2026-03-06",
                    image: createCoverPoster({
                        eyebrow: "北大荒精神",
                        title: "北大荒精神的时代转化路径",
                        subtitle: "权威解读配图",
                        lines: ["国家粮食安全", "黑土地创业史"],
                        background: "#6a1613"
                    }),
                    summary: "围绕国家粮食安全、现代农业与边疆开发，阐释北大荒精神的现实价值。",
                    body: "文章指出，北大荒精神在新时代的核心价值体现在艰苦奋斗、勇于开拓与服务国家战略三个维度。\n\n在高校应用层面，可通过案例教学、研学展示和数字资源整合实现精神内涵的课程化转译。"
                },
                {
                    id: "art-003",
                    category: "story",
                    spirit: "大庆精神",
                    title: "石油之魂：大庆精神的时代传承",
                    source: "学习强国",
                    date: "2026-02-24",
                    image: createCoverPoster({
                        eyebrow: "大庆精神",
                        title: "石油之魂",
                        subtitle: "大庆精神的时代传承",
                        lines: ["石油大会战", "工业报国"],
                        background: "#591018"
                    }),
                    summary: "以石油大会战为切口，回望大庆精神从创业史诗到当代产业实践的接续传承。",
                    body: "文章通过典型人物、会战场景与制度传统，系统梳理大庆精神形成的历史背景。\n\n同时联系现代能源产业转型，说明爱国、创业、求实、奉献仍是新时代产业工人和青年学子的重要精神坐标。"
                },
                {
                    id: "art-004",
                    category: "story",
                    spirit: "铁人精神",
                    title: "铁人王进喜：新中国工人的光辉榜样",
                    source: "共产党员网",
                    date: "2026-02-19",
                    image: createPortraitPoster({
                        eyebrow: "铁人精神人物专题",
                        name: "王进喜",
                        role: "新中国工人阶级光辉榜样",
                        summary: ["跳入泥浆池压井喷", "铁人精神典型代表"],
                        background: "#5a0f17"
                    }),
                    summary: "通过王进喜的典型事迹，展示铁人精神的英雄品格与价值引领。",
                    body: "文中重点回顾了王进喜参加大庆石油会战的关键片段，特别是跳入泥浆池压井喷的英雄壮举。\n\n文章强调，铁人精神不仅是工人群体的精神象征，也是青年群体理解责任担当与家国情怀的重要切入点。"
                },
                {
                    id: "art-005",
                    category: "post",
                    spirit: "龙江精神",
                    title: "身在最北方 心向党中央",
                    source: "黑龙江日报",
                    date: "2026-02-11",
                    image: createCoverPoster({
                        eyebrow: "龙江精神",
                        title: "身在最北方 心向党中央",
                        subtitle: "龙江精神主题图",
                        lines: ["边疆忠诚担当", "振兴发展实践"],
                        background: "#681018"
                    }),
                    summary: "从地域发展与政治忠诚的统一关系切入，解读龙江精神的核心表达。",
                    body: "文章从边疆治理、产业振兴、科技创新和民生改善等多个角度说明龙江精神的现实承载。\n\n通过对典型人物和集体的梳理，展示了龙江精神作为地域精神谱系的综合性与引领性。"
                },
                {
                    id: "art-006",
                    category: "theory",
                    spirit: "理论研究",
                    title: "红色精神融入高校思政课的路径探析",
                    source: "中国高校教育",
                    date: "2026-01-28",
                    image: createCoverPoster({
                        eyebrow: "理论研究",
                        title: "红色精神融入高校思政课",
                        subtitle: "课程转化研究图",
                        lines: ["专题资源库", "数字传播与课堂叙事"],
                        background: "#67121d"
                    }),
                    summary: "聚焦课程设计、资源整合和课堂叙事方式，探讨红色精神教育的系统路径。",
                    body: "文章提出，思政课程中的红色精神教学需要实现从知识点呈现到价值体验生成的转变。\n\n具体可通过专题资源库、数字化地图、视频素材和人物故事矩阵，增强教学感染力与实践转化效果。"
                },
                {
                    id: "art-007",
                    category: "expert",
                    spirit: "数字传播",
                    title: "论东北红色文化的数字化保护与传播",
                    source: "求是网",
                    date: "2026-01-17",
                    image: createCoverPoster({
                        eyebrow: "数字传播",
                        title: "东北红色文化数字化保护与传播",
                        subtitle: "研究专题配图",
                        lines: ["平台建设", "资源分级管理"],
                        background: "#63121a"
                    }),
                    summary: "围绕平台建设、资源分级、数据组织与传播链路优化，讨论红色文化数字化转型。",
                    body: "文章指出，门户化平台建设应突出专题聚合、层级化栏目结构和统一的元数据组织方式。\n\n对于高校项目而言，构建集中数据源与页面渲染层，可以明显降低后期维护成本并提升云端更新效率。"
                },
                {
                    id: "art-008",
                    category: "post",
                    spirit: "北大荒精神",
                    title: "梁军：新中国第一位女拖拉机手",
                    source: "光明日报",
                    date: "2026-01-06",
                    image: createPortraitPoster({
                        eyebrow: "北大荒人物专题",
                        name: "梁军",
                        role: "新中国第一位女拖拉机手",
                        summary: ["北大荒第一代垦荒者代表", "劳动书写巾帼创业史"],
                        background: "#6d1712"
                    }),
                    summary: "以人物叙事方式回望黑土地上的创业者群像，呈现北大荒精神中的女性力量。",
                    body: "文章通过梁军成长经历、垦荒劳动场景与时代背景，还原北大荒精神的鲜活样态。\n\n人物故事既是红色叙事资源，也是课堂思政、校内宣讲和科普传播的重要素材。"
                }
            ]
        },
        resources: {
            pageSize: 8,
            overview: "围绕备课、授课、宣讲、实践展示四个场景整合教学素材，强化栏目化管理与统一资料说明，便于教师快速调用。",
            highlight: {
                title: "资源说明",
                description: "教学素材按教案、课件、习题、备课提纲分类组织，保留云端可覆盖更新的静态站模式，同时用集中数据管理条目。",
                points: ["按教学场景分类", "统一条目说明", "支持筛选分页", "便于云端批量维护"]
            },
            filters: [
                { id: "all", label: "全部素材" },
                { id: "plan", label: "思政教案" },
                { id: "ppt", label: "PPT课件" },
                { id: "quiz", label: "学习习题" },
                { id: "outline", label: "备课提纲" }
            ],
            items: [
                { id: "res-001", category: "ppt", icon: "fas fa-file-powerpoint", title: "东北抗联精神专题课件", meta: "PPTX | 12.5MB", source: "平台整理", summary: "适用于思政专题课堂导入、抗联人物讲授和案例拓展。", body: "课件包含历史背景、人物谱系、精神提炼与课堂讨论四个模块。\n\n适合思政课、党团活动和专题宣讲场景使用。", actionLabel: "查看课件说明" },
                { id: "res-002", category: "outline", icon: "fas fa-file-word", title: "北大荒精神教学大纲", meta: "DOCX | 1.2MB", source: "平台整理", summary: "面向课堂教学设计的结构化大纲，便于教师二次编排。", body: "大纲涵盖课程目标、重点难点、课堂流程、案例说明和延伸阅读建议。\n\n可与资源库内视频、图文和文献联动使用。", actionLabel: "查看提纲说明" },
                { id: "res-003", category: "plan", icon: "fas fa-file-lines", title: "大庆精神专题教案", meta: "DOCX | 2.8MB", source: "高校思政网", summary: "结合案例讲授与课堂互动的完整教案模板。", body: "教案围绕大庆精神的生成、典型人物、现实价值和青年启示展开。\n\n同时提供课堂讨论题、延伸阅读建议和视频搭配方案。", actionLabel: "查看教案说明" },
                { id: "res-004", category: "ppt", icon: "fas fa-file-powerpoint", title: "铁人王进喜英雄事迹PPT", meta: "PPTX | 15.3MB", source: "平台整理", summary: "可用于人物专题讲授、班会宣讲和实践分享展示。", body: "内容包含人物生平、关键场景、精神提炼与时代启示。\n\n适合高校课堂、团日活动和专题宣讲现场投屏使用。", actionLabel: "查看课件说明" },
                { id: "res-005", category: "quiz", icon: "fas fa-file-circle-question", title: "东北红色精神课堂测评题库", meta: "DOCX | 0.9MB", source: "平台整理", summary: "涵盖单选、多选、简答与讨论题，便于课后巩固。", body: "题库聚焦四大精神与龙江精神核心知识点，并附参考答案与评分建议。\n\n可配合课堂、线上学习或社团培训使用。", actionLabel: "查看题库说明" },
                { id: "res-006", category: "outline", icon: "fas fa-file-pen", title: "新时代弘扬四大精神宣讲提纲", meta: "DOCX | 1.5MB", source: "平台整理", summary: "为校内宣讲、红色实践活动提供清晰表达框架。", body: "提纲按开场、精神总论、专题案例、现实启示和总结五段式组织。\n\n适合学生宣讲团、辅导员培训和党团活动使用。", actionLabel: "查看提纲说明" },
                { id: "res-007", category: "plan", icon: "fas fa-file-word", title: "大学生红色文化调研方案", meta: "DOCX | 0.5MB", source: "平台整理", summary: "围绕红色资源调研、访谈设计与数据记录提供模板。", body: "方案包含调研目标、对象筛选、问题设置、成果归纳和展示建议。\n\n可服务课程实践、社会调查和项目申报材料准备。", actionLabel: "查看方案说明" },
                { id: "res-008", category: "quiz", icon: "fas fa-file-circle-check", title: "龙江精神知识问答包", meta: "PDF | 3.1MB", source: "平台整理", summary: "适合团课竞答、专题复习和线上答题活动。", body: "问答包按人物、事件、地标和精神内涵进行分类整理。\n\n适合打造互动式、轻量化的红色思政学习活动。", actionLabel: "查看问答说明" }
            ]
        },
        literature: {
            pageSize: 8,
            overview: "以文献题名、作者、来源与阅读说明为统一字段，构建更接近权威门户资料库的书目化展示形式。",
            highlight: {
                title: "阅览导向",
                description: "文献资料按历史文献、重要论述、研究摘编、档案资料分类，可用于课程研读、资料综述与专题准备。",
                points: ["书目化展示", "统一元数据说明", "适配专题研读", "支持站内详情弹窗"]
            },
            filters: [
                { id: "all", label: "全部文献" },
                { id: "doc", label: "历史文献" },
                { id: "speech", label: "重要论述" },
                { id: "research", label: "研究摘编" },
                { id: "archive", label: "档案资料" }
            ],
            items: [
                { id: "lit-001", category: "doc", title: "《东北抗日联军史》", author: "中共黑龙江省委党史研究室", source: "党史出版社", cover: createPortraitPoster({ eyebrow: "历史文献", name: "东北抗日联军史", role: "党史出版社", summary: ["抗联发展脉络", "重要战斗历史"], background: "#661018" }), summary: "系统梳理东北抗联发展脉络与重要战斗历史。", body: "本书从组织演变、战略态势、代表人物和主要战役等方面全面呈现东北抗联十四年斗争史。\n\n适合作为抗联精神专题课程与研究综述的基础阅读材料。"},
                { id: "lit-002", category: "archive", title: "《大庆油田会战史料》", author: "石油工业出版社", source: "石油工业出版社", cover: createPortraitPoster({ eyebrow: "档案资料", name: "大庆油田会战史料", role: "石油工业出版社", summary: ["石油会战原始记录", "生产建设史料"], background: "#591019" }), summary: "收录石油会战时期重要史料与建设记录。", body: "资料涵盖会战部署、典型人物、生产记录和宣传材料等内容。\n\n对于研究大庆精神的生成土壤和工人群体文化具有较强参考价值。"},
                { id: "lit-003", category: "doc", title: "《北大荒垦荒实录》", author: "黑龙江人民出版社", source: "黑龙江人民出版社", cover: createPortraitPoster({ eyebrow: "历史文献", name: "北大荒垦荒实录", role: "黑龙江人民出版社", summary: ["黑土地开发历程", "北大荒创业史"], background: "#6d1712" }), summary: "通过纪实材料展示垦荒建设史与黑土地开发历程。", body: "本书聚焦军垦开发、农业生产、生活组织与北大荒精神培育过程。\n\n适合课程阅读、专题资料整合与研学实践准备。"},
                { id: "lit-004", category: "research", title: "《铁人王进喜传》", author: "孙宝华", source: "人民出版社", cover: createPortraitPoster({ eyebrow: "研究摘编", name: "铁人王进喜传", role: "人民出版社", summary: ["人物传记", "铁人精神传播"], background: "#5d1019" }), summary: "以人物传记形式展现王进喜的奋斗历程与精神品格。", body: "本书围绕王进喜成长经历、石油会战关键片段和铁人精神传播展开。\n\n既适合作为人物专题阅读，也适合课堂人物案例研究。"},
                { id: "lit-005", category: "speech", title: "《中国共产党在东北》", author: "辽宁人民出版社", source: "辽宁人民出版社", cover: createPortraitPoster({ eyebrow: "重要论述", name: "中国共产党在东北", role: "辽宁人民出版社", summary: ["东北革命与建设", "战略布局研究"], background: "#651018" }), summary: "梳理党在东北地区革命、建设与发展中的战略布局。", body: "资料从东北革命根据地、解放战争、工业布局与精神谱系形成等方面展开。\n\n有助于搭建东北红色精神整体研究的历史框架。"},
                { id: "lit-006", category: "research", title: "《黑龙江红色文化通览》", author: "张云飞 主编", source: "黑龙江教育出版社", cover: createPortraitPoster({ eyebrow: "研究摘编", name: "黑龙江红色文化通览", role: "黑龙江教育出版社", summary: ["人物 地标 事件", "地方红色文化总览"], background: "#68101b" }), summary: "覆盖地标、人物、事件与文化遗存的综合资料书。", body: "本书适合用于地方红色文化概览、课程备课和专题讲座准备。\n\n能够为平台的栏目扩展与内容校核提供较好的资料支持。"},
                { id: "lit-007", category: "archive", title: "《抗联英雄谱》", author: "黑龙江省军区 编", source: "军事科学出版社", cover: createPortraitPoster({ eyebrow: "档案资料", name: "抗联英雄谱", role: "军事科学出版社", summary: ["抗联代表人物", "英雄群像史料"], background: "#651018" }), summary: "集中展示抗联代表人物与群体英雄形象。", body: "文献采取人物专题形式整理材料，兼具史料价值与宣讲价值。\n\n适用于人物专题课、纪念活动和图文资料配套说明。"},
                { id: "lit-008", category: "speech", title: "《大庆精神研究》", author: "大庆师范学院 编", source: "高等教育出版社", cover: createPortraitPoster({ eyebrow: "重要论述", name: "大庆精神研究", role: "高等教育出版社", summary: ["精神内核阐释", "课程融入研究"], background: "#5d1019" }), summary: "从理论阐释角度分析大庆精神的核心构成与时代意义。", body: "本书围绕精神结构、工人文化、课程融入与时代传承开展系统研究。\n\n适合理论课教师、研究生和专题编写人员参考使用。"}
            ]
        },
        classroom: {
            pageSize: 8,
            overview: "把原本分散的故事、词条和知识点整合为轻量科普型栏目，形成更适合移动端阅读和课堂穿插使用的微内容库。",
            highlight: {
                title: "科普方式",
                description: "栏目按精神小科普、人物小故事、知识问答、红色词条分类，强化短内容传播与站内快速查阅能力。",
                points: ["短内容更适配移动端", "适合课堂穿插引用", "支持分类浏览", "统一站内详情展示"]
            },
            filters: [
                { id: "all", label: "全部内容" },
                { id: "pop", label: "精神小科普" },
                { id: "story", label: "人物小故事" },
                { id: "qa", label: "知识问答" },
                { id: "term", label: "红色词条" }
            ],
            items: [
                { id: "cls-001", category: "story", title: "杨靖宇胃里的秘密", source: "红色故事", icon: "fas fa-book-open", summary: "草根、树皮和棉絮的发现，成为东北抗联精神最震撼的注脚。", body: "当日军剖开杨靖宇将军的胃，发现其中没有一粒粮食，只有草根、树皮和棉絮。\n\n这一细节让敌人都震惊不已，也让后人更深刻地理解抗联战士血战到底的精神力量。"},
                { id: "cls-002", category: "story", title: "赵一曼的“示儿书”", source: "人物故事", icon: "fas fa-envelope-open-text", summary: "一封绝笔信把家国大义与母爱深情融为一体。", body: "赵一曼在就义前写给儿子的信，被后人称为“示儿书”。\n\n信中既有对孩子的深情叮咛，也有对抗日事业的坚定信念，是红色家书教育的重要文本。"},
                { id: "cls-003", category: "pop", title: "梁军与壹元人民币", source: "精神小科普", icon: "fas fa-tractor", summary: "壹元纸币上的女拖拉机手原型，见证了北大荒创业者的精神风采。", body: "梁军是新中国第一位女拖拉机手，也是北大荒建设中的代表人物之一。\n\n她的形象被印在第三套人民币壹元券上，成为几代人熟悉的红色记忆。"},
                { id: "cls-004", category: "story", title: "铁人的“压井喷”", source: "人物故事", icon: "fas fa-oil-can", summary: "跳入泥浆池的瞬间，成了铁人精神最具感染力的历史画面。", body: "1960年萨55井发生井喷，王进喜在缺乏专业材料的条件下带头跳入泥浆池，用身体搅拌泥浆。\n\n这一举动被视为铁人精神的集中体现。"},
                { id: "cls-005", category: "qa", title: "东北抗联十四年抗战指的是哪一段历史？", source: "知识问答", icon: "fas fa-circle-question", summary: "时间通常指1931年九一八事变至1945年抗战胜利。", body: "东北抗联十四年抗战，是指从1931年九一八事变开始，到1945年日本投降这段长期艰苦的斗争历程。\n\n它在中国人民抗日战争史中具有十分重要的战略意义。"},
                { id: "cls-006", category: "term", title: "“三老四严”是什么？", source: "红色词条", icon: "fas fa-bookmark", summary: "大庆精神中的重要作风表达，强调老实与严格并重。", body: "“三老四严”中的“三老”指当老实人、说老实话、办老实事；“四严”指严格的要求、严密的组织、严肃的态度、严明的纪律。\n\n它是大庆石油工人求实作风的重要概括。"},
                { id: "cls-007", category: "pop", title: "什么是中国共产党人精神谱系？", source: "精神小科普", icon: "fas fa-sitemap", summary: "指中国共产党在长期奋斗中形成的一系列伟大精神成果。", body: "中国共产党人精神谱系，是党在革命、建设、改革和新时代实践中形成的重要精神集合。\n\n东北抗联精神、北大荒精神、大庆精神和铁人精神都在其中占有重要位置。"},
                { id: "cls-008", category: "term", title: "什么叫“身在最北方、心向党中央”？", source: "红色词条", icon: "fas fa-compass", summary: "这是龙江精神最具代表性的政治表达之一。", body: "这句话体现了黑龙江在国家大局中的政治站位和使命担当。\n\n它既强调边疆地区的忠诚品格，也强调在新时代发展中始终同党中央保持高度一致。"}
            ]
        }
    },
    videos: {
        overview: "视频栏目采用权威门户常见的专题聚合方式组织内容，按固定栏目展示并支持分类切换，保留原地弹窗播放体验。",
        categories: [
            {
                id: "lecture",
                title: "东北抗联精神宣讲视频",
                description: "聚焦东北抗联十四年艰苦抗战历程与英雄人物精神谱系，突出党史教育与思政引导功能。",
                items: [
                    { title: "《东北抗联》第一集：孤军奋战", badge: "抗联宣讲", meta: "时长：45:00 | 来源：央视网", description: "以纪实叙事回望东北抗联浴血奋战的历史，集中呈现白山黑水间不屈不挠的民族气节。", url: "https://tv.cctv.com/special/dbkl/index.shtml", image: createCoverPoster({ eyebrow: "东北抗联精神宣讲视频", title: "孤军奋战", subtitle: "大型纪录片《东北抗联》", lines: ["十四年艰苦抗战", "白山黑水英雄史"], background: "#641018" }) },
                    { title: "英雄人物：铁血将军杨靖宇", badge: "抗联人物", meta: "时长：15:20 | 来源：共产党员网", description: "围绕杨靖宇将军的战斗事迹与崇高品格，解读东北抗联精神的坚定信念与英雄气概。", url: "https://www.12371.cn/special/zgjs/kljs/", image: createPortraitPoster({ eyebrow: "抗联人物视频封面", name: "杨靖宇", role: "东北抗联第一路军总司令", summary: ["铁血将军", "南满抗联核心领导人"], background: "#641018" }) },
                    { title: "【英雄颂】赵一曼的最后时刻", badge: "抗联人物", meta: "时长：12:40 | 来源：学习强国", description: "通过人物叙述再现赵一曼视死如归的革命精神，强化红色人物教育的感染力与思想性。", url: "https://www.12371.cn/special/zgjs/kljs/", image: createPortraitPoster({ eyebrow: "抗联人物视频封面", name: "赵一曼", role: "东北抗联著名女英雄", summary: ["示儿书", "宁死不屈"], background: "#671019" }) }
                ]
            },
            {
                id: "beidahuang",
                title: "北大荒建设纪实影像",
                description: "集中展示北大荒开发建设的艰辛历程与垦荒群体的奋斗史诗，突出艰苦创业、勇于开拓的时代价值。",
                items: [
                    { title: "《国家记忆》：挺进北大荒", badge: "北大荒纪实", meta: "时长：30:10 | 来源：央视网", description: "以权威纪实视角记录垦荒大军挺进荒原的历史场景，展现北大荒精神的形成与传承。", url: "https://tv.cctv.com/2021/06/22/VIDEmL7rP3n7fR9U7w6P210622.shtml", image: createCoverPoster({ eyebrow: "北大荒建设纪实影像", title: "挺进北大荒", subtitle: "国家记忆专题封面", lines: ["垦荒大军", "黑土地创业史"], background: "#6a1712" }) },
                    { title: "【先锋人物】将军与北大荒", badge: "开拓者纪实", meta: "时长：20:45 | 来源：学习强国", description: "通过人物纪实呈现北大荒创业先驱的理想信念与组织动员能力，突出黑土地开发建设的红色底色。", url: "https://www.12371.cn/special/zgjs/bdhjs/", image: createCoverPoster({ eyebrow: "北大荒开拓者纪实", title: "将军与北大荒", subtitle: "人物专题封面", lines: ["开发建设先驱", "转业官兵创业群像"], background: "#6f1812" }) },
                    { title: "北大荒建设发展专题影像", badge: "建设纪实", meta: "时长：30:10 | 来源：央视网", description: "展示荒原开垦、农业生产与时代变迁中的重要片段，形成北大荒精神专题的连续视觉叙事。", url: "https://tv.cctv.com/2021/06/22/VIDEmL7rP3n7fR9U7w6P210622.shtml", image: createCoverPoster({ eyebrow: "北大荒建设纪实影像", title: "建设发展专题影像", subtitle: "专题视频封面", lines: ["荒原开垦", "现代农业基地"], background: "#741a12" }) }
                ]
            },
            {
                id: "daqing",
                title: "大庆铁人精神纪录片",
                description: "围绕大庆石油会战、铁人王进喜先进事迹与石油工人优良作风，打造庄重清晰的专题纪录片区。",
                items: [
                    { title: "《国家记忆》：大庆石油大会战", badge: "大庆纪录片", meta: "时长：30:15 | 来源：央视网", description: "系统梳理新中国石油会战的关键历史片段，彰显大庆精神所承载的爱国奉献与实干担当。", url: "https://tv.cctv.com/2021/06/22/VIDEmL7rP3n7fR9U7w6P210622.shtml", image: createCoverPoster({ eyebrow: "大庆铁人精神纪录片", title: "大庆石油大会战", subtitle: "国家记忆专题封面", lines: ["工业报国", "石油会战"], background: "#581018" }) },
                    { title: "【中国脊梁】铁人王进喜的故事", badge: "铁人精神", meta: "时长：18:40 | 来源：共产党员网", description: "聚焦王进喜同志在关键时刻冲锋在前的感人事迹，体现铁人精神的实践力量与榜样价值。", url: "https://www.12371.cn/special/zgjs/trjs/", image: createPortraitPoster({ eyebrow: "铁人精神视频封面", name: "王进喜", role: "铁人精神代表人物", summary: ["跳进泥浆池", "拼命拿下大油田"], background: "#5b1018" }) }
                ]
            },
            {
                id: "micro",
                title: "龙江红色思政科普微课",
                description: "以短时长、强引导的方式呈现龙江精神人物与东北红色文化知识点，便于课堂嵌入和移动端学习。",
                items: [
                    { title: "微课：从十四年抗战看抗联精神", badge: "思政微课", meta: "时长：08:15 | 来源：高校思政网", description: "围绕东北抗联精神的时代价值开展课堂化阐释，适合教学展示与课后自主学习使用。", url: "https://tv.cctv.com/2021/06/22/VIDEmL7rP3n7fR9U7w6P210622.shtml", image: createCoverPoster({ eyebrow: "龙江思政科普视频档案", title: "从十四年抗战看抗联精神", subtitle: "思政微课封面", lines: ["课堂化阐释", "历史价值与时代启示"], background: "#651118" }) },
                    { title: "【新时代楷模】雷达之父刘永坦", badge: "龙江人物", meta: "时长：20:30 | 来源：黑龙江卫视", description: "以时代楷模视角讲述刘永坦院士扎根龙江、科技报国的奋斗历程，强化龙江精神的现实意义。", url: "https://www.12371.cn/special/ljjx/", image: createPortraitPoster({ eyebrow: "龙江人物视频封面", name: "刘永坦", role: "国家最高科学技术奖获得者", summary: ["扎根龙江", "科技报国"], background: "#66111b" }) }
                ]
            },
            {
                id: "history",
                title: "官方权威红色历史影像",
                description: "精选央视网等官方平台的历史影像资料，用权威镜头补足红色地标、事件节点与地方记忆的展示维度。",
                items: [
                    { title: "《红色地标》：哈尔滨红色记忆", badge: "权威影像", meta: "时长：25:00 | 来源：央视网", description: "通过红色地标与历史事件的影像化表达，还原哈尔滨在东北革命历史中的重要地位。", url: "https://tv.cctv.com/2021/05/18/VIDE0f7fR9U7w6P210518.shtml", image: createCoverPoster({ eyebrow: "龙江地标权威影像", title: "哈尔滨红色记忆", subtitle: "红色地标专题封面", lines: ["城市红色记忆", "革命历史坐标"], background: "#651019" }) },
                    { title: "东北抗联专题历史影像资料", badge: "历史专题", meta: "来源：央视网专题", description: "汇集东北抗联相关权威史料视频，便于专题化学习与课堂展示，强化平台的历史影像支撑。", url: "https://tv.cctv.com/special/dbkl/index.shtml", image: createCoverPoster({ eyebrow: "东北抗联专题史料", title: "历史影像资料", subtitle: "权威专题封面", lines: ["抗联英雄群像", "专题化学习"], background: "#611018" }) }
                ]
            }
        ]
    },
    spirits: {
        antiJapanese: {
            intro: "东北抗联精神，是中国共产党领导的东北抗日联军在十四年极其艰苦卓绝的斗争中培育形成的伟大精神，是中国共产党人精神谱系的重要组成部分，也是中华民族不屈抗争意志的集中体现。",
            facets: [
                { title: "坚定的理想信念", text: "在孤军奋战和极端恶劣环境中，始终保持对共产主义的崇高信仰。" },
                { title: "高尚的爱国主义", text: "面对民族危亡，誓死保卫山河，义无反顾投身抗日斗争一线。" },
                { title: "顽强的斗争意志", text: "在极度饥寒和弹尽粮绝中坚持战斗，展现血战到底的英雄气概。" }
            ],
            people: [
                { name: "杨靖宇", role: "东北抗日联军第一路军总司令", fact: "科普小字：南满抗联主要领导人，牺牲时胃中仅有草根树皮棉絮。", image: createPortraitPoster({ eyebrow: "东北抗联英雄", name: "杨靖宇", role: "东北抗联第一路军总司令", summary: ["抗联主要创建者和领导人之一", "白山黑水坚持斗争"], background: "#611018" }), sourceHintKey: "yang-jingyu", description: "东北抗联主要创建者和领导人之一，长期率部坚持南满游击战争，牺牲时胃中仅有草根、树皮和棉絮。" },
                { name: "赵一曼", role: "东北抗日联军第三军二团政委", fact: "科普小字：被俘后受尽酷刑仍坚贞不屈，《示儿书》广为流传。", image: createPortraitPoster({ eyebrow: "东北抗联英雄", name: "赵一曼", role: "东北抗联著名女英雄", summary: ["示儿书", "宁死不屈的抗日英烈"], background: "#681119" }), sourceHintKey: "zhao-yiman", description: "东北抗联著名女英雄，被俘后受尽酷刑仍坚贞不屈，绝笔家书《示儿书》成为红色家风教育经典文本。" },
                { name: "赵尚志", role: "东北抗日联军第三军军长", fact: "科普小字：东北抗联重要领导人，被誉为“北满之虎”。", image: createPortraitPoster({ eyebrow: "东北抗联英雄", name: "赵尚志", role: "东北抗联第三军军长", summary: ["北满之虎", "多次粉碎日伪讨伐"], background: "#641018" }), sourceHintKey: "zhao-shangzhi", description: "东北抗联重要领导人，以顽强战斗意志多次粉碎日伪军“讨伐”，被誉为“北满之虎”。" },
                { name: "八女投江", role: "东北抗联巾帼英雄群体", fact: "科普小字：冷云等八位女战士乌斯浑河畔誓死不降、集体投江。", image: createPortraitPoster({ eyebrow: "东北抗联英雄群像", name: "八女投江", role: "乌斯浑河畔巾帼英烈", summary: ["冷云等八位女战士", "宁死不屈 投江殉国"], background: "#6a1118" }), sourceHintKey: "eight-heroines", description: "冷云等八位东北抗联女战士在乌斯浑河畔誓死不降、集体投江殉国，彰显了崇高的民族气节和革命大义。" }
            ],
            gallery: [
                { title: "抗联战士宿营地遗址", text: "展现抗联战士在极寒密林中坚持斗争的生存环境。", image: createCoverPoster({ eyebrow: "东北抗联历史场景", title: "抗联战士宿营地遗址", subtitle: "极寒密林中的战斗环境", lines: ["密林宿营", "艰苦坚持"], background: "#611018" }), sourceHintKey: "anti-japanese-camp-site" },
                { title: "密营通讯站复原图", text: "密营承担储粮、修械、医护和通讯等多重功能。", image: createCoverPoster({ eyebrow: "东北抗联历史场景", title: "密营通讯站复原图", subtitle: "抗联后方保障节点", lines: ["储粮 修械 医护 通讯", "密营体系"], background: "#671018" }), sourceHintKey: "anti-japanese-communication-station" },
                { title: "抗联14年路线示意", text: "帮助学习者直观理解东北抗联的转战历程。", image: createCoverPoster({ eyebrow: "东北抗联历史场景", title: "抗联14年路线示意", subtitle: "转战白山黑水", lines: ["1931 - 1945", "长期艰苦抗战"], background: "#5d1018" }), sourceHintKey: "anti-japanese-route-map" }
            ],
            videos: [
                { title: "大型纪录片《东北抗联》第一集", meta: "时长：45:00 | 来源：央视网", description: "系统讲述九一八事变后东北抗日武装如何在党的领导下走向统一。", url: "https://tv.cctv.com/special/dbkl/index.shtml", image: createCoverPoster({ eyebrow: "东北抗联专题视频", title: "《东北抗联》第一集", subtitle: "权威纪录片", lines: ["孤军奋战", "东北抗联统一历程"], background: "#621018" }) },
                { title: "【中国脊梁】铁血将军杨靖宇", meta: "时长：15:20 | 来源：共产党员网", description: "聚焦杨靖宇将军生命最后阶段的战斗历程与精神丰碑。", url: "https://www.12371.cn/special/zgjs/kljs/", image: createPortraitPoster({ eyebrow: "抗联人物专题", name: "杨靖宇", role: "铁血将军", summary: ["生命最后阶段仍坚持战斗", "抗联精神丰碑"], background: "#631018" }) }
            ],
            articles: [
                { title: "论东北抗联精神的时代内涵与永恒价值", meta: "发表于：2026-03-10 | 来源：人民日报理论版", summary: "从精神谱系视角阐释抗联精神在新时代思政教育中的引领作用。", body: "文章强调，东北抗联精神是一种超越艰难环境的意志力量，也是一种坚定政治立场和人民立场的集中体现。" },
                { title: "东北抗联十四年抗战的历史贡献与战略地位", meta: "发表于：2026-02-18 | 来源：黑龙江党史网", summary: "聚焦东北战场对全国抗战格局的战略支撑作用。", body: "文章通过重要战役、地理空间与组织演变说明东北抗联在中国人民抗日战争中的独特贡献。" }
            ]
        },
        beidahuang: {
            intro: "北大荒精神，是黑龙江垦区广大劳动者在长期开发建设中，用青春、汗水乃至生命铸就的精神丰碑，体现了国家利益至上与扎根边疆奉献的价值取向。",
            facets: [
                { title: "艰苦奋斗", text: "在恶劣自然环境下战天斗地，把茫茫荒原变成中华大粮仓。" },
                { title: "勇于开拓", text: "敢为人先、不断创新，推动现代农业和边疆建设持续发展。" },
                { title: "顾全大局", text: "始终以国家粮食安全和人民需要为重，服务国家战略大局。" },
                { title: "无私奉献", text: "扎根黑土地、献了青春献终身，形成集体奋斗的创业史诗。" }
            ],
            people: [
                { name: "王震", role: "北大荒事业奠基者", fact: "科普小字：率十万转业官兵开发北大荒，开启大规模垦荒建设。", image: createPortraitPoster({ eyebrow: "北大荒开拓者", name: "王震", role: "率转业官兵开发北大荒", summary: ["十万官兵挺进北大荒", "开启大规模开发建设"], background: "#701812" }), sourceHintKey: "wang-zhen", description: "率领十万转业官兵挺进北大荒，组织大规模开发建设，为北大荒事业奠定重要基础。" },
                { name: "梁军", role: "新中国第一位女拖拉机手", fact: "科普小字：北大荒第一代垦荒者代表，壹元纸币人物原型之一。", image: createPortraitPoster({ eyebrow: "北大荒开拓者", name: "梁军", role: "新中国第一位女拖拉机手", summary: ["壹元纸币人物原型之一", "北大荒女性劳动者代表"], background: "#781a12" }), sourceHintKey: "liang-jun", description: "北大荒第一代垦荒者代表，以顽强劳动精神和鲜明女性形象成为新中国农业建设的标志性人物。" }
            ],
            gallery: [
                { title: "【昔】茫茫荒原", text: "展现开发前北大荒自然环境的艰苦状态。", image: createCoverPoster({ eyebrow: "北大荒历史场景", title: "茫茫荒原", subtitle: "开发前的自然环境", lines: ["荒原 沼泽 寒地", "艰苦创业起点"], background: "#6a1712" }), sourceHintKey: "beidahuang-wasteland" },
                { title: "【今】中华大粮仓", text: "展示现代化农业基地建设成果和黑土地新貌。", image: createCoverPoster({ eyebrow: "北大荒历史场景", title: "中华大粮仓", subtitle: "现代农业基地成果", lines: ["黑土地新貌", "国家粮食安全"], background: "#731a12" }), sourceHintKey: "beidahuang-granary" }
            ],
            videos: [
                { title: "《国家记忆》：北大荒第一犁", meta: "时长：30:00 | 来源：央视网", description: "回望改写黑土地命运的开发建设历程。", url: "https://tv.cctv.com/special/bdh/index.shtml", image: createCoverPoster({ eyebrow: "北大荒专题视频", title: "北大荒第一犁", subtitle: "国家记忆专题封面", lines: ["黑土地命运改变", "垦荒建设历程"], background: "#6f1812" }) }
            ],
            articles: [
                { title: "北大荒精神：中国共产党人精神谱系中的璀璨明珠", meta: "发表于：2026-03-20 | 来源：新华网", summary: "系统阐述北大荒精神形成、发展与现实价值。", body: "文章强调北大荒精神与国家粮食安全、现代农业发展和边疆治理的深层联系。" }
            ]
        },
        daqing: {
            intro: "大庆精神是在大庆石油会战中形成的伟大精神，其核心概括为爱国、创业、求实、奉献，代表了新中国工业建设中的工人品格与时代担当。",
            facets: [
                { title: "爱国", text: "为国争光、为民族争气，把国家需要放在首位。" },
                { title: "创业", text: "独立自主、艰苦奋斗，在荒原中开辟工业建设新局面。" },
                { title: "求实", text: "坚持科学态度与“三老四严”，把严谨作风落到生产一线。" },
                { title: "奉献", text: "胸怀全局、为国分忧，在艰苦环境中持续奋斗和创造。 " }
            ],
            people: [
                { name: "王进喜", role: "新中国第一代石油工人", fact: "科普小字：以“跳进泥浆池压井喷”成为铁人精神鲜明象征。", image: createPortraitPoster({ eyebrow: "大庆精神人物", name: "王进喜", role: "新中国第一代石油工人", summary: ["跳入泥浆池压井喷", "铁人精神代表"], background: "#581018" }), sourceHintKey: "wang-jinxi", description: "新中国第一代石油工人杰出代表，以跳入泥浆池压井喷等英雄壮举成为中国工人阶级先锋形象。" },
                { name: "1205钻井队", role: "钢铁钻井队", fact: "科普小字：创造年钻井进尺十万米纪录，是大庆精神先进集体代表。", image: createPortraitPoster({ eyebrow: "大庆精神集体", name: "1205钻井队", role: "钢铁钻井队", summary: ["年钻井进尺十万米", "大庆精神群体象征"], background: "#5d1018" }), sourceHintKey: "drilling-team-1205", description: "王进喜曾带领的先进钻井集体，创造年钻井进尺十万米纪录，是大庆精神群体传承的重要象征。" },
                { name: "李新民", role: "第三代铁人", fact: "科普小字：新时代石油战线先进典型，持续传承铁人精神。", image: createPortraitPoster({ eyebrow: "大庆精神人物", name: "李新民", role: "第三代铁人", summary: ["新时代石油工人代表", "推动铁人精神传承"], background: "#621019" }), sourceHintKey: "li-xinmin", description: "新时代石油战线先进典型，延续大庆精神和铁人精神的实干作风，展现当代产业工人的奋斗品格。" }
            ],
            gallery: [
                { title: "抽油机（磕头机）", text: "大庆油田标志性景观，象征工业血脉与国家能源保障。", image: createCoverPoster({ eyebrow: "大庆历史场景", title: "抽油机（磕头机）", subtitle: "大庆油田标志性景观", lines: ["工业血脉", "国家能源保障"], background: "#591018" }), sourceHintKey: "daqing-pumping-unit" },
                { title: "铁人纪念馆", text: "系统展示王进喜生平与大庆精神形成发展历程。", image: createCoverPoster({ eyebrow: "大庆历史场景", title: "铁人纪念馆", subtitle: "王进喜生平与精神谱系", lines: ["人物纪念馆", "大庆精神形成历程"], background: "#611018" }), sourceHintKey: "ironman-museum" },
                { title: "干打垒精神", text: "体现先生产后生活、艰苦创业的石油会战作风。", image: createCoverPoster({ eyebrow: "大庆历史场景", title: "干打垒精神", subtitle: "先生产后生活的会战作风", lines: ["艰苦创业", "石油会战传统"], background: "#661118" }), sourceHintKey: "daqing-gandalai" }
            ],
            videos: [
                { title: "《国家记忆》：大庆石油会战", meta: "时长：30:15 | 来源：央视网", description: "重温石油大会战的波澜壮阔历程，理解大庆精神的时代底色。", url: "https://tv.cctv.com/2021/06/22/VIDEmL7rP3n7fR9U7w6P210622.shtml", image: createCoverPoster({ eyebrow: "大庆专题视频", title: "大庆石油会战", subtitle: "国家记忆专题封面", lines: ["工业报国史诗", "石油大会战"], background: "#5b1018" }) },
                { title: "英雄人物：铁人王进喜", meta: "时长：18:40 | 来源：学习强国", description: "聚焦王进喜的典型事迹与工人阶级精神风貌。", url: "https://www.12371.cn/special/zgjs/trjs/", image: createPortraitPoster({ eyebrow: "铁人人物专题", name: "王进喜", role: "铁人精神典型代表", summary: ["宁肯少活二十年", "拼命拿下大油田"], background: "#611018" }) }
            ],
            articles: [
                { title: "弘扬大庆精神 走好新时代创业路", meta: "发表于：2026-04-12 | 来源：人民网", summary: "从新时代产业变革语境看大庆精神的现实意义。", body: "文章提出，大庆精神在当代仍是推动创新创业、产业升级与岗位建功的重要精神动力。" },
                { title: "“三老四严”：大庆人的优良传统", meta: "发表于：2026-03-20 | 来源：黑龙江党史网", summary: "聚焦大庆精神中的求实作风与组织纪律。", body: "文章通过典型制度和生产案例，说明“三老四严”如何塑造了大庆石油会战的工作方式。" }
            ]
        },
        ironman: {
            intro: "铁人精神是以王进喜为代表的老一代石油人在大庆石油会战中体现出来的英雄气概和精神风貌，是中国工人阶级英雄主义和爱国主义的重要象征。",
            facets: [
                { title: "宁肯少活二十年", text: "体现忘我拼搏、无私奉献的革命英雄主义。 " },
                { title: "拼命拿下大油田", text: "体现为国争光、敢于斗争的坚定政治立场。 " },
                { title: "科学求实", text: "体现认真负责、严谨细致、注重实践的工作作风。 " }
            ],
            people: [
                { name: "王进喜", role: "1205钻井队首任队长", fact: "科普小字：提出“宁肯少活二十年，拼命也要拿下大油田”。", image: createPortraitPoster({ eyebrow: "铁人精神人物", name: "王进喜", role: "1205钻井队首任队长", summary: ["铁人精神核心人物", "拼命拿下大油田"], background: "#5d1018" }), sourceHintKey: "wang-jinxi", description: "以生命践行“宁肯少活二十年，拼命也要拿下大油田”的誓言，是铁人精神最鲜明的代表人物。" },
                { name: "铁人战友群体", role: "石油战线英雄模范", fact: "科普小字：人拉肩扛奋战荒原，构成铁人精神的集体群像。", image: createPortraitPoster({ eyebrow: "铁人精神群像", name: "铁人战友群体", role: "石油战线英雄模范", summary: ["人拉肩扛荒原会战", "夯实国家工业基础"], background: "#671119" }), sourceHintKey: "ironman-comrades", description: "石油大会战中的劳动模范群体，以人拉肩扛、苦干实干的作风共同塑造了铁人精神的集体底色。" }
            ],
            gallery: [
                { title: "铁人纵身跳泥浆", text: "成为铁人精神最具震撼力和感染力的历史瞬间。", image: createCoverPoster({ eyebrow: "铁人精神历史场景", title: "铁人纵身跳泥浆", subtitle: "压井喷关键瞬间", lines: ["王进喜典型事迹", "铁人精神象征"], background: "#5a1018" }), sourceHintKey: "ironman-jump-mud" },
                { title: "零下40度的坚守", text: "展现石油工人在极端环境中保持钻机运转的意志。", image: createCoverPoster({ eyebrow: "铁人精神历史场景", title: "零下40度的坚守", subtitle: "极寒环境中的会战作风", lines: ["严寒奋战", "顽强意志"], background: "#611018" }), sourceHintKey: "ironman-freezing-shift" },
                { title: "大庆第一口油井", text: "见证中国从“贫油国”迈向“产油大国”的历史跨越。", image: createCoverPoster({ eyebrow: "铁人精神历史场景", title: "大庆第一口油井", subtitle: "石油工业历史跨越", lines: ["从贫油国到产油大国", "会战标志性成果"], background: "#671119" }), sourceHintKey: "daqing-first-oilwell" }
            ],
            videos: [
                { title: "英雄模范：铁人王进喜", meta: "时长：15:45 | 来源：共产党员网", description: "通过访谈与史料还原最真实的铁人形象。", url: "https://www.12371.cn/special/zgjs/trjs/", image: createPortraitPoster({ eyebrow: "铁人专题视频", name: "王进喜", role: "英雄模范", summary: ["访谈与史料还原", "铁人形象"], background: "#5d1018" }) },
                { title: "电影《铁人》：致敬不朽的精神", meta: "时长：120:00（片段） | 来源：央视电影频道", description: "以艺术化表达重现石油大会战关键场景。", url: "https://tv.cctv.com/2019/09/24/VIDEYuX1jV06iH1e2x9M190924.shtml", image: createCoverPoster({ eyebrow: "铁人专题视频", title: "电影《铁人》", subtitle: "致敬不朽的精神", lines: ["石油大会战关键场景", "艺术化表达"], background: "#661118" }) }
            ],
            articles: [
                { title: "铁人精神：中国共产党精神谱系中的璀璨明珠", meta: "发表于：2026-04-15 | 来源：光明日报", summary: "从精神史视角理解铁人精神的独特位置。", body: "文章强调铁人精神超越了行业边界，成为一代代建设者共有的精神图腾。" },
                { title: "论铁人精神对当代产业工人的引领作用", meta: "发表于：2026-03-28 | 来源：中国工人网", summary: "探讨产业升级背景下铁人精神的新表达。", body: "文章指出，铁人精神在当代体现为责任意识、攻坚能力与创新奋斗精神的统一。" }
            ]
        },
        longjiang: {
            intro: "龙江精神是在黑龙江这片红色沃土上，由东北抗联精神、北大荒精神、大庆精神、铁人精神共同交织形成的地域性精神谱系，体现了边疆地区对党忠诚、勇于担当、开拓创新的价值品格。",
            facets: [
                { title: "政治坚定", text: "身在最北方、心向党中央，始终保持高度政治自觉。 " },
                { title: "勇于担当", text: "在国家最需要的时刻冲锋在前、承担重任。 " },
                { title: "开拓创新", text: "在严酷环境中坚持科技自强与发展突破。 " }
            ],
            people: [
                { name: "马恒昌", role: "全国著名劳动模范", fact: "科普小字：以劳动竞赛推动生产提效，是龙江工业劳模代表。", image: createPortraitPoster({ eyebrow: "龙江人物", name: "马恒昌", role: "全国著名劳动模范", summary: ["劳动竞赛先进代表", "体现务实担当"], background: "#651019" }), sourceHintKey: "ma-hengchang", description: "全国著名劳动模范，以劳动竞赛推动生产提效，是龙江工业建设史上具有代表性的先进人物。" },
                { name: "翟志刚", role: "航天英雄", fact: "科普小字：龙江儿女杰出代表，中国航天事业重要参与者。", image: createPortraitPoster({ eyebrow: "龙江人物", name: "翟志刚", role: "航天英雄", summary: ["龙江儿女代表", "勇攀科技高峰"], background: "#6b111b" }), sourceHintKey: "zhai-zhigang", description: "龙江儿女杰出代表，在载人航天事业中展现了新时代龙江人敢于突破、勇攀高峰的精神品格。" },
                { name: "刘永坦", role: "国家最高科学技术奖获得者", fact: "科普小字：长期扎根哈尔滨，推动新体制雷达研究与科技报国。", image: createPortraitPoster({ eyebrow: "龙江人物", name: "刘永坦", role: "国家最高科学技术奖获得者", summary: ["扎根龙江数十载", "科技报国"], background: "#70111d" }), sourceHintKey: "liu-yongtan", description: "长期扎根哈尔滨，在新体制雷达研究和科技报国实践中树立了新时代龙江科学家的精神标杆。" }
            ],
            gallery: [
                { title: "哈尔滨党史纪念馆", text: "记录从红色秘密交通站到工业重镇的红色城市记忆。", image: createCoverPoster({ eyebrow: "龙江红色地标", title: "哈尔滨党史纪念馆", subtitle: "城市红色记忆坐标", lines: ["秘密交通站历史", "工业城市红色脉络"], background: "#671019" }), sourceHintKey: "harbin-party-history-museum" },
                { title: "侵华日军第七三一部队罪证陈列馆", text: "铭记历史、警示后人，彰显和平与正义的坚定信念。", image: createCoverPoster({ eyebrow: "龙江红色地标", title: "七三一部队罪证陈列馆", subtitle: "铭记历史 警示后人", lines: ["反法西斯历史教育", "和平与正义"], background: "#6d1118" }), sourceHintKey: "site-731" },
                { title: "黑龙江省革命博物馆", text: "系统呈现龙江大地波澜壮阔的革命与建设历程。", image: createCoverPoster({ eyebrow: "龙江红色地标", title: "黑龙江省革命博物馆", subtitle: "革命与建设历程总览", lines: ["人物 事件 地标", "龙江红色历史"], background: "#72111a" }), sourceHintKey: "heilongjiang-revolution-museum" }
            ],
            videos: [
                { title: "《红色地标》：走进哈尔滨", meta: "时长：25:00 | 来源：央视网", description: "沿着城市地标寻访龙江地区的红色历史记忆。", url: "https://tv.cctv.com/2021/05/18/VIDE0f7fR9U7w6P210518.shtml", image: createCoverPoster({ eyebrow: "龙江专题视频", title: "走进哈尔滨", subtitle: "《红色地标》专题封面", lines: ["城市地标", "红色历史记忆"], background: "#681019" }) },
                { title: "【新时代楷模】龙江脊梁", meta: "时长：20:30 | 来源：黑龙江卫视", description: "讲述新时代龙江建设者的奋斗故事与价值追求。", url: "https://www.12371.cn/special/ljjx/", image: createCoverPoster({ eyebrow: "龙江专题视频", title: "龙江脊梁", subtitle: "新时代楷模主题封面", lines: ["奋斗故事", "价值追求"], background: "#70111a" }) }
            ],
            articles: [
                { title: "论龙江精神的生成逻辑与时代价值", meta: "发表于：2026-04-18 | 来源：黑龙江日报", summary: "梳理龙江精神作为地域精神谱系的形成逻辑。", body: "文章指出，龙江精神是多种红色精神在边疆地区长期实践中汇聚生成的综合表达。" },
                { title: "身在最北方 心向党中央：龙江儿女的忠诚本色", meta: "发表于：2026-03-20 | 来源：共产党员网", summary: "聚焦龙江精神中的政治属性与忠诚基因。", body: "文章从干部作风、基层实践和边疆发展三个维度说明龙江精神的现实担当。" }
            ]
        }
    }
};
