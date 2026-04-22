/**
 * 北疆红韵 - 核心交互脚本 (极致美化与功能强化版)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 移动端菜单切换逻辑
    const createMobileMenu = () => {
        const navContainer = document.querySelector('.nav-container');
        const menuBtn = document.createElement('div');
        menuBtn.className = 'menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.style.cssText = 'display: none; font-size: 1.8rem; cursor: pointer; color: var(--light-gold);';
        
        if (window.innerWidth <= 768) {
            menuBtn.style.display = 'block';
        }
        
        navContainer.appendChild(menuBtn);
        
        const navLinks = document.querySelector('.nav-links');
        menuBtn.addEventListener('click', () => {
            const isFlex = navLinks.style.display === 'flex';
            navLinks.style.display = isFlex ? 'none' : 'flex';
            if (!isFlex) {
                navLinks.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    top: 80px;
                    left: 0;
                    width: 100%;
                    background: var(--primary-dark);
                    padding: 20px;
                    z-index: 1000;
                    border-bottom: 3px solid var(--secondary-gold);
                `;
            }
        });
    };
    createMobileMenu();

    // 2. 返回顶部功能
    const backToTop = document.createElement('div');
    backToTop.id = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3. 视频当前页弹出播放功能 (不跳转)
    const initVideoPopup = () => {
        // 创建全局播放弹窗 HTML
        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        overlay.innerHTML = `
            <div class="video-popup-container">
                <div class="close-video"><i class="fas fa-times"></i></div>
                <div class="video-wrapper">
                    <iframe src="" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const iframe = overlay.querySelector('iframe');
        const closeBtn = overlay.querySelector('.close-video');

        // 为所有视频缩略图绑定事件
        document.querySelectorAll('.video-thumb').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const videoUrl = this.getAttribute('data-video-url');
                const title = this.getAttribute('data-title');
                
                if (videoUrl) {
                    if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm')) {
                        // 如果是直接视频文件
                        overlay.querySelector('.video-wrapper').innerHTML = `
                            <video src="${videoUrl}" controls autoplay style="width:100%; height:100%;"></video>
                        `;
                    } else {
                        // 如果是嵌入链接
                        overlay.querySelector('.video-wrapper').innerHTML = `
                            <iframe src="${videoUrl}" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
                        `;
                    }
                    overlay.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    console.log(`正在播放视频：${title}`);
                }
            });
        });

        // 关闭事件
        const closePopup = () => {
            overlay.style.display = 'none';
            overlay.querySelector('.video-wrapper').innerHTML = ''; // 清空内容停止播放
            document.body.style.overflow = 'auto';
        };

        closeBtn.addEventListener('click', closePopup);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });
    };
    initVideoPopup();

    // 4. 首页轮播图逻辑 (如果有)
    const initHeroSlider = () => {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length <= 1) return;

        let currentSlide = 0;
        const nextSlide = () => {
            slides[currentSlide].style.opacity = '0';
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].style.opacity = '1';
        };

        // 初始状态
        slides.forEach((s, i) => s.style.opacity = i === 0 ? '1' : '0');
        setInterval(nextSlide, 5000); // 5秒切换一次
    };
    initHeroSlider();

    // 5. 内容分类筛选器 (用于资源页)
    const filterTabs = document.querySelectorAll('.filter-btn');
    if (filterTabs.length > 0) {
        filterTabs.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter') || 'all';
                filterTabs.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const items = document.querySelectorAll('.article-card, .video-card, .filter-item');
                items.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    console.log("北疆红韵 - 极致美化版脚本加载完成");
});
